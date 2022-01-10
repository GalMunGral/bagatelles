import "./Left.js";
import "./Right.js";

export class ComplexFilter extends HTMLElement {
  #root;
  #left;
  #right;
  #filter;
  #group;

  set filter(value) {
    this.#filter = value;
    this.updateContent();
  }

  set group(value) {
    this.#group = value;
    this.updateContent();
  }

  constructor() {
    super();
    this.render();
  }

  updateContent() {
    const left = this.#root.querySelector("complex-filter-left");
    left.filter = this.#filter;
    left.group = this.#group;
    this.#root.querySelector("complex-filter-right").group = this.#group;
  }

  render() {
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.innerHTML = `
      <style>
        #container {
          display: flex;
          height: 400px;
        }
        complex-filter-left {
          width: 200px;
        }
        complex-filter-right {
          flex: 1;
        }
      </style>
      <div id="container">
        <complex-filter-left></complex-filter-left>
        <complex-filter-right></complex-filter-right>
      </div>
    `;
    this.#left = this.#root.querySelector("complex-filter-left");
    this.#right = this.#root.querySelector("complex-filter-right");
    this.#left.parent = this;
    this.#right.parent = this;
  }
}

customElements.define("complex-filter", ComplexFilter);
