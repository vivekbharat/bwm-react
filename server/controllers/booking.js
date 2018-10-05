const Booking = require("../models/Bookings");
const Rental = require("../models/Rentals");
const User = require("../models/Users");
const { normalizeErrors } = require("../helpers/mongoose");
const moment = require("moment");

exports.createBooking = (req, res) => {
  // console.log("it ran from server");
  const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
  // console.log("1. req.body", req.body);
  const user = res.locals.user;
  // console.log("2, ");
  const booking = new Booking({ startAt, endAt, totalPrice, guests, days });
  // console.log("3, ");
  Rental.findById(rental._id)
    .populate("bookings")
    .populate("user")
    .then(foundRental => {
      if (foundRental.user.id === user.id) {
        // console.log("Invalid User, cannot create booking on your own rental");
        return res.status(422).send({
          errors: [
            {
              title: "Invalid User!",
              detail: "Cannot create booking on your rental"
            }
          ]
        });
      }

      if (isValidBooking(booking, foundRental)) {
        booking.user = user;
        booking.rental = foundRental;
        foundRental.bookings.push(booking);
        // console.log("Book if its a valid function ran");

        // foundRental.save();
        booking
          .save()
          .then(() => {
            foundRental.save();
            User.update(
              { _id: user.id },
              { $push: { bookings: booking } },
              function() {}
            );
            // console.log("Booking Confirmed", booking);
            return res.json({ startAt: booking.startAt, endAt: booking.endAt });
          })
          .catch(err => {
            if (err) {
              // console.log("Booking Error");
              return res
                .status(422)
                .send({ errors: normalizeErrors(err.errors) });
            }
          });
      } else {
        // console.log("Chosen dates are already taken");
        return res.status(422).send({
          errors: [
            {
              title: "Invalid Booking!",
              detail: "Chosen dates are already taken"
            }
          ]
        });
      }

      //Checck for valid booking
      // return res.json({ booking, foundRental });
    })
    .catch(err => {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
    });
};

function isValidBooking(proposedBooking, rental) {
  let isValid = true;

  // console.log("is valid booking function ran");

  if (rental.bookings && rental.bookings.length > 0) {
    isValid = rental.bookings.every(booking => {
      const proposedStart = moment(proposedBooking.startAt);
      const proposedEnd = moment(proposedBooking.endAt);

      const actualStart = moment(booking.startAt);
      const actualEnd = moment(booking.endAt);

      return (
        (actualStart < proposedStart && actualEnd < proposedStart) ||
        (proposedEnd < actualEnd && proposedEnd < actualStart)
      );
    });
  }
  // console.log(isValid);
  return isValid;
}

exports.getUserBookings = (req, res) => {
  const user = res.locals.user;
  console.log("HITTT 2");

  Booking.where({ user })
    .populate("rental")
    .then(foundBookings => {
      return res.json(foundBookings);
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
};
