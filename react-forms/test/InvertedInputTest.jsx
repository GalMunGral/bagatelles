import React from "react";
import { withModel, useModel } from "../lib";

function reverse(str) {
  return str.split("").reverse().join("");
}
const InvertedInput = withModel(({ value, setValue }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    setValue(reverse(value));
  };
  return <input value={reverse(value)} onChange={handleChange} />;
});

function InputeTest() {
  const message1 = useModel("");
  return (
    <>
      <InvertedInput model={message1} placeholder="edit me" />
      <p>Message is: {String(message1)}</p>
    </>
  );
}

export default InputeTest;
