import React, { Component } from "react";
import { connect } from "react-redux";

import RentalList from "./RentalList";

import * as actions from "actions";

class RentalListing extends Component {
  componentWillMount() {
    this.props.dispatch(actions.fetchRentals());
  }

  render() {
    // console.log(this.props.rentals.data, "Rental Listing");
    return (
      <section id="rentalListing">
        <h1 className="page-title">Your Home All Around the World</h1>
        <RentalList rentals={this.props.rentals.data} />
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    rentals: state.rentals
  };
};

export default connect(mapStateToProps)(RentalListing);
