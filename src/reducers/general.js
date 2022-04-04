import CustomError from "constants/error";

const initialState = {
  isOnline: true,
};

const generalReducer = (state = initialState, action) => {
  switch (true) {
    // Online status
    // - Note: Based on the server response, there's no need to examine
    //         the http status code but javascript error message
    case /.*_FAILED$/.test(action.type): {
      const error = action.error;
      return String(error.message).includes(CustomError.NETWORK_ERROR)
        ? { isOnline: false }
        : { isOnline: true };
    }
    case /.*_SUCCESS$/.test(action.type):
      return { isOnline: true };
    default:
      return state;
  }
};

export default generalReducer;
