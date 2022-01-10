import "./Dropdown.js";
import { filters } from "./filters.js";

export class FilterSelector extends HTMLElement {
  #root;
  #selected;

  set selected(value) {
    this.#selected = value;
    this.updateItems();
    this.updateDropdown();
  }

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "closed" });
    this.create();
    this.selected = filters[0].id;
    this.#root.querySelectorAll(".dropdown-btn").forEach((el) => {
      el.onclick = () => {
        this.selected = el.id;
      };
    });
  }

  updateDropdown() {
    this.#root.querySelector("#dropdown").filter = filters.find(
      (f) => f.id === this.#selected
    );
  }

  updateItems() {
    this.#root.querySelectorAll(".dropdown-btn").forEach((el) => {
      el.style.color = el.id === this.#selected ? "blue" : "black";
    });
  }

  create() {
    this.#root.innerHTML = `
      <style>
        #container {
          font-family: sans-serif;
          width: 500px;
          margin: auto;
          height: 500px;
          box-shadow: 0 0 10px 1px lightgray;
        }
        #dropdown-list {
          height: 40px;
          box-shadow: 0 10px 50px 0.5px lightgray;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .dropdown-btn {
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
        }
      </style>
      <div id="container">
        <div id="dropdown-list">
          ${filters
            .map(
              (f) => `<div class="dropdown-btn" id="${f.id}">${f.label}</div>`
            )
            .join("")}
        </div>
        <filter-dropdown id="dropdown"></filter-dropdown>
      </div>
    `;
  }
}

customElements.define("filter-selector", FilterSelector);
