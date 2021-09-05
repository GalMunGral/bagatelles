import { useState } from "react";

function useModel(defaultValue) {
  const model = useState(defaultValue);
  model.value = model[0];
  model.toString = function () {
    return String(model.value);
  };
  return model;
}

export default useModel;
