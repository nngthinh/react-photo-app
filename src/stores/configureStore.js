import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "reducers";
import clientMiddleware from "stores/middlewares/client";

const configureStore = (preloadedState) => {
  // Middlewares
  const middlewares = [clientMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  // Enhancers
  const enhancers = [middlewareEnhancer];
  const composedEnhancers = compose(...enhancers);
  // Create store
  const store = createStore(rootReducer, preloadedState, composedEnhancers);
  return store;
};

export default configureStore;
