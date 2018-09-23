import React from "react";
import { Field, reduxForm } from "redux-form";

import BwmInput from "../shared/form/BwmInput";
import BwmError from "../shared/form/BwmError";
import { required, minLength4 } from "../shared/form/Validators";

const LoginForm = props => {
  const {
    handleSubmit,
    pristine,
    submitting,
    submitForm,
    valid,
    errors
  } = props;
  // console.log("errors:", errors);
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Field
        name="email"
        type="email"
        className="form-control"
        label="Email"
        component={BwmInput}
        validate={[required, minLength4]}
      />

      <Field
        name="password"
        type="password"
        className="form-control"
        label="Password"
        component={BwmInput}
        validate={[required]}
      />

      <button
        className="btn btn-bwm btn-form"
        type="submit"
        disabled={!valid || pristine || submitting}
      >
        Login
      </button>
      <BwmError errors={errors} />
    </form>
  );
};

export default reduxForm({
  form: "loginForm" // a unique identifier for this form
})(LoginForm);
