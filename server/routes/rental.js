const express = require("express");
const router = express.Router();
const Rental = require("../models/Rentals");

const UserControl = require("../controllers/user");

router.get("/secret", UserControl.authMiddleware, (req, res) => {
  res.json({ secret: true });
});

router.get("/", (req, res) => {
  Rental.find({})
    .select("-bookings")
    .then(foundRentals => {
      return res.json(foundRentals);
    })
    .catch(err =>
      res.status(404).json({
        errors: { title: "Rental Error!", detail: "Could not find Rental" }
      })
    );
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
          errors: [
            {
              title: "Rental Error!",
              detail: "Cannot Find rental"
            }
          ]
        });
      }
    });
});

module.exports = router;
