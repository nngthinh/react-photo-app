import App from "App";
import { render, screen, waitFor } from "tests/utils/rtl";
import { createMockedState } from "tests/fixtures/state";
import userEvent from "@testing-library/user-event";
import RestService from "utils/services/rest";
import { usersData, categoriesData, itemsData } from "tests/fixtures/database";
import { loadState } from "utils/services/localStorage";

jest.mock("utils/services/rest", () => ({
  get: jest.fn(),
  post: jest.fn(),
  getWithToken: jest.fn(),
}));

// Mocked data
const mockedUser1State = createMockedState(1);
const mockedExpiredUserState = createMockedState(-1);

beforeEach(() => {
  // Mock rest api
  // - Category & item APIs
  RestService.get.mockImplementation(async (url, configs) => {
    const urlObj = new URL(url);
    const paramsList = urlObj.pathname.split("/");
    // Item detail
    if (urlObj.pathname.match(/\/categories\/[\d]*\/items\/[\d]*/)) {
      const [, , categoryId, , itemId] = paramsList;
      // Get items list of specific category
      const itemDetail = itemsData.items
        .filter(
          (item) =>
            item.categoryId === parseInt(categoryId) &&
            item.id === parseInt(itemId)
        )
        .map((item) => ({
          ...item,
          author: {
            id: item.authorId,
            name: usersData.info[item.authorId].name,
          },
        }))[0];
      return Promise.resolve({ ...itemDetail });
    }
    // Items list
    else if (urlObj.pathname.match(/\/categories\/[\d]*\/items/)) {
      const [offset, limit] = urlObj.searchParams.values();
      const [, , categoryId] = paramsList;

      // Get items list of specific category
      const itemsList = itemsData.items
        .filter((item) => item.categoryId === parseInt(categoryId))
        .map((item) => ({
          ...item,
          author: {
            id: item.authorId,
            name: usersData.info[item.authorId].name,
          },
        }));
      return Promise.resolve({
        items: itemsList.slice(offset, offset + limit),
        totalItems: itemsList.length,
      });
    }
    // Categories detail
    else if (urlObj.pathname.match(/\/categories\/[\d]*/)) {
      const [, , categoryId] = paramsList;

      const categoryDetail = categoriesData.items.filter(
        (category) => category.id === parseInt(categoryId)
      )[0];
      return Promise.resolve({ ...categoryDetail });
    }
    // Category list
    else {
      const [offset, limit] = urlObj.searchParams.values();
      const categoriesList = categoriesData.items;
      return Promise.resolve({
        items: categoriesList.slice(offset, offset + limit),
        totalItems: categoriesList.length,
      });
    }
  });
  // - Get user information API
  RestService.getWithToken.mockImplementation(async (url, configs) => {
    const token = loadState()?.user.token;
    if (token !== mockedUser1State.user.token) {
      return Promise.reject({ message: "Any message. Client won't care that" });
    }
    return Promise.resolve({
      name: usersData.info[1].name,
      id: 1,
    });
  });

  // - User sign in
  RestService.post.mockImplementation(async (url, body, configs) => {
    return Promise.resolve({ accessToken: usersData.info[1].token });
  });
});

afterEach(() => {
  global.localStorage.clear();
});

// Testing
describe("navigation", () => {
  describe("navbar", () => {
    it("able to go to sign in page for guest", async () => {
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

  describe("categories list", () => {
    it("able to go to create category page for guest", async () => {
      render(<App />);
      userEvent.click(screen.getByTestId("navigateCreateCategoryButton"));
      await waitFor(() => expect(window.location.pathname).toBe("/signin"));
      // Sign in first
      userEvent.type(screen.getByTestId("email"), usersData.info[1].email);
      userEvent.type(
        screen.getByTestId("password"),
        usersData.info[1].password
      );
      userEvent.click(screen.getByTestId("signInButton"));
      await waitFor(() => expect(RestService.post.mock.calls.length).toBe(1));
      await waitFor(() =>
        expect(window.location.pathname).toBe("/categories/add")
      );
    });

    it("able to go to create category page for user", async () => {
      render(<App />, {}, { initialState: mockedUser1State });
      userEvent.click(screen.getByTestId("navigateCreateCategoryButton"));
      await waitFor(() =>
        expect(window.location.pathname).toBe("/categories/add")
      );
    });

    it("able to go to category detail page", async () => {
      render(<App />);
      await waitFor(() => expect(RestService.get.mock.calls.length).toBe(1));
      userEvent.click(await screen.findByTestId("categoryDetail-1"));
      await waitFor(() =>
        expect(window.location.pathname).toBe("/categories/1")
      );
      await waitFor(() => expect(RestService.get.mock.calls.length).toBe(3)); // Get category detail + items list
    });
  });
});

describe("features", () => {
  describe("navbar", () => {
    describe("sign out", () => {
      it("able to sign out for logged in user", async () => {
        render(<App />, {}, { initialState: mockedUser1State });

        await waitFor(() =>
          expect(RestService.getWithToken.mock.calls.length).toBe(1)
        );

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

      it("able to sign out automatically for expired user", async () => {
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
    });
  });

  describe("categories list", () => {
    it("should display categories list", async () => {
      render(<App />);
      // Wait for categories list request
      await waitFor(() => expect(RestService.get.mock.calls.length).toBe(1));
      await screen.findByTestId("categoryDetail-1");
      await screen.findByText(/category 1/i);
      await screen.findByText(/description 1/i);
      await screen.findByTestId("categoryDetail-4");
      await screen.findByText(/category 4/i);
      await screen.findByText(/description 4/i);
    });

    it("able to use pagination for category list", async () => {
      render(<App />);
      // Wait for categories list request
      await waitFor(() => expect(RestService.get.mock.calls.length).toBe(1));
      await screen.findByTestId("pag-1");
      await screen.findByTestId("pag-2");
      await screen.findByTestId("pag-3");
      // Navigate by page number
      userEvent.click(screen.getByTestId("pag-2"));
      await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
      await screen.findByTestId("categoryDetail-5");
      await screen.findByText(/category 5/i);
      await screen.findByText(/description 5/i);
      await screen.findByTestId("categoryDetail-8");
      await screen.findByText(/category 8/i);
      await screen.findByText(/description 8/i);
      // Navigate relatively
      userEvent.click(screen.getByTestId("pag-prev"));
      await waitFor(() => expect(RestService.get.mock.calls.length).toBe(3));
      await screen.findByTestId("categoryDetail-1");
      await screen.findByText(/category 1/i);
      await screen.findByText(/description 1/i);
      await screen.findByTestId("categoryDetail-4");
      await screen.findByText(/category 4/i);
      await screen.findByText(/description 4/i);
      userEvent.click(screen.getByTestId("pag-next"));
      await waitFor(() => expect(RestService.get.mock.calls.length).toBe(4));
      await screen.findByTestId("categoryDetail-5");
      await screen.findByText(/category 5/i);
      await screen.findByText(/description 5/i);
      await screen.findByTestId("categoryDetail-8");
      await screen.findByText(/category 8/i);
      await screen.findByText(/description 8/i);
    });
  });
});
