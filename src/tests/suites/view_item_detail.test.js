import App from "App";
import { render, screen, waitFor } from "tests/utils/rtl";
import { createMockedState } from "tests/fixtures/state";
import userEvent from "@testing-library/user-event";
import RestService from "utils/services/rest";
import { loadState } from "utils/services/localStorage";
import { usersData, categoriesData, itemsData } from "tests/fixtures/database";

const mockedUser1State = createMockedState(1);
const mockedUser2State = createMockedState(2);

jest.mock("utils/services/rest", () => ({
  get: jest.fn(),
  post: jest.fn(),
  getWithToken: jest.fn(),
  deleteWithToken: jest.fn(),
}));

// Testing
describe("breadcrumb", () => {
  beforeEach(() => {
    // Clear env
    window.localStorage.clear();
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
      const userId = usersData.token[token];
      return userId
        ? Promise.resolve({ name: usersData.info[userId].name, id: userId })
        : Promise.reject({});
    });
  });

  // Navigation
  it("should be able to navigate to home", async () => {
    render(<App />, { route: "/categories/1/items/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    userEvent.click(await screen.findByTestId("breadcrumb-1"));
    await waitFor(() => expect(window.location.pathname).toBe("/categories"));
  });

  it("should be able to navigate to category detail", async () => {
    render(<App />, { route: "/categories/1/items/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    userEvent.click(await screen.findByTestId("breadcrumb-2"));
    await waitFor(() => expect(window.location.pathname).toBe("/categories/1"));
  });

  // Features
  it("should display from home to item detail", async () => {
    render(<App />, { route: "/categories/1/items/1" });
    // Item detail + category detail
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    expect(await screen.findByTestId("breadcrumb-1")).toHaveTextContent("Home");
    expect(await screen.findByTestId("breadcrumb-2")).toHaveTextContent(
      categoriesData.items[0].name
    );
    expect(await screen.findByTestId("breadcrumb-3")).toHaveTextContent(
      "Item 1"
    );
  });
});

describe("item detail", () => {
  beforeEach(() => {
    // Clear env
    window.localStorage.clear();
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
      const userId = usersData.token[token];
      return userId
        ? Promise.resolve({ name: usersData.info[userId].name, id: userId })
        : Promise.reject({});
    });

    // - User sign in
    RestService.post.mockImplementation(async (url, body, configs) => {
      return Promise.resolve({ accessToken: usersData.info[1].token });
    });
  });

  // Navigation
  it("not able to go to edit item page for guest", async () => {
    render(<App />, { route: "/categories/1/items/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    expect(screen.queryByTestId("navigateEditButton")).not.toBeInTheDocument();
    await screen.findByTestId("author");
  });

  it("not able to go to edit item page for not author user", async () => {
    render(
      <App />,
      { route: "/categories/1/items/1" },
      { initialState: mockedUser2State }
    );
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));

    expect(
      screen.queryByTestId("navigateEditItemButton")
    ).not.toBeInTheDocument();
    await screen.findByTestId("author");
  });

  it("should be able to go to edit item page for author user", async () => {
    render(
      <App />,
      { route: "/categories/1/items/1" },
      { initialState: mockedUser1State }
    );
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    await screen.findByTestId("navigateEditItemButton");
    expect(screen.queryByTestId("author")).not.toBeInTheDocument();
    // Go to edit page
    userEvent.click(await screen.findByTestId("navigateEditItemButton"));
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(3));
    await waitFor(() =>
      expect(window.location.pathname).toBe("/categories/1/items/1/edit")
    );
  });

  // Features
  it("should display item detail", async () => {
    render(<App />, { route: "/categories/1/items/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    expect(screen.queryByTestId("description")).toHaveTextContent(
      itemsData.items[0].description
    );
    expect(screen.queryByTestId("image")).toHaveAttribute(
      "src",
      itemsData.items[0].imageUrl
    );
  });

  it("not able to delete item for guest", async () => {
    render(<App />, { route: "/categories/1/items/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    expect(screen.queryByTestId("deleteItemButton")).not.toBeInTheDocument();
  });

  it("not able to delete item for not author user", async () => {
    render(
      <App />,
      { route: "/categories/1/items/1" },
      { initialState: mockedUser2State }
    );
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    expect(screen.queryByTestId("deleteItemButton")).not.toBeInTheDocument();
  });

  it("should be able to delete item for author user", async () => {
    render(
      <App />,
      { route: "/categories/1/items/1" },
      { initialState: mockedUser1State }
    );
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    await screen.findByTestId("deleteItemButton");
    // Delete item
    userEvent.click(await screen.findByTestId("deleteItemButton"));
    await screen.findByTestId("modal");
    expect(await screen.findByTestId("modal-header")).toHaveTextContent(
      /delete item/i
    );
    expect(await screen.findByTestId("modal-button1")).toHaveTextContent(
      /cancel/i
    );
    expect(await screen.findByTestId("modal-button2")).toHaveTextContent(
      /delete/i
    );
    // Cancel the action
    userEvent.click(await screen.findByTestId("modal-button1"));
    await waitFor(() =>
      expect(RestService.deleteWithToken.mock.calls.length).toBe(0)
    );
    // Confirm the action
    userEvent.click(await screen.findByTestId("deleteItemButton"));
    userEvent.click(await screen.findByTestId("modal-button2"));
    await waitFor(() =>
      expect(RestService.deleteWithToken.mock.calls.length).toBe(1)
    );
    await waitFor(() => expect(window.location.pathname).toBe("/categories/1"));
  });
});
