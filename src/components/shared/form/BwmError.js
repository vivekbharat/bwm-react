import React from "react";

const BwmError = props => {
  const { errors } = props;
  // console.log("BWM Errors errors", typeof errors);
  return (
    errors.length > 0 && (
      <div className="alert alert-danger bwm-res-errors">
        {errors.map((err, index) => (
          <p key={index}>{err.detail}</p>
        ))}
      </div>
    )
  );
};

export default BwmError;
