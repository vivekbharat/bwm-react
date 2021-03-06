const express = require("express");
const router = express.Router();
const Rental = require("../models/Rentals");
const User = require("../models/Users");

const UserControl = require("../controllers/user");
const { normalizeErrors } = require("../helpers/mongoose");

router.get("/secret", UserControl.authMiddleware, (req, res) => {
  res.json({ secret: true });
});

router.get("/manage", UserControl.authMiddleware, (req, res) => {
  const user = res.locals.user;

  Rental.where({ user })
    .populate("bookings")
    .then(foundRentals => {
      return res.json(foundRentals);
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

router.get("/:id/verify-user", UserControl.authMiddleware, (req, res) => {
  const user = res.locals.user;

  Rental.findById(req.params.id)
    .populate("user")
    .then(foundRental => {
      if (foundRental.user.id !== user.id) {
        return res.status(422).send({
          errors: [
            { title: "Invalid User!", detail: "You are not rental owner" }
          ]
        });
      }

      return res.json({ status: "verified" });
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

router.get("/:id", (req, res) => {
  const rentalId = req.params.id;

  Rental.findById(rentalId)
    .populate("user")
    .populate("bookings")
    .then(foundRental => {
      return res.json(foundRental);
    })
    .catch(err => {
      if (err) {
        return res.status(422).send({
          errors: [{ title: "Rental Error!", detail: "Cannot Find rental" }]
        });
      }
    });
});

router.post("", UserControl.authMiddleware, (req, res) => {
  const {
    title,
    city,
    street,
    category,
    image,
    shared,
    bedrooms,
    description,
    dailyRate
  } = req.body;
  console.log(
    "title: " + title,
    "city: " + city,
    "street: " + street,
    "category: " + category,
    "image: " + image,
    "shared: " + shared,
    "bedrooms: " + bedrooms,
    "description: " + description,
    "dailyRate: " + dailyRate
  );

  const user = res.locals.user;
  const rental = new Rental({
    title,
    city,
    street,
    category,
    image,
    shared,
    bedrooms,
    description,
    dailyRate
  });
  rental.user = user;
  // console.log(rental, user);

  Rental.create(rental)
    .then(newRental => {
      User.update(
        { _id: user.id },
        { $push: { rentals: newRental } },
        function() {}
      );
      return res.json(newRental);
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

router.get("/", (req, res) => {
  const city = req.query.city;
  const query = city ? { city: city.toLowerCase() } : {};

  Rental.find(query)
    .select("-bookings")
    .then(foundRentals => {
      if (city && foundRentals.length === 0) {
        return res.status(422).send({
          errors: [
            {
              title: "No Rentals Found!",
              detail: `There are no rentals for city ${city}`
            }
          ]
        });
      }
      return res.json(foundRentals);
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

router.patch("/:id", UserControl.authMiddleware, (req, res) => {
  const rentalData = req.body;

  const user = res.locals.user;

  Rental.findById(req.params.id)
    .populate("user")
    .then(foundRental => {
      if (foundRental.user.id !== user.id) {
        return res.status(422).send({
          errors: [
            {
              title: "Invalid User",
              detail: `You are not the rental owner`
            }
          ]
        });
      }

      foundRental.set(rentalData);
      foundRental
        .save()
        .then(() => res.status(200).send(foundRental))
        .catch(err => {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        });
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

router.delete("/:id", UserControl.authMiddleware, (req, res) => {
  const user = res.locals.user;
  console.log("Hitt 2");
  Rental.findById(req.params.id)
    .populate("user", "_id")
    .populate({
      path: "bookings",
      select: "startAt",
      match: { startAt: { $gt: new Date() } }
    })
    .then(foundRental => {
      if (user.id !== foundRental.user.id) {
        return res.status(422).send({
          errors: [
            {
              title: "Invalid User",
              detail: `You are not the rental owner`
            }
          ]
        });
      }

      if (foundRental.bookings.length > 0) {
        return res.status(422).send({
          errors: [
            {
              title: "Active Bookings found",
              detail: `Cannot delete rentals with active bookings`
            }
          ]
        });
      }

      foundRental.remove(err => {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        return res.json({ status: "deleted" });
      });
    })
    .catch(err => {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    });
});

module.exports = router;
