import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "reducers";
import clientMiddleware from "stores/middlewares/client";

const configureStore = (preloadedState) => {
  // Middlewares
  const middlewares = [clientMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  // Enhancers
  const enhancers = [middlewareEnhancer];
  const composer =
    process.env.NODE_ENV === "development" ? composeWithDevTools : compose;
  const composedEnhancers = composer(...enhancers);
  // Create store
  const store = createStore(rootReducer, preloadedState, composedEnhancers);
  return store;
};

export default configureStore;
