import { loadState, saveState } from "utils/services/localStorage";
import configureStore from "stores/configureStore";

const createStoreSynchedWithLocalStorage = (initialState) => {
  // Create store with initial value
  const store = initialState
    ? configureStore(initialState)
    : configureStore(loadState());
  // Save new local state if don't use the old one
  if (initialState) {
    saveState(initialState);
  }
  // Save state change to the local storage
  store.subscribe(() => {
    const state = store.getState();
    saveState({
      user: state.user,
      categories: state.categories,
      items: state.items,
    });
  });

  return store;
};

export default createStoreSynchedWithLocalStorage;
