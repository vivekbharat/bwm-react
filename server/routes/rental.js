const express = require("express");
const router = express.Router();
const Rental = require("../models/Rentals");
const User = require("../models/Users");

const UserControl = require("../controllers/user");
const { normalizeErrors } = require("../helpers/mongoose");

router.get("/secret", UserControl.authMiddleware, (req, res) => {
  res.json({ secret: true });
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

module.exports = router;
