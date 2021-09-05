import React from "react";

function withModel(Component) {
  return function ({ model, ...props }) {
    const [value, setValue] = model;
    return <Component value={value} setValue={setValue} {...props} />;
  };
}

export default withModel;
