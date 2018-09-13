import React, { Component } from "react";
import RentalCard from "./RentalCard";
import { connect } from "react-redux";
import * as actions from "../../actions";

class RentalList extends Component {
  componentWillMount() {
    this.props.dispatch(actions.fetchRentals());
  }

  renderRentals = () => {
    console.log(this.props);
    return this.props.rentals.map(rental => {
      return <RentalCard key={rental.id} rental={rental} />;
    });
  };

  render() {
    return (
      <section id="rentalListing">
        <h1 className="page-title">Your Home All Around the World</h1>
        <div className="row">{this.renderRentals()}</div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    rentals: state.rentals.data
  };
};

export default connect(mapStateToProps)(RentalList);
