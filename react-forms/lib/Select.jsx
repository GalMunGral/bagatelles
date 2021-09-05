import React from "react";

function Select({ model, ...props }) {
  const [selected, setSelected] = model;
  let value;
  let handleChange;

  if (Array.isArray(selected)) {
    value = selected.map(JSON.stringify);
    // `HTMLSelectElement.value` only contains the first selected value for multiple selected
    handleChange = (e) => {
      const newSelected = [...e.target.options]
        .filter((option) => option.selected)
        .map((option) => JSON.parse(option.value));
      setSelected(newSelected);
    };
  } else {
    value = JSON.stringify(selected);
    handleChange = (e) => {
      const newSelected = JSON.parse(e.target.value);
      setSelected(newSelected);
    };
  }

  return (
    <select {...props} value={value} onChange={handleChange}>
      {React.Children.map(props.children, (option) => {
        return React.cloneElement(option, {
          value: JSON.stringify(
            option.props.value === undefined
              ? option.props.children
              : option.props.value
          ),
        });
      })}
    </select>
  );
}

export default Select;
