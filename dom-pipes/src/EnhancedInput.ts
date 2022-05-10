import Pipe from "../lib/Pipe";
import Input from "../lib/core/Input";

export default class EnhancedInput extends Pipe {
  constructor() {
    super("enhanced-input", ["wrapper"], {
      raw: new Input().style({
        border: "none",
        outline: "none",
        padding: "5px",
        width: "100%",
        "font-size": "1rem",
      }),
    });
  }

  style(styleMap: { [name: string]: string }) {
    this.children.raw.style(styleMap);
    return this;
  }

  input = {
    input: this.children.raw.input.input,
  };
}
