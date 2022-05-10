export class Attribute {
  constructor(public name: string, public value: String) {}
}

export const makeAttribute = (name: string) => (value: string) =>
  new Attribute(name, value);

export class Element {
  constructor(
    public name: string,
    public attributes: Attribute[],
    public children: Element[]
  ) {}
}

export const makeElement =
  (name: string) => (attributes: Attribute[]) => (children: Element[]) =>
    new Element(name, attributes, children);
