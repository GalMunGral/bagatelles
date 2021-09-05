import React from "react";
import { useModel, Checkbox } from "../lib";

function CheckboxTest() {
  const checked = useModel(false);
  const toggle1 = useModel("yes");
  const toggle2 = useModel(null);
  const checkedNames1 = useModel([]);
  const checkedNames2 = useModel([]);
  return (
    <>
      <Checkbox id="checkbox" model={checked} />
      <label htmlFor="checkbox">{String(checked)}</label>
      <hr />
      <Checkbox id="toggle" model={toggle1} trueValue="yes" falseValue="no" />
      <label htmlFor="toggle">{String(toggle1)}</label>
      <hr />
      <Checkbox
        id="toggle"
        model={toggle2}
        trueValue={{ val: "yes" }}
        falseValue={{ val: "no" }}
      />
      <label htmlFor="toggle">{JSON.stringify(toggle2.value)}</label>
      <hr />
      <Checkbox id="jack" value="Jack" model={checkedNames1} />
      <label htmlFor="jack">Jack</label>
      <Checkbox id="john" value="John" model={checkedNames1} />
      <label htmlFor="john">John</label>
      <Checkbox id="mike" value="Mike" model={checkedNames1} />
      <label htmlFor="mike">Mike</label>
      <br />
      <span>Checked names: {String(checkedNames1)}</span>
      <hr />
      <Checkbox id="jack" value={{ name: "Jack" }} model={checkedNames2} />
      <label htmlFor="jack">Jack</label>
      <Checkbox id="john" value={{ name: "John" }} model={checkedNames2} />
      <label htmlFor="john">John</label>
      <Checkbox id="mike" value={{ name: "Mike" }} model={checkedNames2} />
      <label htmlFor="mike">Mike</label>
      <br />
      <span>Checked names: {JSON.stringify(checkedNames2.value)}</span>
    </>
  );
}

export default CheckboxTest;
