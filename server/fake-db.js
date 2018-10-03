const Rental = require("./models/Rentals");
const User = require("./models/Users");
const Booking = require("./models/Bookings");
const fakeDbData = require("./data.json");

class Fakedb {
  constructor() {
    this.rentals = fakeDbData.rentals;

    this.users = fakeDbData.users;
  }

  async cleanDb() {
    await User.remove({});
    await Rental.remove({});
    await Booking.remove({});
  }

  pushRentalsToDB() {
    const user = new User(this.users[0]);
    const user2 = new User(this.users[1]);

    this.rentals.forEach(rental => {
      const newRental = new Rental(rental);
      newRental.user = user;

      user.rentals.push(newRental);

      newRental.save();
    });
    user.save();
    user2.save();
  }

  async seeDb() {
    await this.cleanDb();
    this.pushRentalsToDB();
  }
}

module.exports = Fakedb;
