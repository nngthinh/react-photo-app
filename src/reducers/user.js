const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        type: "SIGN_IN",
      };
    case "SIGN_UP":
      return {
        type: "SIGN_UP",
      };
    case "SIGN_OUT":
      return {
        type: "SIGN_OUT",
      };
    default:
      state;
  }
};

export default userReducer;
