import { Subscriber } from 'rxjs';
import Pipe, { ChildrenMap } from '../Pipe';

export default class Image extends Pipe {
  constructor(src?: string, classes?: string[], children?: ChildrenMap) {
    super('img', classes, children);
    if (src) (this.element as HTMLImageElement).src = src;
  }

  output = {
    src: new Subscriber((newSrc: string) => {
      (this.element as HTMLImageElement).src = newSrc;
    }),
  };
}
