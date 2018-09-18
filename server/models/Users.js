const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
// const { methods } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    max: [32, "Too long, Max 128 characters"],
    min: [4, "Too Short, Min 4 characters"]
  },
  email: {
    type: String,
    max: [32, "Too long, Max 128 characters"],
    min: [4, "Too Short, Min 4 characters"],
    unique: true,
    lowercase: true,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: {
    type: String,
    max: [32, "Too long, Max 128 characters"],
    min: [4, "Too Short, Min 4 characters"],
    required: "Password is required"
  },
  rentals: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Booking"
    }
  ]
});

userSchema.pre("save", function(next) {
  const user = this;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.hasSamePassword = function(requestedPassword) {
  console.log("From methods hasSamePassword");
  return bcrypt.compareSync(requestedPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
