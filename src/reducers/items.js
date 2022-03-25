import { KItemsAction } from "constants/actions";
import { limitItemsPagination } from "constants/limit";

const initialState = {
  pagination: {},
  list: null,
  detail: {},
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case KItemsAction.VIEW_ITEMS_SUCCESS: {
      const itemInfo = action.data;
      return {
        ...state,
        pagination: {
          total: Math.ceil(itemInfo.totalItems / limitItemsPagination),
        },
        list: itemInfo.items,
      };
    }
    case KItemsAction.VIEW_ITEMS_FAILED:
      return { ...state };
    case KItemsAction.CREATE_ITEM_SUCCESS:
      return { ...state };
    case KItemsAction.CREATE_ITEM_FAILED:
      return { ...state };
    case KItemsAction.VIEW_ITEM_SUCCESS: {
      const itemInfo = action.data;
      return { ...state, detail: itemInfo };
    }
    case KItemsAction.VIEW_ITEM_FAILED:
      return { ...state };
    case KItemsAction.UPDATE_ITEM_SUCCESS:
      return { ...state };
    case KItemsAction.UPDATE_ITEM_FAILED:
      return { ...state };
    case KItemsAction.DELETE_ITEM_SUCCESS:
      return { ...state };
    case KItemsAction.DELETE_ITEM_FAILED:
      return { ...state };
    default:
      return state;
  }
};

export default itemsReducer;
