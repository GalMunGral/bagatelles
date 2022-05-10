import { patch, elementClose, elementOpen, text } from "incremental-dom";
import { noop, mapValues } from "lodash";
import { commit } from "./effects";

export class DefaultMap<K extends object, V> extends Map<K, V> {
  public getWithDefault(k: K, defaultValue: V): V {
    // console.debug("[get]", k);
    if (!this.has(k)) {
      // console.debug("[get] misses");
      this.set(k, defaultValue);
    }
    return this.get(k)!;
  }
}

export class Table<K1 extends object, K2 extends object, V> {
  private map = new DefaultMap<K1, DefaultMap<K2, V>>();
  get(k1: K1, k2: K2, defaultValue: V) {
    return this.map
      .getWithDefault(k1, new DefaultMap())
      .getWithDefault(k2, defaultValue);
  }
}

export class Signal<T = void> {
  public static NULL = new Signal<void>();
  private static id = 0;
  private id = Signal.id++;
  private subs = new Set<(v: T) => void>();

  public listen(fn: (v: T) => void) {
    this.subs.add(fn);
  }
  public send(v: T) {
    console.debug("[send]", this.id);
    this.subs.forEach((fn) => fn(v));
  }
}

export type Template = () => void;
type Update<State = any, Config = any, Effect = any> = (
  state: State,
  event: {
    config: Config;
    value: any;
    dispatch: (name: string, value?: any) => void;
  }
) => State | [State, Array<Effect>];

export interface ViewDef<S = any, U extends string = string, C = any> {
  (): S;
  update: Record<U, Update<S, C>>;
  view(
    state: S,
    context: { config: C; update: Record<U, (e: any) => void> }
  ): Template;
}

export type Class<S = any, U extends string = string, C = any> = {
  init(): S;
  update: Record<U, Update<S, C>>;
  view(
    state: S,
    context: { config: C; update: Record<U, (e: any) => void> }
  ): Template;
};

export function Component<S = any, U extends string = string, C = any>(
  cls: Class<S, U, C>
): ViewDef<S, U, C> {
  const { init, update, view } = cls;
  const def = () => init();
  def.update = update ?? {};
  def.view = view ?? noop;
  return def;
}

export class View<S = any, U extends string = string, C = any> {
  private state: S;
  public dirty = new Signal<void>();
  public children = new Table<ViewDef, String, View>();
  private update: Record<U, (value: any) => void> | undefined;
  private handles = (name: string): name is U => {
    return Boolean(this.update && name in this.update);
  };

  constructor(private def: ViewDef<S>, private parent?: View) {
    this.state = def();
    this.dirty.listen(() => {
      this.parent?.dirty.send();
    });
  }

  private dispatch = (name: string, e: any) => {
    console.debug("[dispath]", name, e);
    console.debug(this.update);
    if (this.handles(name)) {
      console.log("handled", this.update![name]);
      this.update![name](e);
    } else {
      this.parent?.dispatch(name, e);
    }
  };

  public view(config?: C) {
    this.update = <Record<U, (value: any) => void>>(
      mapValues(this.def.update, (f) => (value: any) => {
        const res = f(this.state, {
          config,
          value,
          dispatch: this.dispatch,
        });
        let nextState, effects;
        if (Array.isArray(res)) {
          [nextState, effects] = res;
        } else {
          nextState = res;
        }
        this.state = nextState;
        effects?.forEach((eff) => commit(eff));
        this.dirty.send();
      })
    );

    Stack.shared.push(this);
    const template = this.def.view(this.state, {
      config,
      update: this.update,
    });
    Stack.shared.pop();
    return template;
  }
}

class Stack {
  static shared = new Stack();
  private stack: View<any>[] = [];
  public push(v: View<any>) {
    this.stack.push(v);
  }
  public pop() {
    return this.stack.pop();
  }
  public peek() {
    return this.stack[this.stack.length - 1];
  }
}

export function render(rootViewDef: ViewDef<any>, container: HTMLElement) {
  const app = new View(rootViewDef);
  app.dirty.listen(() => patch(container, app.view()));
  app.dirty.send();
}

export function createNode(
  type: string | ViewDef<any>,
  rawAttrs?: JSX.Props,
  ...children: (string | Template)[]
): Template {
  rawAttrs = rawAttrs ?? {};

  const key =
    typeof rawAttrs.key === "string" || typeof rawAttrs.key === "number"
      ? String(rawAttrs.key)
      : "";

  const attrs = Object.entries(rawAttrs)
    .map(([key, value]) => {
      if (/^on[a-z]+$/.test(key)) {
        return [
          key,
          (e: any) => {
            value.forEach((anyUpdate: any) => {
              try {
                anyUpdate(e);
              } catch {}
            });
          },
        ];
      } else if (key === "value") {
        // force incremental-dom to set `value` as property
        return [key, new String(value)];
      } else {
        return [key, value];
      }
    })
    .filter(([_, value]) => value != null);

  if (typeof type == "function") {
    const parent = Stack.shared.peek();
    const view = parent
      ? parent.children.get(type, key, new View(type, parent))
      : new View(type);
    return view.view({ ...rawAttrs, children });
  }

  return () => {
    elementOpen(type, key, null, ...attrs.flat());
    for (let textOrFn of children) {
      if (typeof textOrFn == "function") {
        textOrFn();
      } else {
        text(textOrFn);
      }
    }
    elementClose(type);
  };
}

declare global {
  namespace JSX {
    type Props = { [key: string]: any };
    interface IntrinsicElements {
      [_: string]: Props;
    }
  }
}
