import { combineReducers } from "redux";
import categoriesReducer from "./categories";
import itemsReducer from "./items";
import modalReducer from "./modal";
import userReducer from "./user";

const rootReducer = combineReducers({
  user: userReducer,
  categories: categoriesReducer,
  items: itemsReducer,
  modal: modalReducer,
});

export default rootReducer;
