import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import RentalCreateForm from "./RentalCreateForm";
import * as actions from "actions";

class RentalCreate extends Component {
  constructor() {
    super();
    this.state = {
      errors: "",
      redirect: false
    };
    this.rentalCategories = ["Apartments", "House", "Condo"];
  }

  createRental = rentalData => {
    // console.log(rentalData);
    actions
      .createRental(rentalData)
      .then(rental => {
        this.setState({ redirect: true });
      })
      .catch(errors => {
        this.setState({ errors });
      });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={{ pathname: "/rentals" }} />;
    }
    return (
      <section id="newRental">
        <div className="bwm-form">
          <div className="row">
            <div className="col-md-5">
              <h1 className="page-title">Create Rental</h1>
              <RentalCreateForm
                submitForm={this.createRental}
                options={this.rentalCategories}
                errors={this.state.errors}
              />
            </div>
            <div className="col-md-6 ml-auto">
              <div className="image-container">
                <h2 className="catchphrase">
                  Hundreds of awesome places in reach of few clicks.
                </h2>
                <img
                  src={process.env.PUBLIC_URL + "/img/create-rental.jpg"}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default RentalCreate;
