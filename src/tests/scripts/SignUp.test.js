import axios from "axios";
import App from "App";
import baseUrl from "constants/apiUrl";
import { render, screen, act } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import createStoreSynchedWithLocalStorage from "stores";
import { validate } from "webpack";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "utils/validation/auth";
import { setupMockedServer } from "tests/mock/server";

// Global store with no user session
const store = createStoreSynchedWithLocalStorage();

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

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

// => {
//   return Promise.resolve({ data: "Error" });
//   // Sign up
//   if (url === signUpUrl) {
//     // const { name, email, password } = body;
//     // validateName(name) && validateEmail(email) && validatePassword(password);
//     return { response: { data: "Error" } };
//   }
//   // Sign in
//   else if (url === signInUrl) {
//     return {
//       access_token:
//         "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywiaWF0IjoxNjQ3MjM1NzQ3LCJleHAiOjE2NDczMjIxNDd9.01yuTZgLzz61L3aHnbqkczy9fB0tuTKTwd_39iRqkLQ",
//     };
//   }
// });

describe("sign up success", () => {
  beforeEach(() => {
    setupMockedServer();
  });

  it("should verb... no error", async (done) => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // Move to sign up page

    // Go to sign up page
    userEvent.click(screen.getByTestId("signInButton"));
    userEvent.click(screen.getByTestId("signUpButton"));
    // Type fields
    userEvent.type(screen.getByTestId("name"), mockedUser.name);
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign up
    userEvent.click(screen.getByTestId("signUpButton"));

    // Wait for success
    await waitFor(() => expect(axios.get.mock.calls.length).toEqual(1));
    await waitFor(() => expect(axios.post.mock.calls.length).toEqual(2));
  });
});
describe("sign up failed", () => {
  test("error in name", () => {});
  test("error in email", () => {});
  test("error in password", () => {});
});
