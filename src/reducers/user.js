import { KUserActions } from "constants/actions";

const initialState = {
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case KUserActions.SIGN_IN_SUCCESS:
      return { ...state };
    case KUserActions.SIGN_IN_FAILED:
      return { ...state };
    case KUserActions.SIGN_UP_SUCCESS:
      return { ...state };
    case KUserActions.SIGN_UP_FAILED:
      return { ...state };
    case KUserActions.SIGN_OUT_SUCCESS:
      return { ...state };
    case KUserActions.SIGN_OUT_FAILED:
      return { ...state };
    default:
      return state;
  }
};

export default userReducer;
