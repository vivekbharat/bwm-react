import React, { Component } from "react";
import RentalCard from "./RentalCard";

class RentalList extends Component {
  renderRentals = () => {
    // console.log(this.props, "Rental List");
    if (this.props.rentals) {
      return this.props.rentals.map(rental => {
        // console.log(rental);
        return <RentalCard key={rental._id} rental={rental} />;
      });
    } else {
      return <h1>Loading...</h1>;
    }
  };

  render() {
    return <div className="row">{this.renderRentals()}</div>;
  }
}

export default RentalList;
