export class Move extends HTMLElement {
  #button;
  move;
  jumpTo;

  constructor() {
    super();
    this.setup();
  }

  set desc(v) {
    this.#button.textContent = v;
  }

  setup() {
    this.innerHTML = `
      <li>
        <button></button>
      </li>
    `;
    this.#button = this.querySelector("button");
    this.#button.onclick = () => this.jumpTo(this.move);
  }
}

customElements.define("app-move", Move);
