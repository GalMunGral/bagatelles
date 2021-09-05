import React from "react";

function Checkbox({ model, value, trueValue, falseValue, ...props }) {
  const [selected, setSelected] = model;
  let _value = JSON.stringify(value);
  let checked, handleChange;

  if (Array.isArray(selected)) {
    // multi-select
    const _selected = selected.map(JSON.stringify);
    checked = _selected.includes(_value);
    handleChange = (e) => {
      if (e.target.checked) {
        if (!checked) {
          setSelected([...selected, value]);
        }
      } else {
        if (checked) {
          const _newSelected = _selected.filter((it) => it !== _value);
          setSelected(_newSelected.map(JSON.parse));
        }
      }
    };
  } else {
    // toggle
    trueValue = trueValue ?? true;
    falseValue = falseValue ?? false;
    checked = JSON.stringify(selected) === JSON.stringify(trueValue); // `trueValue` is a distinct object each time render is called
    handleChange = (e) => {
      const newValue = e.target.checked ? trueValue : falseValue;
      setSelected(newValue);
    };
  }

  return (
    <input
      type="checkbox"
      {...props}
      value={value}
      checked={checked}
      onChange={handleChange}
    />
  );
}

export default Checkbox;
