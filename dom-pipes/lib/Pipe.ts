import { Observable, Subscriber } from "rxjs";

export interface ChildrenMap {
  [name: string]: Pipe;
}

interface InputMap {
  [name: string]: Observable<any>;
}
interface OutputMap {
  [name: string]: Subscriber<any>;
}

export default class Pipe {
  protected element: HTMLElement;
  public children: ChildrenMap;
  public input: InputMap;
  public output: OutputMap;

  constructor(type: string, classes?: string[], children?: ChildrenMap) {
    this.element = document.createElement(type);
    if (classes && classes.length > 0) this.class(...classes);
    if (children) this.add(children);
  }

  protected connect(): any {
    return this;
  }

  class(...classes) {
    this.element.classList.add(...classes);
    return this;
  }

  style(styleMap: { [name: string]: string }) {
    Object.entries(styleMap).forEach(([name, value]) => {
      this.element.style[name] = value;
    });
    return this;
  }

  add(childrenMap: ChildrenMap) {
    this.children = childrenMap;
    this.element.append(...Object.values(childrenMap).map((p) => p.element));
    return this;
  }

  mount(root: ChildNode) {
    root.replaceWith(this.element);
  }
}
