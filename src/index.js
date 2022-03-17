import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import configureStore from "stores/configureStore";
import { Provider } from "react-redux";
import { loadState, saveState } from "utils/services/localStorage";

const persistedState = loadState();
const store = configureStore(persistedState);

// Save state to local storage
store.subscribe(() => {
  const state = store.getState();
  saveState({
    user: state.user,
    categories: state.categories,
    items: state.items,
  });
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
