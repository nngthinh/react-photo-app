import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import createStoreSynchedWithLocalStorage from "stores";

const customRender = (
  ui,
  {
    initalState,
    store = createStoreSynchedWithLocalStorage(initalState),
    ...renderOptions
  } = {}
) => {
  const AllProviders = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return render(ui, { wrapper: AllProviders, ...renderOptions });
};

export { customRender as render };
