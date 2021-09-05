import React from "react";

function Radio({ model, value, ...props }) {
  const [selected, setSelected] = model;

  const checked = JSON.stringify(value) === JSON.stringify(selected);
  const handleChange = () => {
    setSelected(value);
  };

  return (
    <input
      type="radio"
      {...props}
      value={JSON.stringify(value)}
      checked={checked}
      onChange={handleChange}
    />
  );
}

export default Radio;
