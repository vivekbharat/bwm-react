import axios from "axios";
import authService from "../services/auth-service";

import {
  FETCH_RENTALS,
  FETCH_RENTAL,
  FETCH_RENTAL_INIT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from "./types";

import AxiosService from "../services/AxiosService";

let axiosInstance = AxiosService.getInstance();

//Rental Actions
export const fetchRentals = () => dispatch => {
  axiosInstance
    .get("/rentals")
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
//End of Rental Actions

//Auth Actions

export const register = userData => {
  // console.log("actions", userData);
  return axios
    .post("/api/v1/users/register", { ...userData })
    .then(res => {
      return res.data;
    })
    .catch(err => Promise.reject(err.response.data.errors));
};

const loginSuccess = () => {
  return {
    type: LOGIN_SUCCESS
  };
};

const loginFailure = errors => {
  return {
    type: LOGIN_FAILURE,
    errors
  };
};

export const checkAuthState = () => {
  return dispatch => {
    console.log("Check Auth state - actions");
    if (authService.isAuthenticated()) {
      dispatch(loginSuccess());
    }
  };
};

export const login = userData => {
  return dispatch => {
    // console.log("From actions");
    return axios
      .post("/api/v1/users/auth", { ...userData })
      .then(res => {
        // console.log("actions", res.data);
        return res.data;
      })
      .then(token => {
        // console.log(token);
        // localStorage.setItem("auth_token", token);
        authService.saveToken(token);
        dispatch(loginSuccess());
      })
      .catch(error => {
        dispatch(loginFailure(error.response.data.errors));
      });
  };
};

export const logout = () => {
  authService.invalidUser();
  return {
    type: LOGOUT
  };
};

export const createBooking = booking => {
  return axiosInstance
    .post("/bookings", { ...booking })
    .then(res => res.data)
    .catch(({ response }) => {
      return Promise.reject(response.data.errors);
    });
};
