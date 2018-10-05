import {
  FETCH_USER_BOOKINGS_INIT,
  FETCH_USER_BOOKINGS_SUCCESS,
  FETCH_USER_BOOKINGS_FAIL
} from "../actions/types";

const INITIAL_STATE = {
  data: [],
  errors: [],
  isFetching: false
};

export const bookingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_BOOKINGS_INIT:
      return { ...state, data: [], errors: [], isFetching: true };

    case FETCH_USER_BOOKINGS_SUCCESS:
      return {
        ...state,
        data: action.userBookings,
        errors: [],
        isFetching: false
      };

    case FETCH_USER_BOOKINGS_FAIL:
      // return Object.assign({}, state, { errors: action.errors, data: [] });
      return { ...state, errors: [], data: [], isFetching: false };

    default:
      return state;
  }
};
