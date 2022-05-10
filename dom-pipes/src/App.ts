import { combineLatest } from "rxjs";
import { map, switchMap, share } from "rxjs/operators";
import Pipe from "../lib/Pipe";
import { Text, Div, Image } from "../lib/core";
import EnhancedInput from "./EnhancedInput";

export default class App extends Pipe {
  constructor() {
    super("div", ["app", "flex-column"], {
      div: new Div(["flex-centered"], {
        a: new EnhancedInput().style({
          "font-family": "'VT323', monospace",
          "font-size": "30px",
        }),
        b: new Div(["wrapper"], {
          text: new Text().style({
            margin: "0",
            "font-family": "'Lobster', cursive",
            "font-size": "3rem",
            "font-weight": "900",
            "text-align": "center",
          }),
          img: new Image().style({
            margin: "20px 0 0",
            width: "100%",
            "object-fit": "contain",
          }),
        }),
      }).style({
        height: "700px",
      }),
    });
    this.connect();
  }

  input = {
    textInput: this.children.div.input.input,
  };

  output = {
    textDisplay: this.children.div.output.text,
    imageSrc: this.children.div.output.src,
  };

  connect() {
    const json$ = this.input.textInput.pipe(
      switchMap(() => fetch("https://yesno.wtf/api")),
      switchMap((res) => res.json()),
      share()
    );

    json$.pipe(map((json) => json.image)).subscribe(this.output.imageSrc);

    const truncatedInput = this.input.textInput.pipe(
      map((t) => (t.length > 10 ? "..." : "") + t.slice(-10))
    );

    combineLatest(truncatedInput, json$)
      .pipe(
        map(
          ([text, json]) =>
            `${text} : ${json.answer.padEnd(3, " ").replace(/\s/g, "&nbsp;")}`
        )
      )
      .subscribe(this.output.textDisplay);
  }
}
