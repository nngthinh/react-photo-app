import App from "App";
import { render, screen, waitFor } from "tests/utils/rtl";
import { createMockedState } from "tests/fixtures/state";
import userEvent from "@testing-library/user-event";
import RestService from "utils/services/rest";
import { usersData, categoriesData, itemsData } from "tests/fixtures/database";

jest.mock("utils/services/rest", () => ({
  get: jest.fn(),
  post: jest.fn(),
  getWithToken: jest.fn(),
}));

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
    return Promise.resolve({ name: usersData.info[1].name, id: 1 });
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
describe("breadcrumb", () => {
  // Navigation
  it("able to navigate between pages", async () => {
    render(<App />, { route: "/categories/1" });
    userEvent.click(await screen.findByTestId("breadcrumb-1"));
    await waitFor(() => expect(window.location.pathname).toBe("/categories"));
  });
  // Features
  it("should display from home to category detail", async () => {
    render(<App />, { route: "/categories/1" });
    expect((await screen.findByTestId("breadcrumb-1")).textContent).toBe(
      "Home"
    );
    expect((await screen.findByTestId("breadcrumb-2")).textContent).toBe(
      "category 1"
    );
  });
});

describe.only("category detail", () => {
  // Navigation
  it("able to go to edit category page for guest", async () => {
    render(<App />, { route: "/categories/1" });
    await(() => expect(RestService.get.mock.calls.length).toBe(2));
    // userEvent.click(await screen.findByTestId("navigateEditCategoryButton"));
    // // await waitFor(() => expect(window.location.pathname).toBe("/signin"));
    // // Sign in first
    // userEvent.type(screen.getByTestId("email"), usersData.info[1].email);
    // userEvent.type(screen.getByTestId("password"), usersData.info[1].password);
    // userEvent.click(screen.getByTestId("signInButton"));
    // await waitFor(() => expect(RestService.post.mock.calls.length).toBe(1));
    // await waitFor(() =>
    //   expect(window.location.pathname).toBe("/categories/1/edit")
    // );
  });
  it("able to go to edit category page for user", () => {});
  // Features
  it("should display category detail", () => {});
});

describe("items list", () => {
  // Navigation
  it("not able to go to edit item page for guest", () => {});
  it("not able to go to edit item page for not author user", () => {});
  it("able to go to edit item page for author user", () => {});
  it("able to go to item detail page", () => {});
  // Features
  it("should display items list", () => {});
  it("able to use pagination for items list", () => {});
});
