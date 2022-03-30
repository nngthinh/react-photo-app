import App from "App";
import { render, screen, waitFor } from "tests/utils/rtl";
import { createMockedState } from "tests/fixtures/state";
import userEvent from "@testing-library/user-event";
import RestService from "utils/services/rest";
import { loadState } from "utils/services/localStorage";
import { usersData, categoriesData, itemsData } from "tests/fixtures/database";

// Mocked data
const mockedUser1State = createMockedState(1);
const mockedItemDetail = {
  id: 999,
  description: "item description -1",
  imageUrl: "https://google.com",
};

jest.mock("utils/services/rest", () => ({
  get: jest.fn(),
  getWithToken: jest.fn(),
  postWithToken: jest.fn(),
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
    const token = loadState()?.user.token;
    const userId = usersData.token[token];
    return userId
      ? Promise.resolve({ name: usersData.info[userId].name, id: userId })
      : Promise.reject({});
  });

  // - User sign in
  RestService.postWithToken.mockImplementation(async (url, body, configs) => {
    return Promise.resolve({ ...mockedItemDetail });
  });
});

afterEach(() => {
  global.localStorage.clear();
});

describe("add item", () => {
  it("should return no error", async () => {
    render(
      <App />,
      { route: "/categories/1/items/add" },
      { initialState: mockedUser1State }
    );
    expect(RestService.get.mock.calls.length).toBe(0);
    // Type category detail
    userEvent.type(
      await screen.findByTestId("description"),
      mockedItemDetail.description
    );
    userEvent.type(
      await screen.findByTestId("imageUrl"),
      mockedItemDetail.imageUrl
    );
    userEvent.click(screen.getByTestId("addItemButton"));
    expect(RestService.postWithToken.mock.calls.length).toBe(1);
    // Wait for success result
    await waitFor(() => expect(window.location.pathname).toBe("/categories/1"));
    await screen.findByText(/Create item successfully./i);
  });

  it("should return description field error", async () => {
    render(
      <App />,
      { route: "/categories/1/items/add" },
      { initialState: mockedUser1State }
    );
    expect(RestService.get.mock.calls.length).toBe(0);
    // Type other valid inputs
    userEvent.type(
      await screen.findByTestId("imageUrl"),
      mockedItemDetail.imageUrl
    );
    // Missing description
    userEvent.click(screen.getByTestId("addItemButton"));
    await screen.findByText(/Length must be between 1 and 200\./i);
    // Description is exceed the limit
    userEvent.clear(await screen.findByTestId("description"));
    userEvent.type(
      await screen.findByTestId("description"),
      "longerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrlongerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrlongerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrlongerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"
    );
    userEvent.click(screen.getByTestId("addItemButton"));
    await screen.findByText(/Length must be between 1 and 200\./i);
    // Expect there's no post request
    expect(RestService.postWithToken.mock.calls.length).toBe(0);
  });

  it("should return image url field error", async () => {
    render(
      <App />,
      { route: "/categories/1/items/add" },
      { initialState: mockedUser1State }
    );
    expect(RestService.get.mock.calls.length).toBe(0);
    // Type other valid inputs
    userEvent.type(
      await screen.findByTestId("description"),
      mockedItemDetail.description
    );
    // Missing image url
    userEvent.click(screen.getByTestId("addItemButton"));
    await screen.findByText(/Missing data for required field\./i);
    // Image url is exceed the limit
    userEvent.clear(await screen.findByTestId("imageUrl"));
    userEvent.type(
      await screen.findByTestId("imageUrl"),
      "longerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr@mail.com"
    );
    userEvent.click(screen.getByTestId("addItemButton"));
    await screen.findByText(/Longer than maximum length 200\./i);
    // Image url is invalid
    userEvent.clear(await screen.findByTestId("imageUrl"));
    userEvent.type(await screen.findByTestId("imageUrl"), "not an url");
    userEvent.click(screen.getByTestId("addItemButton"));
    await screen.findByText(/Not a valid URL\./i);
    // Expect there's no post request
    expect(RestService.postWithToken.mock.calls.length).toBe(0);
  });
});
