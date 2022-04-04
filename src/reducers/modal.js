import { ModalAction } from "constants/actions";

const initialState = {
  show: false,
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case ModalAction.SHOW_MODAL:
      return {
        show: true,
        config: action.config,
      };
    case ModalAction.CLEAR_MODAL:
      return {
        show: false,
      };
    default:
      return state;
  }
};

export default modalReducer;
