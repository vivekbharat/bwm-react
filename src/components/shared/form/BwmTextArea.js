import React from "react";

const BwmTextArea = ({
  input,
  label,
  type,
  className,
  rows,
  meta: { touched, error, warning }
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="input0group">
        <textarea {...input} type={type} rows={rows} className={className} />
        {touched &&
          (error && <div className="alert alert-danger">{error}</div>)}
      </div>
    </div>
  );
};

export default BwmTextArea;
