import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";

import RentalAssets from "./RentalAssets";
import { toUppercase, rentalType } from "../../../helpers/index";
import EditableInput from "../../shared/editable/EditableInput";
import EditableText from "../../shared/editable/EditableText";
import EditableSelect from "../../shared/editable/EditableSelect";
import * as actions from "../../../actions";

class RentalDetailUpdate extends Component {
  updateRental = rentalData => {
    // console.log(rentalData);
    const {
      rental: { _id },
      dispatch
    } = this.props;
    dispatch(actions.updateRental(_id, rentalData));
  };

  resetRentalErrors = () => {
    this.props.dispatch(actions.resetRental());
  };

  render() {
    const { rental, errors } = this.props;
    // console.log(errors);
    if (errors && errors.length > 0) {
      toast.error(errors.data ? errors.data.errors[0].detail : errors);
    }

    return (
      <div className="rental">
        <h1>Update Rental</h1>
        <ToastContainer />

        <label className={`rental-label rental-type ${rental.category}`}>
          {" "}
          Shared
        </label>
        <EditableSelect
          entity={rental}
          entityField={"shared"}
          className={`rental-type ${rental.category}`}
          updateRental={this.updateRental}
          containerStyle={{ display: "inline-block" }}
          options={[true, false]}
          errors={errors}
          resetRentalErrors={this.resetRentalErrors}
        />

        <EditableSelect
          entity={rental}
          entityField={"category"}
          className={`rental-type ${rental.category}`}
          updateRental={this.updateRental}
          options={["apartment", "house", "condo"]}
          errors={errors}
          resetRentalErrors={this.resetRentalErrors}
        />

        <div className="rental-owner">
          <img
            src="https://api.adorable.io/avatars/285/abott@adorable.png"
            alt="owner"
          />
          <span>{rental.user && rental.user.username}</span>
        </div>

        {/* <h1 className="rental-title">{rental.title}</h1> */}
        <EditableInput
          entity={rental}
          entityField={"title"}
          className={"rental-title"}
          updateRental={this.updateRental}
          errors={errors}
          resetRentalErrors={this.resetRentalErrors}
        />
        <EditableInput
          entity={rental}
          entityField={"city"}
          className={"rental-city"}
          updateRental={this.updateRental}
          errors={errors}
          resetRentalErrors={this.resetRentalErrors}
          formatPipe={[toUppercase]}
        />
        <EditableInput
          entity={rental}
          entityField={"street"}
          className={"rental-street"}
          updateRental={this.updateRental}
          errors={errors}
          resetRentalErrors={this.resetRentalErrors}
        />
        <div className="rental-room-info">
          <span>
            <i className="fa fa-building" />
            <EditableInput
              entity={rental}
              entityField={"bedrooms"}
              className={"rental-bedrooms"}
              containerStyle={{ display: "inline-block" }}
              updateRental={this.updateRental}
              errors={errors}
              resetRentalErrors={this.resetRentalErrors}
            />{" "}
            bedrooms
          </span>
          <span>
            <i className="fa fa-user" /> {rental.bedrooms + 4} guests
          </span>
          <span>
            <i className="fa fa-bed" /> {rental.bedrooms + 2} beds
          </span>
        </div>
        <EditableText
          entity={rental}
          entityField={"description"}
          className={"rental-description"}
          updateRental={this.updateRental}
          rows={6}
          cols={50}
          errors={errors}
          resetRentalErrors={this.resetRentalErrors}
        />
        <hr />
        <RentalAssets />
      </div>
    );
  }
}

export default RentalDetailUpdate;
