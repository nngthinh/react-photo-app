import { render, screen, waitFor } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import App from "App";
import RestService from "utils/services/rest";
import { usersData, itemsData, categoriesData } from "tests/fixtures/database";

jest.mock("utils/services/rest", () => ({
  getWithToken: jest.fn(),
  get: jest.fn(),
}));

beforeEach(() => {
  // Mock APIs
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
    return Promise.resolve({ name: usersData.info[1].name, id: 1 });
  });
});

afterEach(() => {
  global.localStorage.clear();
});

describe("navigation", () => {
  it("able to go to sign in page for guest", async () => {
    render(<App />);
    // Click to sign in button
    userEvent.click(screen.getByTestId("avatar"));
    userEvent.click(await screen.findByTestId("navigateSignInButton"));
    expect(screen.getByTestId("signInButton")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/signin");
  });

  it("able to go home", async () => {
    // Assertion
    render(<App />, { route: "/categories/1/items/1" });
    // Click to home button
    userEvent.click(screen.getByTestId("home"));
    await waitFor(() => expect(window.location.pathname).toBe("/categories"));
  });
});
