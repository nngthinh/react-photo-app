import App from "App";
import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "tests/utils/rtl";
import usersFixture from "tests/fixtures/users";
import userEvent from "@testing-library/user-event";

const mockedUser = usersFixture.info[1];
const mockedLoggedInStore = {
  user: {
    isLoggedIn: true,
    token: mockedUser.token,
    info: {
      name: mockedUser.name,
      id: mockedUser.id,
    },
  },
  categories: {},
  items: {},
};

describe("navbar", () => {
  describe("navigation", () => {
    it("able to go to sign in for guest", async () => {
      render(<App />);
      // Click to sign in button
      userEvent.click(screen.getByTestId("avatar"));
      userEvent.click(await screen.findByTestId("navigateSignInButton"));
      expect(screen.getByTestId("signInButton")).toBeInTheDocument();
      expect(window.location.pathname).toBe("1");
    });
  });
  describe("sign out", () => {
    it("able to sign out for logged user", () => {
      render(<App />);
    });
  });
});

describe("categories list", () => {
  it("should diplay categories", () => {});
  it("able to use pagination", () => {});
  it("should navigate to category detail", () => {});
});
