import { Square } from "./Square.js";

export class Board extends HTMLElement {
  #squareNodes = [];
  #squares = [];

  constructor() {
    super();
    for (let i = 0; i < 3; ++i) {
      const row = document.createElement("div");
      row.class = "board-row";
      for (let j = 0; j < 3; ++j) {
        const square = new Square();
        this.#squareNodes.push(square);
        row.append(square);
      }
      this.append(row);
    }
  }

  set squares(v) {
    this.#squares = v;
    this.update();
  }

  set onclick(f) {
    this.#squareNodes.forEach((n, i) => {
      n.onclick = () => f(i);
    });
  }

  update() {
    this.#squareNodes.forEach((n, i) => {
      n.value = this.#squares[i];
    });
  }
}

customElements.define("app-board", Board);
