import moment from "moment";
import titleize from "titleize";

export const rentalType = isShared => (isShared ? "shared" : "entire");

export const toUppercase = value => (value ? titleize(value) : "");

export const prettifyDate = date => moment(date).format("MMM Do YY");

export const getRentalDates = (startAt, endAt, dateFormat) => {
  const tempDates = [];
  const formattedEndAt = moment(endAt);
  let formattedStartAt = moment(startAt);

  while (formattedStartAt < formattedEndAt) {
    tempDates.push(formattedStartAt.format(dateFormat));

    formattedStartAt = formattedStartAt.add(1, "day");
  }

  tempDates.push(formattedEndAt.format(dateFormat));
  // console.log(tempDates, "tempDates");
  return tempDates;
};
