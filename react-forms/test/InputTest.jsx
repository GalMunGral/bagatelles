import React from "react";
import { useModel, Input } from "../lib";

function InputeTest() {
  const message1 = useModel("");
  const message2 = useModel("");
  const number = useModel(0);
  return (
    <>
      <Input model={message1} placeholder="edit me" />
      <p>Message is: {String(message1)}</p>
      <hr />
      <Input model={message2} lazy placeholder="edit me" />
      <p>Message is: {String(message2)}</p>
      <hr />
      <Input model={number} number placeholder="edit me" />
      <p>
        Message is: {String(number)}, Type: {typeof number.value}
      </p>
      <hr />
      <Input model={message1} lazy trim placeholder="edit me" />
      <p>Message is: {String(message1)}</p>
    </>
  );
}

export default InputeTest;
