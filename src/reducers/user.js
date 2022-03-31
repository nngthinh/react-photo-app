import { UserAction } from "constants/actions";

const initialState = {
  isLoggedIn: false,
  token: null,
  info: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UserAction.SIGN_UP_SUCCESS:
      return { ...state, isLoggedIn: false };
    case UserAction.SIGN_UP_FAILED:
      return { ...state, isLoggedIn: false };
    case UserAction.SIGN_IN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: action.data.accessToken,
      };
    case UserAction.SIGN_IN_FAILED:
      return { ...state, isLoggedIn: false };
    case UserAction.SIGN_OUT_SUCCESS:
      return { ...initialState };
    case UserAction.SIGN_OUT_FAILED:
      return { ...state };
    case UserAction.GET_USER_INFO_SUCCESS: {
      const userInfo = action.data;
      return { ...state, info: { name: userInfo.name, id: userInfo.id } };
    }
    case UserAction.GET_USER_INFO_FAILED: {
      return { ...state };
    }
    case UserAction.CLEAN_USER_INFO: {
      return { ...initialState };
    }
    default:
      return state;
  }
};

export default userReducer;
