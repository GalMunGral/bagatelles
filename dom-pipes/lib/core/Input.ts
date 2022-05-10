import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import Pipe from '../Pipe';

export default class Input extends Pipe {
  constructor() {
    super('input');
  }

  input = {
    input: fromEvent(this.element, 'input').pipe(
      map((e) => (e.target as HTMLInputElement).value),
    ),
  };
}
