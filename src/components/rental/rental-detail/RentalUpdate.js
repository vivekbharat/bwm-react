import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";

import * as actions from "actions";

import RentalAssets from "./RentalAssets";
import { toUppercase } from "../../../helpers/index";

// import RentalDetailInfo from "./RentalDetailInfo";
// import RentalDetailUpdate from "./RentalDetailUpdate";
import RentalMap from "./RentalMap";
import Booking from "../../booking/Booking";
import UserGuard from "../../shared/auth/UserGuard";
import EditableInput from "../../shared/editable/EditableInput";
import EditableText from "../../shared/editable/EditableText";
import EditableSelect from "../../shared/editable/EditableSelect";
import EditableImage from "../../shared/editable/EditableImage";

class RentalUpdate extends Component {
  constructor() {
    super();

    this.state = {
      isAllowed: false,
      isFetching: true
    };
  }

  componentWillMount() {
    //DISPATCH ACTION
    const rentalId = this.props.match.params.id;
    this.props.dispatch(actions.fetchRental(rentalId));
  }

  componentDidMount() {
    // const { isUpdate } = this.props.location.state || false;

    this.verifyRentalOwner();
  }
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

  verifyRentalOwner = () => {
    const rentalId = this.props.match.params.id;

    this.setState({ isFetching: true });
    return actions.verifyRentalOwner(rentalId).then(
      () => {
        this.setState({ isAllowed: true, isFetching: false });
      },
      () => {
        this.setState({ isAllowed: false, isFetching: false });
      }
    );
  };

  // renderRentalDetail = (rental, errors) => {
  //   const { isUpdate } = this.props.location.state || false;
  //   const { isAllowed, isFetching } = this.state;
  //   // console.log(
  //   //   "Rental Detail",
  //   //   errors.data ? errors.data.errors[0].detail : errors
  //   // );
  //   return isUpdate ? (
  //     <UserGuard isAllowed={isAllowed} isFetching={isFetching}>
  //       <RentalDetailUpdate
  //         dispatch={this.props.dispatch}
  //         rental={rental}
  //         errors={errors}
  //         verifyUser={this.verifyRentalOwner}
  //       />
  //     </UserGuard>
  //   ) : (
  //     <RentalDetailInfo rental={rental} />
  //   );
  // };

  render() {
    // console.log(this.props.rental.id);
    // const rental = this.props.rental;
    const { isAllowed, isFetching } = this.state;

    const { rental, errors } = this.props;

    if (rental._id) {
      return (
        <UserGuard isAllowed={isAllowed} isFetching={isFetching}>
          <section id="RentalUpdate">
            <div className="upper-section">
              <div className="row">
                <div className="col-md-6">
                  {/* <img src={rental.image} alt="" /> */}
                  <EditableImage
                    entity={rental}
                    entityField={"image"}
                    errors={errors}
                    updateEntity={this.updateRental}
                  />
                </div>
                <div className="col-md-6">
                  <RentalMap location={`${rental.city}, ${rental.street}`} />
                </div>
              </div>
            </div>

            <div className="details-section">
              <div className="row">
                <div className="col-md-8">
                  <div className="rental">
                    <h1>Update Rental</h1>
                    <ToastContainer />

                    <label
                      className={`rental-label rental-type ${rental.category}`}
                    >
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
                        <i className="fa fa-user" /> {rental.bedrooms + 4}{" "}
                        guests
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
                </div>
                <div className="col-md-4">
                  <Booking rental={rental} />
                </div>
              </div>
            </div>
          </section>
        </UserGuard>
      );
    } else {
      return <h1>Loading...</h1>;
    }
  }
}

const mapStateToProps = state => {
  return {
    rental: state.rental.data,
    errors: state.rental.errors
  };
};

export default connect(mapStateToProps)(RentalUpdate);
