import React from "react";

function TextArea({ model, lazy, trim, ...props }) {
  const [value, setValue] = model;
  const modelProps = {
    [lazy ? "defaultValue" : "value"]: value,
    // `onChange` listens for `input` in React.
    // `onBlur` is used in place of "actual" `onChange`
    // See: https://github.com/facebook/react/issues/9567#issuecomment-298326902
    [lazy ? "onBlur" : "onChange"]: (e) => {
      let newValue = e.target.value;
      if (trim) newValue = newValue.trim();
      setValue(newValue);
    },
  };

  return <textarea {...props} {...modelProps} />;
}

export default TextArea;
