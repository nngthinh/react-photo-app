import { KCategoriesAction } from "constants/actions";
import { limitCategories } from "constants/pagination";

const initialState = {
  pagination: {},
  list: {},
  detail: {},
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case KCategoriesAction.VIEW_CATEGORIES_SUCCESS: {
      const categoriesInfo = action.data;
      return {
        ...state,
        pagination: {
          total: Math.ceil(categoriesInfo.totalItems / limitCategories),
        },
        list: categoriesInfo.items, // shouldn't be cached
      };
    }
    case KCategoriesAction.VIEW_CATEGORIES_FAILED:
      return { ...state };
    case KCategoriesAction.CREATE_CATEGORY_SUCCESS:
      return { ...state };
    case KCategoriesAction.CREATE_CATEGORY_FAILED:
      return { ...state };
    case KCategoriesAction.VIEW_CATEGORY_SUCCESS: {
      const categoryInfo = action.data;
      return { ...state, detail: categoryInfo };
    }
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
