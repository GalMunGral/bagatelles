import React from "react";
import { InputGroup, FormControl } from "react-bootstrap";

const Currency = ({ label, placeholder, value, onChange, validity }) => {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Prepend>
        <InputGroup.Text>{label}</InputGroup.Text>
        <InputGroup.Text>{String(validity.valid)}</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        aria-label="Amount (to the nearest dollar)"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <InputGroup.Append>
        <InputGroup.Text>.00</InputGroup.Text>
      </InputGroup.Append>
    </InputGroup>
  );
};

export default Currency;
