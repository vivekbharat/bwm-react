import { createStore, applyMiddleware, compose, combineReducers } from "redux";

import { rentalReducer, selectedRentalReducer } from "./rental-reducer";
import { authReducer } from "./auth-reducer";
import { bookingReducer } from "./booking-reducer";
import { mapReducer } from "./map-reducer";

import { reducer as formReducer } from "redux-form";

import thunk from "redux-thunk";

export const init = () => {
  const reducer = combineReducers({
    rentals: rentalReducer,
    rental: selectedRentalReducer,
    form: formReducer,
    auth: authReducer,
    booking: bookingReducer,
    map: mapReducer
  });

  const middleware = [thunk];

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  // const reduxExtension =
  //   window.__REDUX_DEVTOOLS_EXTENSION__ &&
  //   window.__REDUX_DEVTOOLS_EXTENSION__();

  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middleware))
  );
  return store;
};
