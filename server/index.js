const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const config = require("./config/dev");
const Rental = require("./models/Rentals");
const Fakedb = require("./fake-db");

const rentalRoutes = require("./routes/rental");
const userRoutes = require("./routes/users");
const bookingRoutes = require("./routes/bookings");

mongoose
  .connect(
    config.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("DB Connected");
    const fakedb = new Fakedb();
    // fakedb.seeDb();
  })
  .catch(e => {
    console.log(`Unable to connect ${e}`);
  });

const app = express();

app.use(bodyparser.json());
app.use("/api/v1/rentals", rentalRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is Running");
});
