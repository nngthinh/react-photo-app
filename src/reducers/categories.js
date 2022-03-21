import { KCategoriesAction } from "constants/actions";
import { limitCategories } from "constants/pagination";

const initialState = {
  pagination: {
    limit: limitCategories,
  },
  data: {},
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case KCategoriesAction.VIEW_CATEGORIES_SUCCESS: {
      const categoriesInfo = action.data;
      return {
        pagination: {
          limit: state.pagination.limit,
          total: Math.ceil(categoriesInfo.totalItems / state.pagination.limit),
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
