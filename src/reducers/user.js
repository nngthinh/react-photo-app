import { KUserActions } from "constants/actions";

const initialState = {
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case KUserActions.SIGN_UP_SUCCESS:
      return { isLoggedIn: false };
    case KUserActions.SIGN_UP_FAILED:
      return { isLoggedIn: false };
    case KUserActions.SIGN_IN_SUCCESS:
      return {
        isLoggedIn: true,
        token: action.data.accessToken,
      };
    case KUserActions.SIGN_IN_FAILED:
      return { isLoggedIn: false };
    case KUserActions.SIGN_OUT_SUCCESS:
      return { isLoggedIn: false };
    case KUserActions.SIGN_OUT_FAILED:
      return { ...state };
    case KUserActions.GET_USER_INFO_SUCCESS: {
      const userInfo = action.data;
      return { ...state, info: { name: userInfo.name, id: userInfo.id } };
    }
    case KUserActions.GET_USER_INFO_FAILED: {
      return { ...state };
    }
    default:
      return state;
  }
};

export default userReducer;
