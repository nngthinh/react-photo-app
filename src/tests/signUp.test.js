import axios from "axios";
import App from "App";
import baseUrl from "constants/apiUrl";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { loadState } from "utils/services/localStorage";
import configureStore from "stores/configureStore";

const persistedState = loadState();
const store = configureStore(persistedState);
store.subscribe(() => {
  const state = store.getState();
  saveState({
    user: { isLoggedIn: false },
    categories: state.categories,
    items: state.items,
  });
});

// Provider
beforeAll(() => {});

afterEach(() => {
  localStorage.clear();
});

// Mock database
const mockedUser = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "123abc",
};

// Mock server
const signUpUrl = `${baseUrl}/auth`;
const signInUrl = `${baseUrl}/users`;
const getUserInfo = `${baseUrl}/users/me`;

jest.mock("axios");
axios.get = jest.fn().mockImplementation((url) => {
  if (url === getUserInfo) {
  } else {
    return setTimeout(() => {
      Promise.reject("Wrong url");
    }, 500);
  }
});
axios.post = jest.fn().mockImplementation((url, body) => {
  if (url === signUpUrl) {
    return setTimeout(() => {}, 500);
  } else if (url === signUpUrl) {
  } else {
    return setTimeout(() => {
      Promise.reject("Wrong url");
    }, 500);
  }
});

describe("sign up success", () => {
  test("no error", () => {
    console.log(state.getState());
  });
});
describe("sign up failed", () => {
  test("error in name", () => {});
  test("error in email", () => {});
  test("error in password", () => {});
});
