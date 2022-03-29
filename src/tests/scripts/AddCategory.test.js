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
  it("able to navigate between pages", async () => {});
  // Features
  it("should display from home to item detail", async () => {});
});

describe("item detail", () => {
  // Navigation
  it("not able to go to edit item page for guest", async () => {});
  it("not able to go to edit item page for not author user", async () => {});
  it("able to go to edit item page for author user", async () => {});
  // Features
  it("should display category detail", async () => {});
  it("not able to delete item for guest", async () => {});
  it("not able to delete item for not author user", async () => {});
  it("able to delete item for author user", async () => {});
});
