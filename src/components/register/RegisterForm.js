import React from "react";
import { Field, reduxForm } from "redux-form";

import BwmInput from "../shared/form/BwmInput";
import BwmError from "../shared/form/BwmError";
const RegisterForm = props => {
  const {
    handleSubmit,
    pristine,
    submitting,
    submitForm,
    valid,
    errors
  } = props;
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Field
        name="firstName"
        type="text"
        label="Username"
        className="form-control"
        component={BwmInput}
      />

      <Field
        name="email"
        type="email"
        className="form-control"
        label="Email"
        component={BwmInput}
      />

      <Field
        name="password"
        type="password"
        className="form-control"
        label="Password"
        component={BwmInput}
      />

      <Field
        name="confirmPassword"
        type="password"
        className="form-control"
        label="Confirm Password"
        component={BwmInput}
      />

      <button
        className="btn btn-bwm btn-form"
        type="submit"
        disabled={!valid || pristine || submitting}
      >
        Submit
      </button>
      <BwmError errors={errors} />
    </form>
  );
};

const validate = values => {
  const errors = {};

  if (values.username && values.username.length < 4) {
    errors.username = "Username min length is 4 characters";
  }

  if (!values.email) {
    errors.email = "Please enter Email";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please Enter Password Confirmation";
  }

  if (values.password !== values.confirmPassword) {
    errors.password = "Password and Confirm Password do not match";
  }

  // if (!values.username) {
  //   errors.username = 'Required'
  // } else if (values.username.length > 15) {
  //   errors.username = 'Must be 15 characters or less'
  // }
  // if (!values.email) {
  //   errors.email = 'Required'
  // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   errors.email = 'Invalid email address'
  // }
  // if (!values.age) {
  //   errors.age = 'Required'
  // } else if (isNaN(Number(values.age))) {
  //   errors.age = 'Must be a number'
  // } else if (Number(values.age) < 18) {
  //   errors.age = 'Sorry, you must be at least 18 years old'
  // }
  return errors;
};

export default reduxForm({
  form: "registerForm", // a unique identifier for this form
  validate
})(RegisterForm);
