import React, { Component } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import { getRentalDates } from "helpers";
import BookingModal from "./BookingModal";
import * as actions from "../../actions";
// import { start } from "repl";

class Booking extends Component {
  constructor() {
    super();
    // console.log(this.props);
    this.bookedOutDates = [];
    this.dateRef = React.createRef();
    this.state = {
      proposedBooking: {
        startAt: "",
        endAt: "",
        guests: "",
        rental: {}
      },
      modal: {
        open: false
      },
      errors: []
    };
  }

  componentWillMount() {
    this.getBookedoutDates();
  }

  getBookedoutDates = () => {
    const { bookings } = this.props.rental;

    if (bookings && bookings.length > 0) {
      bookings.forEach(booking => {
        // console.log(booking, "booking");
        const dateRange = getRentalDates(
          booking.startAt,
          booking.endAt,
          "Y/MM/DD"
        );

        this.bookedOutDates.push(...dateRange);
        // console.log(this.bookedOutDates, "booked out dates");
      });
    }
  };

  checkInvalidDates = date => {
    return (
      this.bookedOutDates.includes(date.format("Y/MM/DD")) ||
      date.diff(moment(), "days") < 0
    );
  };

  handleApply = (event, picker) => {
    // console.log("CLicked");
    // console.log(picker);
    const startAt = picker.startDate.format("Y/MM/DD");
    const endAt = picker.endDate.format("Y/MM/DD");

    this.dateRef.current.value = startAt + " to " + endAt;

    this.setState({
      proposedBooking: { ...this.state.proposedBooking, startAt, endAt }
    });
    // console.log(this.state);
  };

  handleGuestChange = event => {
    this.setState({
      proposedBooking: {
        ...this.state.proposedBooking,
        guests: parseInt(event.target.value, 10)
      }
    });
  };

  cancelProposedBooking = () => {
    this.setState({
      modal: {
        open: false
      }
    });
  };

  addNewBookedOutDates = booking => {
    const dateRange = getRentalDates(booking.startAt, booking.endAt, "Y/MM/DD");
    // console.log(this.bookedOutDates, "Booked out Dates");
    this.bookedOutDates.push(...dateRange);
  };

  resetData = () => {
    this.dateRef.current.value = "";

    this.setState({ proposedBooking: { guests: "" } });
  };

  confirmProposedBooking = () => {
    const { startAt, endAt } = this.state.proposedBooking;
    const days = getRentalDates(startAt, endAt, "Y/MM/DD").length - 1;
    const { rental } = this.props;
    // console.log(rental.dailyRate, "CPB Rental");

    this.setState({
      proposedBooking: {
        ...this.state.proposedBooking,
        days,
        totalPrice: days * rental.dailyRate,
        rental: rental
      },
      modal: {
        open: true
      }
    });
    // console.log(this.state);
  };

  reserveRental = () => {
    // console.log("1. Confirm Button Clicked");
    actions
      .createBooking(this.state.proposedBooking)
      .then(booking => {
        // console.log("4. BOoking Result React", booking);
        this.addNewBookedOutDates(booking);
        this.cancelProposedBooking();
        this.resetData();
        toast.success("Booking has been successfully Created");
      })
      .catch(errors => {
        // console.log("5. Errors with reserve rental", errors);
        this.setState({ errors });
      });
  };

  render() {
    const {
      rental,
      auth: { isAuth }
    } = this.props;
    const { startAt, endAt, guests } = this.state.proposedBooking;
    return (
      <div className="booking">
        <ToastContainer />
        <h3 className="booking-price">
          ${rental.dailyRate}{" "}
          <span className="booking-per-night">per night</span>
        </h3>
        <hr />
        {!isAuth && (
          <Link className="btn btn-bwm btn-confirm btn-block" to="/login">
            Login To Book a Place
          </Link>
        )}
        {isAuth && (
          <React.Fragment>
            <div className="form-group">
              <label htmlFor="dates">Dates</label>
              <DateRangePicker
                onApply={this.handleApply}
                isInvalidDate={this.checkInvalidDates}
                opens="left"
                containerStyles={{ display: "block" }}
              >
                <input
                  ref={this.dateRef}
                  type="text"
                  name=""
                  id="dates"
                  className="form-contrl"
                />
              </DateRangePicker>
            </div>
            <div className="form-group">
              <label htmlFor="guests">Guests</label>
              <input
                value={guests}
                type="number"
                className="form-control"
                id="guests"
                aria-describedby="emailHelp"
                placeholder=""
                onChange={this.handleGuestChange}
              />
            </div>
            <button
              disabled={!startAt || !endAt || !guests}
              onClick={() => this.confirmProposedBooking()}
              className="btn btn-bwm btn-confirm btn-block"
            >
              Reserve place now
            </button>
          </React.Fragment>
        )}
        <hr />
        <p className="booking-note-title">
          People are interested into this house
        </p>
        <p className="booking-note-text">
          More than 500 people checked this rental in last month.
        </p>
        <BookingModal
          closeModal={this.cancelProposedBooking}
          open={this.state.modal.open}
          booking={this.state.proposedBooking}
          rentalPrice={rental.dailyRate}
          confirmBooking={this.reserveRental}
          errors={this.state.errors}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(Booking);
