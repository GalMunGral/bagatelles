import { Component, createNode } from "../runtime";
import { Field } from "./field";

type Config = {
  title: string;
};

export const SignUpForm = Component<void, never, Config>({
  init() {},
  update: {},
  view(_, { config }) {
    return (
      <div>
        {config.title}
        <Email />
        <Age />
        <Married />
      </div>
    );
  },
});

const Age = Component({
  init() {},
  update: {},
  view() {
    return (
      <div>
        <label>age</label>
        <Field
          transform={(e: any) => Number(e.target.value)}
          validate={(v: number) => {
            return v > 100 ? "You are too old" : undefined;
          }}
        >
          {(value: any, update: any) => (
            <input
              type="number"
              // value={value}
              oninput={[update.INPUT, update.VALIDATE]}
            />
          )}
        </Field>
      </div>
    );
  },
});

export const Email = Component({
  init() {},
  update: {},
  view() {
    return (
      <div>
        <label>email</label>
        <Field
          transform={(e: any) => e.target.value}
          validate={(v: string) => {
            return /^\w+@\w+\.\w+$/.test(v) ? undefined : "Wrong email format";
          }}
        >
          {(value: any, update: any) => (
            <input
              type="email"
              // value={value}
              oninput={[update.INPUT]}
              onblur={[update.VALIDATE]}
            />
          )}
        </Field>
      </div>
    );
  },
});

const Married = Component({
  init() {},
  update: {},
  view() {
    return (
      <div>
        <label>married</label>
        <Field transform={(e: any) => e.target.checked}>
          {(value: boolean, update: any) => (
            <input
              type="checkbox"
              // checked={Boolean(value)}
              oninput={[update.INPUT]}
            />
          )}
        </Field>
      </div>
    );
  },
});
