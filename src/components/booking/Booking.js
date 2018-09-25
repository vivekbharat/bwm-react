import React, { Component } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";

import { getRentalDates } from "helpers";
import BookingModal from "./BookingModal";
import * as actions from "actions";
// import { start } from "repl";

class Booking extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.bookedOutDates = [];
    this.state = {
      proposedBooking: {
        startAt: "",
        endAt: "",
        guests: 0,
        rental: {}
      },
      modal: {
        open: false
      },
      errors: []
    };

    this.dateRef = React.createRef();
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
      this.bookedOutDates.includes(date.format("Y/MN/DD")) ||
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
      ...this.state.proposedBooking,
      proposedBooking: { startAt, endAt }
    });
    // console.log(this.state);
  };

  handleGuestChange = event => {
    this.setState({
      proposedBooking: {
        ...this.state.proposedBooking,
        guests: parseInt(event.target.value)
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
    actions.createBooking(this.state.proposedBooking).then(
      booking => {
        debugger;
      },
      errors => {
        console.log(errors, "reserve rental");
        this.setState({ errors });
      }
    );
  };

  render() {
    const { rental } = this.props;
    const { startAt, endAt, guests } = this.state.proposedBooking;
    return (
      <div className="booking">
        <h3 className="booking-price">
          ${rental.dailyRate}{" "}
          <span className="booking-per-night">per night</span>
        </h3>
        <hr />
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

export default Booking;
