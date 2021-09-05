import React from "react";
import { useModel, Select } from "../lib";

const options = [
  { text: "One", value: "A" },
  { text: "Two", value: "B" },
  { text: "Three", value: "C" },
];

function SelectTest() {
  const selected1 = useModel("");
  const selected2 = useModel([]);
  const selected3 = useModel("A");
  const selected4 = useModel(null);
  return (
    <>
      <Select model={selected1}>
        <option disabled value="">
          Please select one
        </option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </Select>
      <span>Selected: {String(selected1)}</span>
      <hr />
      <Select model={selected2} multiple>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </Select>
      <br />
      <span>Selected: {String(selected2)}</span>
      <hr />
      <Select model={selected3}>
        {options.map((option, i) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </Select>
      <span>Selected: {String(selected3)}</span>
      <hr />
      <Select model={selected4}>
        <option disabled value={null}>
          Please select one
        </option>
        <option value={{ number: 123 }}>123</option>
        <option value={{ number: 456 }}>456</option>
      </Select>
      <span>Selected: {JSON.stringify(selected4.value)}</span>
    </>
  );
}

export default SelectTest;
