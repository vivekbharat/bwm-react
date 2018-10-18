import { RELOAD_MAP, RELOAD_MAP_FINISH } from "../actions/types";

const INITIAL_STATE = {
  isReloading: false
};

export const mapReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RELOAD_MAP:
      // console.log("Reload map reducer ran");
      return { ...state, isReloading: true };
    case RELOAD_MAP_FINISH:
      // console.log("Reload map finish reducer ran");

      return { ...state, isReloading: false };

    default:
      return state;
  }
};
