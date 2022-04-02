import { CategoriesAction } from "constants/actions";
import CustomLimit from "constants/limit";

const initialState = {
  pagination: {},
  list: null,
  detail: {},
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case CategoriesAction.VIEW_CATEGORIES_SUCCESS: {
      const categoriesInfo = action.data;
      return {
        ...state,
        pagination: {
          total: Math.ceil(
            categoriesInfo.totalItems / CustomLimit.CATEGORY_PAGINATION
          ),
        },
        list: categoriesInfo.items, // shouldn't be cached
      };
    }
    case CategoriesAction.VIEW_CATEGORIES_FAILED:
      return { ...state };
    case CategoriesAction.CREATE_CATEGORY_SUCCESS:
      return { ...state };
    case CategoriesAction.CREATE_CATEGORY_FAILED:
      return { ...state };
    case CategoriesAction.VIEW_CATEGORY_SUCCESS: {
      const categoryInfo = action.data;
      return { ...state, detail: categoryInfo };
    }
    case CategoriesAction.VIEW_CATEGORY_FAILED:
      return { ...state };
    case CategoriesAction.UPDATE_CATEGORY_SUCCESS:
      return { ...state };
    case CategoriesAction.UPDATE_CATEGORY_FAILED:
      return { ...state };
    case CategoriesAction.CLEAR_CATEGORY_INFO:
      return { ...initialState };
    default:
      return state;
  }
};

export default categoriesReducer;
