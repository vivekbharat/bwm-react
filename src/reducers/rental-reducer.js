import {
  FETCH_RENTALS,
  FETCH_RENTAL,
  FETCH_RENTAL_INIT,
  FETCH_RENTALS_FAIL,
  FETCH_RENTALS_INIT,
  UPDATE_RENTAL_SUCCESS,
  UPDATE_RENTAL_FAIL,
  RESET_RENTAL_ERRORS
} from "../actions/types";

const INITIAL_STATE = {
  rentals: {
    data: [],
    errors: []
  },
  rental: {
    data: {},
    errors: []
  }
};

export const rentalReducer = (state = INITIAL_STATE.rentals, action) => {
  switch (action.type) {
    case FETCH_RENTALS:
      // console.log(action.payload, "action payload");
      return { ...state, data: action.payload };

    case FETCH_RENTALS_INIT:
      return { ...state, data: [], errors: [] };
    case FETCH_RENTALS_FAIL:
      return Object.assign({}, state, { errors: action.errors, data: [] });
    default:
      return state;
  }
};

export const selectedRentalReducer = (state = INITIAL_STATE.rental, action) => {
  switch (action.type) {
    case FETCH_RENTAL:
      return { ...state, data: action.payload };

    case FETCH_RENTAL_INIT:
      return { ...state, data: {} };

    case UPDATE_RENTAL_SUCCESS:
      return { ...state, data: action.rental };

    case UPDATE_RENTAL_FAIL:
      return { ...state, errors: action.errors };
    case RESET_RENTAL_ERRORS:
      return { ...state, errors: [] };
    default:
      return state;
  }
};
