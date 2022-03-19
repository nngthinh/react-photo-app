import { KModalAction } from "constants/actions";

const initialState = {
  show: false,
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case KModalAction.SHOW_MODAL:
      return {
        show: true,
        config: action.config,
      };
    case KModalAction.CLEAR_MODAL:
      return {
        show: false,
      };
    default:
      return state;
  }
};

export default modalReducer;
