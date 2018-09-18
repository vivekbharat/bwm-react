import axios from "axios";
import { FETCH_RENTALS, FETCH_RENTAL, FETCH_RENTAL_INIT } from "./types";

export const fetchRentals = () => dispatch => {
  axios
    .get("/api/v1/rentals")
    .then(res => {
      return res.data;
    })
    .then(rentals => {
      // console.log(rentals);
      dispatch({
        type: FETCH_RENTALS,
        payload: rentals
      });
    });
};

export const fetchRental = rentalId => dispatch => {
  dispatch({
    type: FETCH_RENTAL_INIT
  });

  axios
    .get(`/api/v1/rentals/${rentalId}`)
    .then(res => res.data)
    .then(rental => {
      dispatch({
        type: FETCH_RENTAL,
        payload: rental
      });
    });
};
