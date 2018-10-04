import React from "react";
import { Field, reduxForm } from "redux-form";

import BwmInput from "../../shared/form/BwmInput";
import BwmTextArea from "../../shared/form/BwmTextArea";
import BwmSelect from "../../shared/form/BwmSelect";
// import BwmSelect from "../../shared/form/BwmSelect";
import BwmFileUpload from "../../shared/form/BwmFileUpload";
import BwmError from "../../shared/form/BwmError";
// import { required, minLength4 } from "../shared/form/Validators";

const RentalCreateForm = props => {
  const {
    handleSubmit,
    pristine,
    submitting,
    submitForm,
    valid,
    options,
    errors
  } = props;
  // console.log("errors:", errors);
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Field
        name="title"
        type="text"
        className="form-control"
        label="Title"
        component={BwmInput}
      />
      <Field
        name="description"
        type="text"
        className="form-control"
        label="Description"
        rows="6"
        component={BwmTextArea}
      />

      <Field
        name="city"
        type="text"
        className="form-control"
        label="City"
        component={BwmInput}
      />
      <Field
        name="street"
        type="text"
        className="form-control"
        label="Street"
        component={BwmInput}
      />

      <Field
        name="category"
        className="form-control"
        label="Category"
        options={options}
        component={BwmSelect}
      />

      <Field
        name="image"
        label="Image"
        component={BwmFileUpload}
        // validate={[required, minLength4]}
      />
      <Field
        name="bedrooms"
        className="form-control"
        label="Bedrooms"
        type="number"
        component={BwmInput}
      />
      <Field
        name="dailyRate"
        type="text"
        className="form-control"
        label="Daily Rate"
        component={BwmInput}
        symbol="$"
        // validate={[required, minLength4]}
      />

      <Field
        name="shared"
        type="checkbox"
        className="form-control"
        label="Shared"
        component={BwmInput}
        // validate={[required, minLength4]}
      />

      <button
        className="btn btn-bwm btn-form"
        type="submit"
        disabled={!valid || pristine || submitting}
      >
        Create Rental
      </button>
      <BwmError errors={errors} />
    </form>
  );
};

export default reduxForm({
  form: "rentalCreateForm", // a unique identifier for this form
  initialValues: {
    shared: false,
    category: "apartments"
  }
})(RentalCreateForm);
