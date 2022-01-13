import "./Board.js";
import { Move } from "./Move.js";

export class Game extends HTMLElement {
  #board;
  #status;
  #moves;

  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
    this.setup();
    this.update();
  }

  handleClick(i) {
    const history = this.state.history;
    history.length = this.state.stepNumber + 1;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? "X" : "O";
    history.push({ squares });
    this.state.stepNumber = history.length - 1;
    this.state.xIsNext = !this.state.xIsNext;
    this.update();
  }

  jumpTo(step) {
    this.state.stepNumber = step;
    this.state.xIsNext = step % 2 === 0;
    this.update();
  }

  update() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    this.#board.squares = current.squares;

    const moves = [...this.#moves.childNodes];
    for (let i = history.length; i < moves.length; ++i) {
      moves[i].remove();
    }
    for (let i = 0; i < history.length; ++i) {
      const desc = i ? "Go to i #" + i : "Go to game start";
      let node;
      if (i == this.#moves.childNodes.length) {
        node = new Move();
        node.move = i;
        node.jumpTo = this.jumpTo.bind(this);
        this.#moves.append(node);
      } else {
        node = this.#moves.childNodes[i];
      }
      node.desc = desc;
    }

    if (winner) {
      this.#status.textContent = "Winner: " + winner;
    } else {
      this.#status.textContent =
        "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
  }

  setup() {
    this.innerHTML = `
      <style>
        ol,
        ul {
          padding-left: 30px;
        }
        .board-row:after {
          clear: both;
          content: "";
          display: table;
        }
        .status {
          margin-bottom: 10px;
        }
        .game {
          display: flex;
          flex-direction: row;
        }
        .game-info {
          margin-left: 20px;
        }
      </style>
      <div class="game">
        <div class="game-board">
          <app-board></app-board>
        </div>
        <div class="game-info">
          <div></div>
          <ol></ol>
        </div>
      </div>
    `;
    this.#board = this.querySelector("app-board");
    this.#status = this.querySelector(".game-info > div");
    this.#moves = this.querySelector(".game-info > ol");
    this.#board.onclick = (i) => this.handleClick(i);
  }
}

customElements.define("app-game", Game);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
