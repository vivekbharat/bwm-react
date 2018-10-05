const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const path = require("path");

const config = require("./config");
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
    if (process.env.NODE_ENV !== "production") {
      const fakedb = new Fakedb();
      // fakedb.seeDb();
    }
  })
  .catch(e => {
    console.log(`Unable to connect ${e}`);
  });

const app = express();

app.use(bodyparser.json());
app.use("/api/v1/rentals", rentalRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);

if (process.env.NODE_ENV === "production") {
  const appPath = path.join(__dirname, "..", "build");
  app.use(express.static(appPath));
  app.get("*", function(req, res) {
    res.sendFile(path.resolve(appPath, "index.html"));
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is Running");
});
