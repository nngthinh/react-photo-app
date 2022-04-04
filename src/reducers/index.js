import { combineReducers } from "redux";
import categoriesReducer from "./categories";
import generalReducer from "./general";
import itemsReducer from "./items";
import modalReducer from "./modal";
import userReducer from "./user";

const rootReducer = combineReducers({
  general: generalReducer,
  user: userReducer,
  categories: categoriesReducer,
  items: itemsReducer,
  modal: modalReducer,
});

export default rootReducer;
