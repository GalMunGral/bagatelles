import { ComplexFilter } from "./ComplexFillter/index.js";
import { BasicFilter } from "./BasicFilter.js";

export class Dropdown extends HTMLElement {
  #filter;
  #cache = new Map();

  constructor() {
    super();
  }

  set filter(value) {
    this.#filter = value;
    this.updateContent();
  }

  updateContent() {
    const Class = this.#filter.type == "complex" ? ComplexFilter : BasicFilter;
    if (!this.#cache.has(this.#filter)) {
      this.#cache.set(this.#filter, new Class());
    }
    const node = this.#cache.get(this.#filter);
    node.filter = this.#filter;

    if (!this.lastChild) this.append(node);
    if (this.lastChild !== node) {
      this.lastChild.remove();
      this.append(node);
    }
  }
}

customElements.define("filter-dropdown", Dropdown);
