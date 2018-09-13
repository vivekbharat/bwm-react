import React, { Component } from "react";
import { connect } from "react-redux";

import RentalList from "./RentalList";

import * as actions from "actions";

class RentalListing extends Component {
  componentWillMount() {
    this.props.dispatch(actions.fetchRentals());
  }

  render() {
    console.log(this.props.rentals);
    return (
      <section id="rentalListing">
        <h1 className="page-title">Your Home All Around the World</h1>
        <RentalList rentals={this.props.rentals} />
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    rentals: state.rentals.data
  };
};

export default connect(mapStateToProps)(RentalListing);
