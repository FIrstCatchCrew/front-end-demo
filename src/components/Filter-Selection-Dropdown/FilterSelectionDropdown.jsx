import React from 'react';
import './FilterSelectionDropdown.css';

function FilterSelectionDropdown({
  name,
  value,
  onChange,
  options,
  defaultOptionLabel,
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="filter-dropdown"
    >
      <option value="">{defaultOptionLabel}</option>
      {/* This maps over the provided 'options' array.
        It assumes each option is an object with 'id' and 'name' properties.
      */}
      {options.map((option) => (
        <option key={option.id} value={option.name}>
          {option.name}
        </option>
      ))}
    </select>
  );
}

export default FilterSelectionDropdown;