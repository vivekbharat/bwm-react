import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "actions";

import RentalDetailInfo from "./RentalDetailInfo";
import RentalDetailUpdate from "./RentalDetailUpdate";
import RentalMap from "./RentalMap";
import Booking from "../../booking/Booking";
import UserGuard from "../../shared/auth/UserGuard";

class RentalDetails extends Component {
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
    const { isUpdate } = this.props.location.state || false;

    if (isUpdate) this.verifyRentalOwner();
  }

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

  renderRentalDetail = (rental, errors) => {
    const { isUpdate } = this.props.location.state || false;
    const { isAllowed, isFetching } = this.state;
    // console.log(
    //   "Rental Detail",
    //   errors.data ? errors.data.errors[0].detail : errors
    // );
    return isUpdate ? (
      <UserGuard isAllowed={isAllowed} isFetching={isFetching}>
        <RentalDetailUpdate
          dispatch={this.props.dispatch}
          rental={rental}
          errors={errors}
          verifyUser={this.verifyRentalOwner}
        />
      </UserGuard>
    ) : (
      <RentalDetailInfo rental={rental} />
    );
  };

  render() {
    // console.log(this.props.rental.id);
    // const rental = this.props.rental;

    const { rental, errors } = this.props;

    if (rental._id) {
      return (
        <section id="rentalDetails">
          <div className="upper-section">
            <div className="row">
              <div className="col-md-6">
                <img src={rental.image} alt="" />
              </div>
              <div className="col-md-6">
                <RentalMap location={`${rental.city}, ${rental.street}`} />
              </div>
            </div>
          </div>

          <div className="details-section">
            <div className="row">
              <div className="col-md-8">
                {this.renderRentalDetail(rental, errors)}
              </div>
              <div className="col-md-4">
                <Booking rental={rental} />
              </div>
            </div>
          </div>
        </section>
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

export default connect(mapStateToProps)(RentalDetails);
