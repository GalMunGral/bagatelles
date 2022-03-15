import { CSSProperties } from "react";
import { v4 as uuidv4 } from "uuid";
import { randomColor } from "./utils";

export type LNode = ComponentNode | LayoutNode;

export class ComponentNode {
  public id: string = uuidv4();
  public props: object = {};

  static fromJSON(json: any, instance: LayoutInstance): ComponentNode {
    if (!json) return null;
    const node = new ComponentNode(
      json.path,
      LayoutNode.all.get(json.parentId),
      instance
    );
    node.id = json.id;
    node.props = json.props || {};
    return node;
  }

  constructor(
    public path: string,
    public parent: LayoutNode,
    public instance: LayoutInstance
  ) {}

  public toJSON() {
    const { id, path, props, parent } = this;
    return { id, path, props, parentId: parent?.id };
  }
}

export class LayoutNode {
  public static all = new Map<string, LayoutNode>();

  public static fromJSON(json: any, instance: LayoutInstance): LayoutNode {
    if (!json) return null;
    const node = new LayoutNode(LayoutNode.all.get(json.parentId), instance);
    const oldId = node.id;
    node.id = json.id;
    LayoutNode.all.delete(oldId);
    LayoutNode.all.set(node.id, node);
    node.style = json.style;
    node.children = json.children.map((obj: any) =>
      obj.path
        ? ComponentNode.fromJSON(obj, instance)
        : LayoutNode.fromJSON(obj, instance)
    );
    return node;
  }

  public id: string = uuidv4();

  public style: CSSProperties = {
    background: randomColor(),
    width: 100,
    height: 100,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    alignSelf: "stretch",
    flexGrow: 1,
    flexShrink: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
  };

  get normalizedStyle() {
    const style = { ...this.style };
    if (this.style.alignSelf === "stretch") {
      if (this.parent)
        delete style[
          this.parent.style.flexDirection === "column" ? "width" : "height"
        ];
      else {
        delete style.width;
        delete style.height;
      }
    }
    return style;
  }

  children: LNode[] = [];

  constructor(public parent: LayoutNode, private instance: LayoutInstance) {
    LayoutNode.all.set(this.id, this);
  }

  public toJSON() {
    const { id, style, children, parent } = this;
    return { id, style, children, parentId: parent?.id };
  }

  public onMouseUp(e: MouseEvent) {
    e.stopPropagation();
    if (!e.clientX || !e.clientY) return;
    const deltaX = Math.abs(e.clientX - this.instance.fromX);
    const deltaY = Math.abs(e.clientY - this.instance.fromY);

    if (deltaX < 50 && deltaY < 50 && this.instance.fromNode.id === this.id) {
      // click
      this.instance.target = this;
    } else if (this.instance.target) {
      if (deltaX > deltaY) {
        // swipe
        this.instance.target.style.flexDirection = "row";
      } else {
        this.instance.target.style.flexDirection = "column";
      }
    }
  }

  public onMouseDown(e: MouseEvent) {
    e.stopPropagation();
    this.instance.fromX = e.clientX;
    this.instance.fromY = e.clientY;
    this.instance.fromNode = this;
  }

  public onDrop(e: MouseEvent) {
    e.stopPropagation();
    if (this.instance.selectedComponent)
      this.children.push(
        new ComponentNode(this.instance.selectedComponent, this, this.instance)
      );
  }

  public onDragOver(e: MouseEvent) {
    e.preventDefault();
  }
}

export class LayoutInstance {
  private observers: Array<() => void> = [];

  private _root: LayoutNode;
  public get root() {
    return makeReactive(this._root, () => {
      this.observers.forEach((f) => f());
    });
  }

  private active = makeReactive(
    {
      index: 0,
      path: [this.root],
    },
    () => {
      this.observers.forEach((f) => f());
    }
  );

  public get target() {
    return this.active.path[this.active.index];
  }

  public set target(node) {
    this.active.index = 0;
    this.active.path.length = 0;
    for (let cur = node; cur; cur = cur.parent) {
      this.active.path.push(cur);
    }
  }

  public hasFocus = true;

  public selectedComponent: string = "";
  public fromX = -1;
  public fromY = -1;
  public fromNode: LayoutNode;

  constructor(public layoutId: string) {
    this._root =
      LayoutNode.fromJSON(JSON.parse(localStorage.getItem(layoutId)), this) ??
      new LayoutNode(null, this);

    window.addEventListener("resize", () => {
      this.observers.forEach((f) => f());
    });

    window.addEventListener("keyup", (e) => {
      this.handleKeyStroke(e);
    });

    window.addEventListener("mouseup", (e) => {
      this.target = null;
    });
    window.addEventListener("beforeunload", () => {
      this.saveState();
    });
  }

  public saveState() {
    localStorage.setItem(this.layoutId, JSON.stringify(this._root));
  }

  public subscribe(f: () => void) {
    this.observers.push(f);
  }

  public handleKeyStroke(e: KeyboardEvent) {
    if (!this.hasFocus) return;
    if (!this.target) return;
    switch (e.code) {
      case "KeyN": {
        if (this.active.path.length < 1) return;
        const node = new LayoutNode(this.target, this);
        if (this.active.index === 0) {
          console.log("append");
          this.target.children.push(node);
        } else {
          console.log("insertBefore");
          const activeChild = this.active.path[this.active.index - 1];
          const activeParent = this.active.path[this.active.index];
          const index = activeParent.children.findIndex(
            (n) => n.id === activeChild.id
          );
          this.target.children.splice(index, 0, node);
        }
        break;
      }
      case "Backspace": {
        if (this.active.path.length < 1) return;
        if (this.active.index === this.active.path.length - 1) return;
        const activeChild = this.active.path[this.active.index];
        const activeParent = this.active.path[this.active.index + 1];
        const index = activeParent.children.findIndex(
          (n) => n.id === activeChild.id
        );
        activeParent.children.splice(index, 1);
        this.active.path = this.active.path.slice(this.active.index + 1);
        this.active.index = 0;
        LayoutNode.all.delete(activeChild.id);
        break;
      }
      case "ArrowUp": {
        this.active.index = Math.min(
          this.active.path.length - 1,
          this.active.index + 1
        );
        break;
      }
      case "ArrowDown": {
        this.active.index = Math.max(0, this.active.index - 1);
        break;
      }
      case "Space": {
        this.target.style.flexGrow = 1;
        this.target.style.flexShrink = 1;
        break;
      }
    }
  }
}

function proxiable(value) {
  return (
    ((typeof value == "object" && value) || typeof value == "function") &&
    !value["isProxy"]
  );
}

let taskScheduled = false;
export function makeReactive<T extends object>(
  obj: T,
  onChange: () => void
): T {
  if (!proxiable(obj)) return obj;

  return new Proxy(obj, {
    get(target, p, receiver) {
      if (p == "isProxy") return true;

      const value = Reflect.get(target, p, receiver);
      if (!proxiable(value)) return value;

      const descriptor = Reflect.getOwnPropertyDescriptor(target, p);
      if (descriptor && (!descriptor.configurable || !descriptor.writable))
        return value;

      return makeReactive(value, onChange);
    },
    set(target, p, value, receiver) {
      if (!taskScheduled) {
        setTimeout(() => {
          taskScheduled = false; // TODO: what's the order here
          onChange();
        });
        taskScheduled = true;
      }
      Reflect.set(target, "lastModified", Date.now(), target);
      return Reflect.set(target, p, value, receiver);
    },
  });
}
