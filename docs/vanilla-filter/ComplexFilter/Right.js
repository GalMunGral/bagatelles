import { liveConfig } from "../config.js";
export class ComplexFilterRight extends HTMLElement {
  #root;
  #group;

  constructor() {
    super();
    this.render();
    liveConfig.subscribe(() => {
      this.update();
    });
  }

  set group(value) {
    this.#group = value;
    this.update();
  }

  update() {
    const slot = this.#root.querySelector("#slot");
    if (this.#group)
      this.#group.values.forEach((v, i) => {
        let item;
        if (i == slot.children.length) {
          item = document.createElement("div");
          item.className = "item";
          slot.append(item);
          item.onclick = () => {
            if (liveConfig.activeFilters.has(item.id)) {
              liveConfig.remove(item.id);
            } else {
              liveConfig.add(item.id);
            }
          };
        } else {
          item = slot.children[i];
        }
        item.id = v.id;
        item.textContent = v.label;
        item.style.color = liveConfig.activeFilters.has(item.id)
          ? "blue"
          : "black";
      });
  }

  render() {
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.innerHTML = `
      <style>
        .item {
          height: 40px;
          line-height: 40px;
          padding: 0 20px;
          cursor: pointer;
          border-bottom: 1px solid #eeeeee;
        }
      </style>
      <div id="slot"></div>
    `;
  }
}

customElements.define("complex-filter-right", ComplexFilterRight);
