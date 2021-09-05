import React from "react";
import { useModel, TextArea } from "../lib";

function TextAreaTest() {
  const message1 = useModel("");
  const message2 = useModel("");

  return (
    <>
      <span>Multiline message is:</span>
      <p style={{ whiteSpace: "pre-line" }}>{JSON.stringify(message1.value)}</p>
      <br />
      <TextArea model={message1} placeholder="add multiple lines"></TextArea>
      <hr />
      <span>Multiline message is:</span>
      <p style={{ whiteSpace: "pre-line" }}>{JSON.stringify(message2.value)}</p>
      <br />
      <TextArea
        model={message2}
        lazy
        trim
        placeholder="add multiple lines"
      ></TextArea>
    </>
  );
}

export default TextAreaTest;
