import { Component, createNode, Template } from "../runtime";

export type ValidationError = string | undefined;

type State = {
  value: any | undefined;
  error: ValidationError | undefined;
};

type Update = "INPUT" | "VALIDATE";

type Config = {
  transform: (event: any) => any;
  validate?: (value: any) => ValidationError;
  children: [(value: any, update: any) => Template];
};

export const Field = Component<State, Update, Config>({
  init() {
    return {
      value: "",
      error: undefined,
    };
  },
  update: {
    INPUT(s, { config, value }) {
      return {
        ...s,
        value: config.transform(value),
      };
    },
    VALIDATE(s, { config }) {
      return {
        ...s,
        error: s.value ? config.validate?.(s.value) : undefined,
      };
    },
  },
  view(state, { config, update }) {
    return (
      <div>
        {config.children[0](state.value, update)}
        <div>{state.value}</div>
        {state.error && <div class="text-red-800">{state.error}</div>}
      </div>
    );
  },
});
