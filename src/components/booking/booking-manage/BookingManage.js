import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../../../actions";
import BookingCard from "./BookingCard";

class BookingManage extends Component {
  componentWillMount() {
    this.props.dispatch(actions.fetchUserBookings());
  }

  render() {
    const bookings = this.props.booking;
    return (
      <section id="userBookings">
        <h1 className="page-title">My Bookings</h1>
        <div className="row">
          {bookings.data.map((booking, index) => (
            <BookingCard booking={booking} key={index} />
          ))}
        </div>
        {bookings.data.length === 0 && (
          <div className="alert alert-warning">
            You have no bookings created go to rentals section and book your
            place today.
            <Link
              style={{ marginLeft: "10px" }}
              className="btn btn-bwm"
              to="/rentals"
            >
              Available Rental
            </Link>
          </div>
        )}
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    booking: state.booking
  };
};

export default connect(mapStateToProps)(BookingManage);
