import { KUserActions } from "constants/actions";

const initialState = {
  isLoggedIn: false,
  token: null,
  recentlySignedOut: null,
  laterUrl: null,
  info: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case KUserActions.SIGN_UP_SUCCESS:
      return { ...state, isLoggedIn: false };
    case KUserActions.SIGN_UP_FAILED:
      return { ...state, isLoggedIn: false };
    case KUserActions.SIGN_IN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: action.data.accessToken,
      };
    case KUserActions.SIGN_IN_FAILED:
      return { ...state, isLoggedIn: false };
    case KUserActions.SIGN_OUT_SUCCESS:
      return { ...initialState };
    case KUserActions.SIGN_OUT_FAILED:
      return { ...state };
    case KUserActions.GET_USER_INFO_SUCCESS: {
      const userInfo = action.data;
      return { ...state, info: { name: userInfo.name, id: userInfo.id } };
    }
    case KUserActions.GET_USER_INFO_FAILED: {
      return { ...state };
    }
    case KUserActions.CLEAN_USER_INFO: {
      return { ...initialState };
    }
    case KUserActions.SET_URL_AFTER_LOGGED_IN: {
      return {
        ...state,
        laterUrl: action.laterUrl,
      };
    }
    case KUserActions.REMOVE_URL_AFTER_LOGGED_IN: {
      return { ...state, laterUrl: null };
    }
    default:
      return state;
  }
};

export default userReducer;
