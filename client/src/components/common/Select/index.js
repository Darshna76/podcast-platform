import React from "react";
import "./styles.css";

function SelectComponent({
  state,
  setState,
  options,
  placeholder,
  required,
}) {
  return (
    <select
      value={state}
      onChange={(e) => setState(e.target.value)}
      required={required}
      className="custom-input"
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SelectComponent;