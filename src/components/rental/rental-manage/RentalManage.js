import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router-dom";

import * as actions from "../../../actions";
import RentalManageCard from "./RentalManageCard";

class RentalManage extends Component {
  constructor() {
    super();

    this.state = {
      userRental: [],
      errors: [],
      isFetching: false,
      redirect: false
    };
  }

  deleteRental = (rentalId, rentalIndex) => {
    actions
      .deleteRental(rentalId)
      .then(() => {
        this.deleteRentalFromList(rentalIndex);
        // this.props.history.push("/rentals");
      })
      .catch(errors => toast.error(errors[0].detail));
  };

  deleteRentalFromList = rentalIndex => {
    const userRentals = this.state.userRental.slice();

    userRentals.splice(rentalIndex, 1);
    this.setState({ userRental: userRentals });
  };

  componentWillMount() {
    this.setState({ isFetching: true });
    actions
      .getUserRental()
      .then(userRental => {
        this.setState({ userRental, isFetching: false });
      })
      .catch(errors => {
        this.setState({ errors, isFetching: false });
      });
  }

  render() {
    const { userRental, isFetching } = this.state;
    // if (redirect) {
    //   return <Redirect to="/rentals" />;
    // }
    return (
      <div>
        <section id="userRentals">
          <ToastContainer />
          <h1 className="page-title">My Rentals</h1>
          <div className="row">
            {userRental.map((rental, index) => (
              <RentalManageCard
                rental={rental}
                key={index}
                rentalIndex={index}
                deleteRental={this.deleteRental}
              />
            ))}
          </div>
          {!isFetching &&
            userRental.length === 0 && (
              <div className="alert alert-warning">
                You dont have any rentals currenty created. If you want
                advertised your property please follow this link.
                <Link
                  style={{ marginLeft: "10px" }}
                  className="btn btn-bwm"
                  to="/rentals/new"
                >
                  Register Rental
                </Link>
              </div>
            )}
        </section>
      </div>
    );
  }
}

export default RentalManage;
