import { render, screen, waitFor } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import { createMockedState } from "tests/fixtures/state";
import { usersData } from "tests/fixtures/database";
import RestService from "utils/services/rest";
import { loadState } from "utils/services/localStorage";
import App from "App";

jest.mock("utils/services/rest", () => ({
  getWithToken: jest.fn(),
}));

const mockedExpiredUserState = createMockedState(-1);
const mockedUser1State = createMockedState(1);

afterEach(() => {
  global.localStorage.clear();
});

describe("authenticate implicitly", () => {
  it("should be able to sign out automatically for expired user", async () => {
    RestService.getWithToken.mockImplementationOnce(async (url, config) =>
      Promise.reject({ message: "Wrong token or any message" })
    );
    render(<App />, {}, { initialState: mockedExpiredUserState });

    // Wait for getting info request
    await waitFor(() =>
      expect(RestService.getWithToken.mock.calls.length).toBe(1)
    );
    // Wait for signed out state
    userEvent.click(screen.getByTestId("avatar"));
    await screen.findByTestId("navigateSignInButton");
    expect(loadState()?.user).toEqual({
      isLoggedIn: false,
      token: null,
      info: null,
    });
  });

  it("should be able to keep user session", async () => {
    RestService.getWithToken.mockImplementationOnce(async (url, config) =>
      Promise.resolve({
        name: usersData.info[1].name,
        id: 1,
      })
    );
    render(
      <App />,
      {},
      {
        initialState: {
          ...mockedUser1State,
          user: {
            isLoggedIn: true,
            token: mockedUser1State.user.token,
            info: null,
          },
        },
      }
    );

    // Wait for getting info request
    await waitFor(() =>
      expect(RestService.getWithToken.mock.calls.length).toBe(1)
    );
    // Wait for signed in state
    userEvent.click(screen.getByTestId("avatar"));
    await screen.findByTestId("signOutButton");
    expect(loadState()?.user).toEqual({
      isLoggedIn: true,
      token: mockedUser1State.user.token,
      info: mockedUser1State.user.info,
    });
  });
});
