import App from "App";
import { render, screen, waitFor } from "tests/utils/rtl";
import { createMockedState } from "tests/fixtures/state";
import userEvent from "@testing-library/user-event";
import RestService from "utils/services/rest";
import { usersData } from "tests/fixtures/database";
import { loadState } from "utils/services/localStorage";

jest.mock("utils/services/rest", () => ({
  get: jest.fn(),
  getWithToken: jest.fn(),
}));

// Mocked data
const userId = 1;
const userState = createMockedState(userId);

beforeEach(() => {
  RestService.get.mockImplementation(async (url, configs) => {});
  RestService.getWithToken.mockImplementation(async (url, configs) => {
    const token = loadState()?.user.token;
    if (usersData.token[token] === "undefined") {
      return Promise.reject({
        response: {
          data: {
            message: "Missing access token",
          },
        },
      });
    }
    return Promise.resolve({
      data: {
        name: usersData.info[userId].name,
        id: userId,
      },
    });
  });
});

describe("navbar", () => {
  describe("navigation", () => {
    it("able to go to sign in for guest", async () => {
      render(<App />);
      // Click to sign in button
      userEvent.click(screen.getByTestId("avatar"));
      userEvent.click(await screen.findByTestId("navigateSignInButton"));
      expect(screen.getByTestId("signInButton")).toBeInTheDocument();
      expect(window.location.pathname).toBe("/signin");
    });
    it("able to go home", async () => {
      render(<App />);
      // Click to home button
      userEvent.click(screen.getByTestId("home"));
      // await waitFor(() =>
      //   expect(screen.queryByTestId("home")).not.toBeInTheDocument()
      // );
      await waitFor(() => expect(window.location.pathname).toBe("/categories"));
    });
  });
  describe("sign out", () => {
    it.only("able to sign out for logged in user", async () => {
      render(<App />, {}, { initialState: userState });
      // Cancel signing out
      userEvent.click(screen.getByTestId("avatar"));
      userEvent.click(await screen.findByTestId("signOutButton"));
      userEvent.click(await screen.findByText(/cancel/i));
      // Confirm signing out
      userEvent.click(screen.getByTestId("avatar"));
      userEvent.click(await screen.findByTestId("signOutButton"));
      userEvent.click(await screen.findByText(/yes/i));
      // Assertion
      await screen.findByText(/sign out successfully\./i);
      expect(loadState()?.user).toEqual({
        isLoggedIn: false,
        token: null,
        info: null,
      });
    });
  });
});

describe("categories list", () => {
  it("should diplay categories", () => {});
  it("able to use pagination", () => {});
  it("should navigate to category detail", () => {});
});
