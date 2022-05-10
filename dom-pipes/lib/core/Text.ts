import { Subscriber } from 'rxjs';
import Pipe from '../Pipe';

export default class Text extends Pipe {
  constructor() {
    super('p');
  }

  output = {
    text: new Subscriber((text: string) => {
      this.element.innerHTML = text;
    }),
  };
}
