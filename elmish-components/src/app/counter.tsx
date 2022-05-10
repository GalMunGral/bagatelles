import { Timeout, Component, createNode } from "../runtime";

type State = {
  count: number;
  running: boolean;
};

type Update = "INCREMENT" | "TOGGLE";

export const Counter = Component<State, Update>({
  init() {
    return {
      count: 0,
      running: false,
    };
  },
  update: {
    INCREMENT(s, { dispatch }) {
      if (!s.running) return s;
      return [
        {
          ...s,
          count: s.count + 1,
        },
        [
          new Timeout(() => {
            dispatch("INCREMENT");
          }),
        ],
      ];
    },
    TOGGLE(s, { dispatch }) {
      return [
        {
          ...s,
          running: !s.running,
        },
        [
          !s.running
            ? () => {
                dispatch("INCREMENT");
              }
            : null,
        ],
      ];
    },
  },
  view(state, { update }) {
    return (
      <h1
        onclick={[update.TOGGLE]}
        style={{
          userSelect: "none",
          color: state.running ? "white" : "black",
          background: state.running ? "black" : "white",
        }}
      >
        count: {state.count}
      </h1>
    );
  },
});
