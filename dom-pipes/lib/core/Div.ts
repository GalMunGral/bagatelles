import Pipe, { ChildrenMap } from '../Pipe';

export default class Div extends Pipe {
  constructor(classes: string[], children: ChildrenMap) {
    super('pipe', classes, children);
  }

  input = Object.assign(
    {},
    ...Object.values(this.children).map((c) => c.input),
  );

  output = Object.assign(
    {},
    ...Object.values(this.children).map((c) => c.output),
  );
}
