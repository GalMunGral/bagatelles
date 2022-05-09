export class Square extends HTMLElement {
  #button;

  set value(v) {
    this.#button.textContent = v;
  }

  set onclick(f) {
    this.#button.onclick = f;
  }

  constructor() {
    super();
    const root = this.attachShadow({ mode: "closed" });
    root.innerHTML = `
      <style>
        .square {
          background: #fff;
          border: 1px solid #999;
          float: left;
          font-size: 24px;
          font-weight: bold;
          line-height: 34px;
          height: 34px;
          margin-right: -1px;
          margin-top: -1px;
          padding: 0;
          text-align: center;
          width: 34px;
        }

        .square:focus {
          outline: none;
        }
      </style>
      <button class="square"></button>`;
    this.#button = root.querySelector("button");
  }
}

customElements.define("app-square", Square);
