import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "tests/utils/rtl";
import { createMockedState } from "tests/fixtures/state";
import { usersData, categoriesData, itemsData } from "tests/fixtures/database";
import RestService from "utils/services/rest";
import { loadState } from "utils/services/localStorage";
import App from "App";

// Mocked data
const mockedUser1State = createMockedState(1);
const mockedUser2State = createMockedState(2);
const mockedItemDetail = {
  id: 999,
  description: "item description -1",
  imageUrl: "https://picsum.photos/200",
};

jest.mock("utils/services/rest", () => ({
  get: jest.fn(),
  post: jest.fn(),
  getWithToken: jest.fn(),
  putWithToken: jest.fn(),
}));

describe("edit item", () => {
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

    // - Item action
    RestService.putWithToken.mockImplementation(async (url, body, configs) => {
      return Promise.resolve({ ...mockedItemDetail });
    });
  });

  it("navigate to sign in page for guest", async () => {
    render(<App />, { route: "/categories/1/items/1/edit" });
    expect(RestService.get.mock.calls.length).toBe(0);
    await waitFor(() => {
      expect(window.location.pathname).toBe("/signin");
    });
    userEvent.type(await screen.findByTestId("email"), usersData.info[1].email);
    userEvent.type(
      await screen.findByTestId("password"),
      usersData.info[1].password
    );
    userEvent.click(screen.getByTestId("signInButton"));
    expect(RestService.post.mock.calls.length).toBe(1);
    await waitFor(() => {
      expect(window.location.pathname).toBe("/categories/1/items/1/edit");
    });
  });

  it("discard edit action for not author user", async () => {
    render(
      <App />,
      { route: "/categories/1/items/1/edit" },
      { initialState: mockedUser2State }
    );
    // Get item data first, then check if the author id of that item is the same of the current user
    expect(RestService.get.mock.calls.length).toBe(1);
    await waitFor(() => {
      expect(window.location.pathname).toBe("/categories/1/items/1");
    });
    await screen.findByText(
      /you are not allowed to perform that operation. Please try using another account./i
    );
  });

  it("should return no error", async () => {
    render(
      <App />,
      { route: "/categories/1/items/1/edit" },
      { initialState: mockedUser1State }
    );
    expect(RestService.get.mock.calls.length).toBe(1);
    // Type category detail
    userEvent.type(
      await screen.findByTestId("description"),
      mockedItemDetail.description
    );
    userEvent.clear(await screen.findByTestId("imageUrl"));
    userEvent.type(
      await screen.findByTestId("imageUrl"),
      mockedItemDetail.imageUrl
    );
    expect(await screen.findByTestId("itemImageUrl")).toHaveAttribute(
      "src",
      mockedItemDetail.imageUrl
    );
    userEvent.click(screen.getByTestId("editItemButton"));
    expect(RestService.putWithToken.mock.calls.length).toBe(1);
    // Wait for success result
    await waitFor(() =>
      expect(window.location.pathname).toBe("/categories/1/items/1")
    );
    await screen.findByText(/Update item successfully./i);
  });

  it("should return description field error", async () => {
    render(
      <App />,
      { route: "/categories/1/items/1/edit" },
      { initialState: mockedUser1State }
    );
    expect(RestService.get.mock.calls.length).toBe(1);
    // Clear inputs
    userEvent.clear(await screen.findByTestId("description"));
    // Missing description
    userEvent.click(screen.getByTestId("editItemButton"));
    await screen.findByText(/Length must be between 1 and 200\./i);
    // Description is exceed the limit
    userEvent.clear(await screen.findByTestId("description"));
    userEvent.type(
      await screen.findByTestId("description"),
      "longerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrlongerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrlongerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrlongerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"
    );
    userEvent.click(screen.getByTestId("editItemButton"));
    await screen.findByText(/Length must be between 1 and 200\./i);
    // Expect there's no post request
    expect(RestService.putWithToken.mock.calls.length).toBe(0);
  });

  it("should return image url field error", async () => {
    render(
      <App />,
      { route: "/categories/1/items/1/edit" },
      { initialState: mockedUser1State }
    );
    expect(RestService.get.mock.calls.length).toBe(1);
    // Clear inputs
    userEvent.clear(await screen.findByTestId("imageUrl"));
    // Missing image url
    userEvent.click(screen.getByTestId("editItemButton"));
    await screen.findByText(/Missing data for required field\./i);
    // Image url is exceed the limit
    userEvent.clear(await screen.findByTestId("imageUrl"));
    userEvent.type(
      await screen.findByTestId("imageUrl"),
      "longerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr@mail.com"
    );
    userEvent.click(screen.getByTestId("editItemButton"));
    await screen.findByText(/Longer than maximum length 200\./i);
    // Image url is invalid
    userEvent.clear(await screen.findByTestId("imageUrl"));
    userEvent.type(await screen.findByTestId("imageUrl"), "not an url");
    userEvent.click(screen.getByTestId("editItemButton"));
    await screen.findByText(/Not a valid URL\./i);
    // Expect there's no post request
    expect(RestService.putWithToken.mock.calls.length).toBe(0);
  });
});
