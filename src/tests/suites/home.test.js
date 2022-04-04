import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "tests/utils/rtl";
import { createMockedState } from "tests/fixtures/state";
import RestService from "utils/services/rest";
import { usersData, categoriesData, itemsData } from "tests/fixtures/database";
import App from "App";

jest.mock("utils/services/rest", () => ({
  get: jest.fn(),
  post: jest.fn(),
  getWithToken: jest.fn(),
}));

// Mocked data
const mockedUser1State = createMockedState(1);

// Testing
describe("categories list", () => {
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
      return Promise.resolve({ name: usersData.info[1].name, id: 1 });
    });

    // - User sign in
    RestService.post.mockImplementation(async (url, body, configs) => {
      return Promise.resolve({ accessToken: usersData.info[1].token });
    });
  });

  // Navigation
  it("should be able to go to create category page for guest", async () => {
    render(<App />);
    userEvent.click(screen.getByTestId("navigateCreateCategoryButton"));
    await waitFor(() => expect(window.location.pathname).toBe("/signin"));
    // Sign in first
    userEvent.type(screen.getByTestId("email"), usersData.info[1].email);
    userEvent.type(screen.getByTestId("password"), usersData.info[1].password);
    userEvent.click(screen.getByTestId("signInButton"));
    await waitFor(() => expect(RestService.post.mock.calls.length).toBe(1));
    await waitFor(() =>
      expect(window.location.pathname).toBe("/categories/add")
    );
  });

  it("should be able to go to create category page for user", async () => {
    render(<App />, {}, { initialState: mockedUser1State });
    userEvent.click(screen.getByTestId("navigateCreateCategoryButton"));
    await waitFor(() =>
      expect(window.location.pathname).toBe("/categories/add")
    );
  });

  it("should be able to go to category detail page", async () => {
    render(<App />);
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(1));
    userEvent.click(await screen.findByTestId("categoryDetail-1"));
    await waitFor(() => expect(window.location.pathname).toBe("/categories/1"));
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(3)); // Get category detail + items list
  });

  // Features
  it("should display categories list", async () => {
    const categoriesList = categoriesData.items;
    render(<App />);
    // Wait for categories list request
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(1));
    await screen.findByTestId("categoryDetail-1");
    expect(
      (await screen.findByTestId("categoryDetail-1-name")).textContent
    ).toMatch(/category 1/i);
    expect(
      (await screen.findByTestId("categoryDetail-1-description")).textContent
    ).toMatch(/description 1/i);
    expect(await screen.findByTestId("categoryDetail-1-image")).toHaveAttribute(
      "src",
      categoriesList[0].imageUrl
    );
    await screen.findByTestId("categoryDetail-4");
    expect(
      (await screen.findByTestId("categoryDetail-4-name")).textContent
    ).toMatch(/category 4/i);
    expect(
      (await screen.findByTestId("categoryDetail-4-description")).textContent
    ).toMatch(/description 4/i);
    expect(await screen.findByTestId("categoryDetail-4-image")).toHaveAttribute(
      "src",
      categoriesList[3].imageUrl
    );
  });

  it("should be able to use pagination for category list", async () => {
    const categoriesList = categoriesData.items;
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
    expect(
      (await screen.findByTestId("categoryDetail-5-name")).textContent
    ).toMatch(/category 5/i);
    expect(
      (await screen.findByTestId("categoryDetail-5-description")).textContent
    ).toMatch(/description 5/i);

    expect(await screen.findByTestId("categoryDetail-5-image")).toHaveAttribute(
      "src",
      categoriesList[4].imageUrl
    );
    await screen.findByTestId("categoryDetail-8");
    expect(
      (await screen.findByTestId("categoryDetail-8-name")).textContent
    ).toMatch(/category 8/i);
    expect(
      (await screen.findByTestId("categoryDetail-8-description")).textContent
    ).toMatch(/description 8/i);
    expect(await screen.findByTestId("categoryDetail-8-image")).toHaveAttribute(
      "src",
      categoriesList[7].imageUrl
    );
    // Navigate relatively
    userEvent.click(screen.getByTestId("pag-prev"));
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(3));
    await screen.findByTestId("categoryDetail-1");
    expect(
      (await screen.findByTestId("categoryDetail-1-name")).textContent
    ).toMatch(/category 1/i);
    expect(
      (await screen.findByTestId("categoryDetail-1-description")).textContent
    ).toMatch(/description 1/i);
    expect(await screen.findByTestId("categoryDetail-1-image")).toHaveAttribute(
      "src",
      categoriesList[0].imageUrl
    );
    await screen.findByTestId("categoryDetail-4");
    expect(
      (await screen.findByTestId("categoryDetail-4-name")).textContent
    ).toMatch(/category 4/i);
    expect(
      (await screen.findByTestId("categoryDetail-4-description")).textContent
    ).toMatch(/description 4/i);
    expect(await screen.findByTestId("categoryDetail-4-image")).toHaveAttribute(
      "src",
      categoriesList[3].imageUrl
    );
    userEvent.click(screen.getByTestId("pag-next"));
    await waitFor(() => expect(RestService.get.mock.calls.length).toBe(4));
    await screen.findByTestId("categoryDetail-5");
    expect(
      (await screen.findByTestId("categoryDetail-5-name")).textContent
    ).toMatch(/category 5/i);
    expect(
      (await screen.findByTestId("categoryDetail-5-description")).textContent
    ).toMatch(/description 5/i);

    expect(await screen.findByTestId("categoryDetail-5-image")).toHaveAttribute(
      "src",
      categoriesList[4].imageUrl
    );
    await screen.findByTestId("categoryDetail-8");
    expect(
      (await screen.findByTestId("categoryDetail-8-name")).textContent
    ).toMatch(/category 8/i);
    expect(
      (await screen.findByTestId("categoryDetail-8-description")).textContent
    ).toMatch(/description 8/i);
    expect(await screen.findByTestId("categoryDetail-8-image")).toHaveAttribute(
      "src",
      categoriesList[7].imageUrl
    );
  });
});
