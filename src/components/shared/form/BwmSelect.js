import React from "react";

const BwmSelect = ({
  input,
  label,
  options,
  className,
  meta: { touched, error, warning }
}) => (
  <div className="form-group">
    <label>{label}</label>
    <div className="input0group">
      <select {...input} className={className}>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {touched && (error && <div className="alert alert-danger">{error}</div>)}
    </div>
  </div>
);

export default BwmSelect;
