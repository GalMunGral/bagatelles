import React from "react";
import { useModel, Radio, Checkbox } from "../lib";

function RadioTest() {
  const picked1 = useModel("");
  const picked2 = useModel(null);
  const toggle = useModel("yes");
  const dynamicPicked = useModel(toggle.value);
  return (
    <>
      <Radio id="one" value="One" model={picked1} />
      <label htmlFor="one">One</label>
      <br />
      <Radio id="two" value="Two" model={picked1} />
      <label htmlFor="two">Two</label>
      <br />
      <span>Picked: {String(picked1)}</span>
      <hr />
      <Radio id="one" value={{ data: { num: 1 } }} model={picked2} />
      <label htmlFor="one">One</label>
      <br />
      <Radio id="two" value={{ data: { num: 2 } }} model={picked2} />
      <label htmlFor="two">Two</label>
      <br />
      <span>Picked: {JSON.stringify(picked2.value)}</span>
      <hr />
      <Checkbox id="toggle" model={toggle} trueValue="yes" falseValue="no" />
      <Radio model={dynamicPicked} value={toggle.value} />
      <Radio model={dynamicPicked} value={"not " + toggle.value} />
      <br />
      <span>Picked: {String(dynamicPicked)}</span>
    </>
  );
}

export default RadioTest;
