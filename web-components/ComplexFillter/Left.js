export class ComplexFilterLeft extends HTMLElement {
  #root;
  #group;
  #filter;

  parent;

  constructor() {
    super();
    this.render();
  }

  set filter(value) {
    this.#filter = value;
  }

  set group(value) {
    this.#group = value;
    this.update();
  }

  update() {
    const slot = this.#root.querySelector("#slot");
    this.#filter.groups.forEach((g, i) => {
      let item;
      if (i == slot.children.length) {
        item = document.createElement("div");
        item.className = "item";
        slot.append(item);
      } else {
        item = slot.children[i];
      }
      item.id = g.id;
      item.textContent = g.label;
      item.onclick = () => {
        this.parent.group = g;
      };
      if (this.#group)
        item.style.color = this.#group.id == item.id ? "blue" : "black";
    });
  }

  render() {
    this.#root = this.attachShadow({ mode: "closed" });
    this.#root.innerHTML = `
      <style>
        #slot {
          background: #eeeeee;
        }
        .item {
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          cursor: pointer;
          border-bottom: 1px solid #dddddd;
        }
      </style>
      <div id="slot"></div>
    `;
  }
}
customElements.define("complex-filter-left", ComplexFilterLeft);
