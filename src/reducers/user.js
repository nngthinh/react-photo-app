const initialState = {
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state,
        pendingAction: "SIGN_IN",
      };
    case "SIGN_UP":
      return {
        ...state,
        pendingAction: "SIGN_UP",
      };
    case "SIGN_OUT":
      return {
        ...state,
        pendingAction: "SIGN_OUT",
      };
    case "GET_USER_INFO":
      return {
        ...state,
        pendingAction: "GET_USER_INFO",
      };
    default:
      return state;
  }
};

export default userReducer;
