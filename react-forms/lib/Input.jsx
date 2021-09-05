import React from "react";

function Input({ model, lazy, number, trim, ...props }) {
  const [value, setValue] = model;
  const modelProps = {
    [lazy ? "defaultValue" : "value"]: String(value),
    // `onChange` listens for `input` in React.
    // `onBlur` is used in place of "actual" `onChange`
    // See: https://github.com/facebook/react/issues/9567#issuecomment-298326902
    [lazy ? "onBlur" : "onChange"]: (e) => {
      let newValue = e.target.value;
      if (trim) newValue = newValue.trim();
      if (number) newValue = Number(newValue) || 0; // Set it to 0 if it's 0/-0/NaN
      setValue(newValue);
    },
  };

  return <input {...props} {...modelProps} />;
}

export default Input;
