import React from "react";

export default ({ label, value, validity, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <pre>{JSON.stringify(validity, null, 2)}</pre>
      <input type="text" value={value} onChange={onChange} />
    </div>
  );
};
