import React from "react";
import InputTest from "./InputTest";
import InvertedInputTest from "./InvertedInputTest";
import TextAreaTest from "./TextAreaTest";
import CheckboxTest from "./CheckboxTest";
import RadioTest from "./RadioTest";
import SelectTest from "./SelectTest";

function Test() {
  return (
    <>
      <InputTest />
      <hr />
      <TextAreaTest />
      <hr />
      <CheckboxTest />
      <hr />
      <RadioTest />
      <hr />
      <SelectTest />
      <hr />
      <InvertedInputTest />
    </>
  );
}

export default Test;
