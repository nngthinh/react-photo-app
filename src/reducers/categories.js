import { KCategoriesAction } from "constants/actions";

const categoriesReducer = (state = {}, action) => {
  switch (action.type) {
    case KCategoriesAction.CREATE_CATEGORY_SUCCESS:
      return { ...state };
    case KCategoriesAction.CREATE_CATEGORY_FAILED:
      return { ...state };
    case KCategoriesAction.VIEW_CATEGORIES_SUCCESS:
      return { ...state };
    case KCategoriesAction.VIEW_CATEGORIES_FAILED:
      return { ...state };
    default:
      return state;
  }
};

export default categoriesReducer;
