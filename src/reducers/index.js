import { combineReducers } from "redux";
import categoriesReducer from "./categories";
import itemsReducer from "./items";
import userReducer from "./user";

const rootReducer = combineReducers({
  user: userReducer,
  categories: categoriesReducer,
  items: itemsReducer,
});

export default rootReducer;
