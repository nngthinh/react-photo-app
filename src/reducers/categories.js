import { KCategoriesAction } from "constants/actions";
import { limitCategories } from "constants/pagination";

const initialState = {
  pagination: {},
  data: {},
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case KCategoriesAction.VIEW_CATEGORIES_SUCCESS: {
      const categoriesInfo = action.data;
      return {
        pagination: {
          total: Math.ceil(categoriesInfo.totalItems / limitCategories),
        },
        data: categoriesInfo.items, // shouldn't be cached
      };
    }
    case KCategoriesAction.VIEW_CATEGORIES_FAILED:
      return { ...state };
    case KCategoriesAction.CREATE_CATEGORY_SUCCESS:
      return { ...state };
    case KCategoriesAction.CREATE_CATEGORY_FAILED:
      return { ...state };
    case KCategoriesAction.VIEW_CATEGORY_SUCCESS:
      return { ...state };
    case KCategoriesAction.VIEW_CATEGORY_FAILED:
      return { ...state };
    case KCategoriesAction.UPDATE_CATEGORY_SUCCESS:
      return { ...state };
    case KCategoriesAction.UPDATE_CATEGORY_FAILED:
      return { ...state };
    default:
      return state;
  }
};

export default categoriesReducer;
