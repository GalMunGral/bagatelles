import { Component, createNode, HTTP } from "../runtime";
import { SignUpForm } from "./form";
import { Modal } from "./modal";
import { Counter } from "./counter";
import "../index.css";

type State = {
  count: number;
  input: string;
  loading: boolean;
  error: any;
  answer: string;
  imgUrl: string;
  pending: string;
};

type Update = "LOAD" | "INPUT" | "HTTP_ERROR" | "HTTP_RESULT" | "AUTOFILL";

export const App = Component<State, Update>({
  init() {
    return {
      count: 0,
      input: "",
      error: null,
      loading: false,
      answer: "",
      imgUrl: "",
      pending: "https://yesno.wtf/api",
    };
  },
  update: {
    LOAD(s, { dispatch }) {
      return [
        {
          ...s,
          answer: "",
          imgUrl: "",
          pending: s.input,
          loading: true,
          count: s.count + 1,
        },
        [
          new HTTP(
            { url: s.input },
            (v) => dispatch("HTTP_RESULT", v),
            (e) => dispatch("HTTP_ERROR", e)
          ),
        ],
      ];
    },
    INPUT(s, { value: e }) {
      return {
        ...s,
        input: e.target.value,
      };
    },
    HTTP_ERROR(s, { value: error }) {
      return {
        ...s,
        loading: false,
        error,
      };
    },
    HTTP_RESULT(s, { value }) {
      return {
        ...s,
        loading: false,
        answer: value.answer,
        imgUrl: value.image,
        error: null,
      };
    },
    AUTOFILL(s) {
      return {
        ...s,
        input: "https://yesno.wtf/api?force=yes",
      };
    },
  },
  view(s, { update }) {
    return (
      <div class="w-[50vw] mx-auto p-10 bg-gray-400 flex flex-col items-center">
        <Counter />
        <h1 class="my-5 text-6xl">
          {s.answer ? s.answer.toUpperCase() : "YES? NO?"}
        </h1>
        <div class="text-gray-50">https://yesno.wtf/api</div>
        <div class="flex flex-row items-center">
          <input value={s.input} oninput={[update.INPUT]} />
          <div class="m-10">{s.count}</div>
          <button class="bg-red-400" onclick={[update.LOAD]}>
            GO
          </button>
        </div>
        {s.loading ? (
          "LOADING"
        ) : s.imgUrl ? (
          <img src={s.imgUrl} />
        ) : (
          s.error && <pre class="w-full p-10 break-all">{s.error.message}</pre>
        )}
        <SignUpForm key="1" title="Sign Up 1" />
        <SignUpForm key="2" title="Sign Up 2" />
        <Modal
          key="1"
          title="Test"
          content="This is a test"
          CONFIRM={update.AUTOFILL}
        />
        <Modal
          key="2"
          title="Test"
          content="This is a test"
          CANCEL={update.AUTOFILL}
        />
      </div>
    );
  },
});
