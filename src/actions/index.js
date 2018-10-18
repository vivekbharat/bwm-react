import axios from "axios";
import authService from "../services/auth-service";

import {
  FETCH_RENTALS,
  FETCH_RENTAL,
  FETCH_RENTAL_INIT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  FETCH_RENTALS_FAIL,
  FETCH_RENTALS_INIT,
  FETCH_USER_BOOKINGS_INIT,
  FETCH_USER_BOOKINGS_SUCCESS,
  FETCH_USER_BOOKINGS_FAIL,
  UPDATE_RENTAL_SUCCESS,
  UPDATE_RENTAL_FAIL,
  RESET_RENTAL_ERRORS,
  RELOAD_MAP,
  RELOAD_MAP_FINISH
} from "./types";

import AxiosService from "../services/AxiosService";

let axiosInstance = AxiosService.getInstance();

export const verifyRentalOwner = rentalId => {
  return axiosInstance.get(`/rentals/${rentalId}/verify-user`);
};

export const reloadMap = () => {
  // console.log("running reload map");
  return {
    type: RELOAD_MAP
  };
};

export const reloadMapFinish = () => {
  return {
    type: RELOAD_MAP_FINISH
  };
};

//Rental Actions
export const fetchRentals = city => dispatch => {
  const url = city ? `/rentals/?city=${city}` : "/rentals";

  dispatch(fetchRentalsInit());
  axiosInstance
    .get(url)
    .then(res => res.data)
    .then(rentals => {
      // console.log(rentals);
      dispatch({
        type: FETCH_RENTALS,
        payload: rentals
      });
    })
    .catch(({ response }) => dispatch(fetchRentalsFail(response.data.errors)));
};

const fetchRentalsInit = () => {
  return {
    type: FETCH_RENTALS_INIT
  };
};

const fetchRentalsFail = errors => {
  return {
    type: FETCH_RENTALS_FAIL,
    errors
  };
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

//User Rental Manage Actions

export const getUserRental = () => {
  // console.log("actions", userData);
  return axiosInstance
    .get("/rentals/manage")
    .then(res => {
      return res.data;
    })
    .catch(err => Promise.reject(err.response.data.errors));
};

export const deleteRental = id => {
  // console.log("Hitt 1", id);
  return axiosInstance
    .delete(`/rentals/${id}`)
    .then(res => res.data)
    .catch(err => Promise.reject(err.response.data.errors));
};

export const resetRental = () => {
  return {
    type: RESET_RENTAL_ERRORS
  };
};

//UPDATE RENTAL ACTIONS
const updateRentalSuccess = updatedRental => {
  return {
    type: UPDATE_RENTAL_SUCCESS,
    rental: updatedRental
  };
};

const updateRentalFail = errors => {
  return {
    type: UPDATE_RENTAL_FAIL,
    errors
  };
};

export const updateRental = (id, rentalData) => dispatch => {
  return axiosInstance
    .patch(`/rentals/${id}`, rentalData)
    .then(res => res.data)
    .then(updatedRental => {
      dispatch(updateRentalSuccess(updatedRental));
      if (rentalData.city || rentalData.street) {
        // console.log("running reload map from update rental", rentalData);
        dispatch(reloadMap());
      }
    })
    .catch(({ response }) => dispatch(updateRentalFail(response)));
};

//End of Rental Actions

//USer Bookings action

const fetchUserBookingsInit = () => {
  return {
    type: FETCH_USER_BOOKINGS_INIT
  };
};

const fetchUserBookingsSuccess = userBookings => {
  return {
    type: FETCH_USER_BOOKINGS_SUCCESS,
    userBookings
  };
};

const fetchUserBookingsFail = errors => {
  return {
    type: FETCH_USER_BOOKINGS_FAIL,
    errors
  };
};

export const fetchUserBookings = () => dispatch => {
  dispatch(fetchUserBookingsInit());
  // console.log("HITTT 1");

  axiosInstance
    .get("/bookings/manage")
    .then(res => res.data)
    .then(bookings => dispatch(fetchUserBookingsSuccess(bookings)))
    .catch(({ response }) =>
      dispatch(fetchUserBookingsFail(response.data.errors))
    );
};

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
  const username = authService.getUserName();
  return {
    type: LOGIN_SUCCESS,
    username
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
    // console.log("Check Auth state - actions");
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
      .then(json => {
        // console.log(json.token);
        // localStorage.setItem("auth_token", token);
        authService.saveToken(json.token);
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
  // console.log("2. Create Booking Actions");
  // console.log(booking);
  return axiosInstance
    .post("/bookings", { ...booking })
    .then(res => {
      // console.log("3.1 From API with booking result", res);
      return res.data;
    })
    .catch(error => {
      // console.log(error, "booking actions");
      // console.log("3.2 From API with Error result", error);
      return Promise.reject(error.response.data.errors);
    });
};

export const createRental = rental => {
  return axiosInstance
    .post("/rentals", { ...rental })
    .then()
    .catch(res => {
      return res.data;
    })
    .catch(err => {
      return Promise.reject(err.response.data.errors);
    });
};
