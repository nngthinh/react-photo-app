import { ItemsAction } from "constants/actions";
import { limitItemsPagination } from "constants/limit";

const initialState = {
  pagination: {},
  list: null,
  detail: {},
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ItemsAction.VIEW_ITEMS_SUCCESS: {
      const itemInfo = action.data;
      return {
        ...state,
        pagination: {
          total: Math.ceil(itemInfo.totalItems / limitItemsPagination),
        },
        list: itemInfo.items,
      };
    }
    case ItemsAction.VIEW_ITEMS_FAILED:
      return { ...state };
    case ItemsAction.CREATE_ITEM_SUCCESS:
      return { ...state };
    case ItemsAction.CREATE_ITEM_FAILED:
      return { ...state };
    case ItemsAction.VIEW_ITEM_SUCCESS: {
      const itemInfo = action.data;
      return { ...state, detail: itemInfo };
    }
    case ItemsAction.VIEW_ITEM_FAILED:
      return { ...state };
    case ItemsAction.UPDATE_ITEM_SUCCESS:
      return { ...state };
    case ItemsAction.UPDATE_ITEM_FAILED:
      return { ...state };
    case ItemsAction.DELETE_ITEM_SUCCESS:
      return { ...state };
    case ItemsAction.DELETE_ITEM_FAILED:
      return { ...state };
    case ItemsAction.CLEAR_ITEM_INFO:
      return { ...initialState };
    default:
      return state;
  }
};

export default itemsReducer;
