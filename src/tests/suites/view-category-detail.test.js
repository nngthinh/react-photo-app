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

const mockedUser1State = createMockedState(1);
const mockedUser2State = createMockedState(2);

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
  RestService.post.mockImplementation(async (url, body, configs) => {
    return Promise.resolve({ accessToken: usersData.info[1].token });
  });
});

afterEach(() => {
  window.localStorage.clear();
});

// Testing
describe("breadcrumb", () => {
  // Navigation
  it("should be able to navigate between pages", async () => {
    render(<App />, { route: "/categories/1" });
    userEvent.click(await screen.findByTestId("breadcrumb-1"));
    await waitFor(() => expect(window.location.pathname).toBe("/categories"));
  });
  // Features
  it("should display from home to category detail", async () => {
    render(<App />, { route: "/categories/1" });
    expect(await screen.findByTestId("breadcrumb-1")).toHaveTextContent("Home");
    expect(await screen.findByTestId("breadcrumb-2")).toHaveTextContent(
      "category 1"
    );
  });
});

describe("category detail", () => {
  // Navigation
  it("should be able to go to edit category page for guest", async () => {
    render(<App />, { route: "/categories/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    userEvent.click(await screen.findByTestId("navigateEditCategoryButton"));
    await waitFor(() => expect(window.location.pathname).toBe("/signin"));
    // Sign in first
    userEvent.type(screen.getByTestId("email"), usersData.info[1].email);
    userEvent.type(screen.getByTestId("password"), usersData.info[1].password);
    userEvent.click(screen.getByTestId("signInButton"));
    await waitFor(() => expect(RestService.post.mock.calls.length).toBe(1));
    await waitFor(() =>
      expect(window.location.pathname).toBe("/categories/1/edit")
    );
  });
  it("should be able to go to edit category page for user", async () => {
    render(
      <App />,
      { route: "/categories/1" },
      { initialState: mockedUser1State }
    );
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    userEvent.click(await screen.findByTestId("navigateEditCategoryButton"));
    await waitFor(() =>
      expect(window.location.pathname).toBe("/categories/1/edit")
    );
  });
  // Features
  it("should display category detail", async () => {
    render(<App />, { route: "/categories/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    const categoryDetail = categoriesData.items[0];
    expect(await screen.findByTestId("name")).toHaveTextContent(
      categoryDetail.name
    );
    expect(await screen.findByTestId("description")).toHaveTextContent(
      categoryDetail.description
    );
    expect(await screen.findByTestId("image")).toHaveAttribute(
      "src",
      categoryDetail.imageUrl
    );
  });
});

describe("items list", () => {
  // Navigation
  it("not able to go to edit item page for guest", async () => {
    render(<App />, { route: "/categories/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    // Examine only 1 example item
    await screen.findByTestId("itemDetail-1-author");
    expect(
      screen.queryByTestId("itemDetail-1-editItemButton")
    ).not.toBeInTheDocument();
  });

  it("not able to go to edit item page for not author user", async () => {
    render(
      <App />,
      { route: "/categories/1" },
      { initialState: mockedUser2State }
    );
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    // Examine only 1 example item
    await screen.findByTestId("itemDetail-1-author");
    expect(
      screen.queryByTestId("itemDetail-1-editItemButton")
    ).not.toBeInTheDocument();
  });

  it("should be able to go to edit item page for author user", async () => {
    render(
      <App />,
      { route: "/categories/1" },
      { initialState: mockedUser1State }
    );
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    // Examine 2 example item2
    expect(screen.queryByTestId("itemDetail-1-author")).not.toBeInTheDocument();
    await screen.findByTestId("itemDetail-1-editItemButton");
  });

  it("should be able to go to item detail page", async () => {
    render(<App />, { route: "/categories/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    userEvent.click(await screen.findByTestId("itemDetail-1"));
    await waitFor(() =>
      expect(window.location.pathname).toBe("/categories/1/items/1")
    );
  });

  // Features
  it("should display items list", async () => {
    const itemsList = itemsData.items;
    render(<App />, { route: "/categories/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    expect(
      await screen.findByTestId("itemDetail-1-description")
    ).toHaveTextContent("item description 1");
    expect(await screen.findByTestId("itemDetail-1-image")).toHaveAttribute(
      "src",
      itemsList[0].imageUrl
    );
    expect(
      await screen.findByTestId("itemDetail-8-description")
    ).toHaveTextContent("item description 8");
    expect(await screen.findByTestId("itemDetail-8-image")).toHaveAttribute(
      "src",
      itemsList[7].imageUrl
    );
  });

  it("should be able to use pagination for items list", async () => {
    const itemsList = itemsData.items;
    render(<App />, { route: "/categories/1" });
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(2));
    await screen.findByTestId("pag-1");
    await screen.findByTestId("pag-2");
    // Navigate by page number
    userEvent.click(screen.getByTestId("pag-2"));
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(3));
    await screen.findByTestId("itemDetail-9");
    expect(
      await screen.findByTestId("itemDetail-9-description")
    ).toHaveTextContent(/item description 9/i);
    expect(await screen.findByTestId("itemDetail-9-image")).toHaveAttribute(
      "src",
      itemsList[8].imageUrl
    );
    // Navigate relatively
    userEvent.click(screen.getByTestId("pag-prev"));
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(4));
    await screen.findByTestId("itemDetail-1");
    expect(
      await screen.findByTestId("itemDetail-1-description")
    ).toHaveTextContent(/item description 1/i);
    expect(await screen.findByTestId("itemDetail-1-image")).toHaveAttribute(
      "src",
      itemsList[0].imageUrl
    );
    userEvent.click(screen.getByTestId("pag-next"));
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(5));
    await screen.findByTestId("itemDetail-9");
    expect(
      await screen.findByTestId("itemDetail-9-description")
    ).toHaveTextContent(/item description 9/i);
    expect(await screen.findByTestId("itemDetail-9-image")).toHaveAttribute(
      "src",
      itemsList[8].imageUrl
    );
  });
});
