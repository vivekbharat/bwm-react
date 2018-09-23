import React from "react";

const BwmInput = ({
  input,
  label,
  type,
  className,
  meta: { touched, error, warning }
}) => (
  <div className="form-group">
    <label>{label}</label>
    <div className="input0group">
      <input {...input} type={type} className={className} />
      {touched && (error && <div className="alert alert-danger">{error}</div>)}
    </div>
  </div>
);

export default BwmInput;
