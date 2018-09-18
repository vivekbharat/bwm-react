const Booking = require("../models/Bookings");
const Rental = require("../models/Rentals");
const User = require("../models/Users");
const { normalizeErrors } = require("../helpers/mongoose");
const moment = require("moment");

exports.createBooking = (req, res) => {
  const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
  console.log("1", startAt, endAt, totalPrice, guests, days, rental);
  const user = res.locals.user;
  console.log("2", user);
  const booking = new Booking({ startAt, endAt, totalPrice, guests, days });
  console.log("3", booking);
  Rental.findById(rental._id)
    .populate("bookings")
    .populate("user")
    .then(foundRental => {
      if (foundRental.user.id === user.id) {
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

            return res.json({ startAt: booking.startAt, endAt: booking.endAt });
          })
          .catch(err => {
            if (err) {
              return res
                .status(422)
                .send({ errors: normalizeErrors(err.errors) });
            }
          });
      } else {
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

  return isValid;
}
