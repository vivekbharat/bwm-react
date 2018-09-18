const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  title: {
    type: String,
    required: true,
    max: [128, "Too long, Max 128 characters"]
  },
  city: {
    type: String,
    required: true,
    lowercase: true
  },
  street: {
    type: String,
    required: true,
    min: [4, "Too Short, Min 4 characters"]
  },
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  image: {
    type: String,
    required: true
  },
  bedrooms: Number,
  shared: Boolean,
  description: {
    type: String,
    required: true
  },
  dailyRate: Number,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking"
    }
  ]
});

module.exports = mongoose.model("Rental", rentalSchema);
