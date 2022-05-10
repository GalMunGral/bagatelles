import { Component, createNode } from "../runtime/view";

type State = {
  show: boolean;
};

type Update = "CLOSE" | "OPEN";

type Config = {
  title: string;
  content: string;
  CONFIRM: string;
  CANCEL: string;
};

export const Modal = Component<State, Update, Config>({
  init() {
    return {
      show: false,
    };
  },
  update: {
    CLOSE(state, { value: e }) {
      e.stopPropagation();
      return { ...state, show: false };
    },
    OPEN(state, { value: e }) {
      e.stopPropagation();
      return { ...state, show: true };
    },
  },
  view(state, { config, update }) {
    console.log(state);
    return (
      <div>
        {state.show ? (
          <div
            class="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-[rgba(0,0,0,0.2)]"
            onclick="CLOSE"
          >
            <div class="bg-white bg-[rgba(255,255,255,0.5)] p-10">
              <div>{config.title}</div>
              <div>{config.content}</div>
              <button
                class="bg-blue-500 mx-5"
                onclick={[config.CONFIRM, update.CLOSE]}
              >
                confirm
              </button>
              <button
                class="bg-blue-500 mx-5"
                onclick={[config.CANCEL, update.CLOSE]}
              >
                cancel
              </button>
            </div>
          </div>
        ) : null}
        <button onclick={[update.OPEN]}>open</button>
      </div>
    );
  },
});
