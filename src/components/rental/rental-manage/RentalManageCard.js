import React, { Component } from "react";
import { Link } from "react-router-dom";

import { prettifyDate, toUppercase } from "../../../helpers";
import RentalManageModal from "./RentalManageModal";

class RentalManageCard extends Component {
  constructor() {
    super();
    this.state = {
      wantDelete: false
    };
  }

  showDeleteMenu = () => {
    this.setState({ wantDelete: true });
  };

  closeDeleteMenu = () => {
    this.setState({ wantDelete: false });
  };

  deleteRental = (rentalId, rentalIndex) => {
    this.setState({ wantDelete: false });

    this.props.deleteRental(rentalId, rentalIndex);
  };

  render() {
    const { rental, rentalIndex } = this.props;
    const { wantDelete } = this.state;

    const deleteClass = wantDelete ? "toBeDeleted" : "";
    return (
      <div className="col-md-4">
        <div className={`card text-center ${deleteClass}`}>
          <div className="card-block">
            <h4 className="card-title">
              {rental.title}- {toUppercase(rental.city)}
            </h4>
            <Link className="btn btn-bwm" to={`/rentals/${rental._id}`}>
              Go to Rental
            </Link>
            {rental.bookings &&
              rental.bookings.length && (
                <RentalManageModal bookings={rental.bookings} />
              )}
          </div>
          <div className="card-footer text-muted">
            Created at {prettifyDate(rental.createdAt)}
          </div>
          {!wantDelete && (
            <button className="btn btn-danger" onClick={this.showDeleteMenu}>
              Delete
            </button>
          )}
          {wantDelete && (
            <div className="delete-menu">
              Do You Confirm? {"  "}
              <button
                className="btn btn-danger"
                onClick={() => {
                  this.deleteRental(rental._id, rentalIndex);
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-success"
                onClick={this.closeDeleteMenu}
              >
                {" "}
                No
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default RentalManageCard;
