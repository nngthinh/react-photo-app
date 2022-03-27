import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import createStoreSynchedWithLocalStorage from "stores";

const customRender = (
  ui,
  { route = "/" } = {},
  {
    initalState,
    store = createStoreSynchedWithLocalStorage(initalState),
    ...renderOptions
  } = {}
) => {
  const AllWrappers = ({ children }) => {
    window.history.pushState({}, "test", route);
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  };
  return render(ui, { wrapper: AllWrappers, ...renderOptions });
};

export * from "@testing-library/react";
export { customRender as render };
