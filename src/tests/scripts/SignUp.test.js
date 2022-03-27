import axios from "axios";
import App from "App";
import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import createStoreSynchedWithLocalStorage from "stores";

// Global store with no user session
const store = createStoreSynchedWithLocalStorage();

// Mock data
const mockedUser = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "123abC#ef",
};
const duplicatedEmail = "admin2@gmail.com";

jest.mock("axios");

// Setup
beforeEach(() => {
  axios.get.mockImplementation(async (url, config) => {
    Promise.resolve({ data: { name: mockedUser.name, id: 1 } });
  });
  axios.post.mockImplementation(async (url, body, config) => {
    const { pathname } = new URL(url);
    // Sign up
    if (pathname === "/users") {
      if (body.email === duplicatedEmail) {
        return Promise.reject({
          response: { data: { message: "Email already exists" } },
        });
      }
      return Promise.resolve({ data: {} });
    }
    // Sign in
    else {
      if (
        body.email !== mockedUser.email ||
        body.password !== mockedUser.password
      ) {
        return Promise.reject({
          response: {
            data: { message: "Invalid email or password." },
          },
        });
      }
      return Promise.resolve({
        data: {
          accessToken: "sampleAccessToken",
        },
      });
    }
  });
});

// Clean storage
afterEach(() => {
  localStorage.clear();
});

describe("sign up success", () => {
  it("should return no error", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // Go to sign up page
    userEvent.click(screen.getByTestId("avatar"));
    userEvent.click(screen.getByTestId("signInButton"));
    userEvent.click(screen.getByTestId("signUpButton"));
    // Type fields
    userEvent.type(screen.getByTestId("name"), mockedUser.name);
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign up
    userEvent.click(screen.getByTestId("signUpButton"));
    // Wait for calling all api
    await waitFor(() => expect(axios.post.mock.calls.length).toEqual(2));
    await waitFor(() => expect(axios.get.mock.calls.length).toEqual(1));
    // Wait for toast message
    await screen.findByText(/create account successfully\./i);
  });
});

describe("sign up failed", () => {
  it("should return name field error", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // Go to sign up page
    userEvent.click(screen.getByTestId("avatar"));
    userEvent.click(screen.getByTestId("signInButton"));
    userEvent.click(screen.getByTestId("signUpButton"));
    // Missing name
    userEvent.click(screen.getByTestId("signUpButton"));
    expect(
      screen.getByText(/length must be between 1 and 30\./i)
    ).toBeInTheDocument();
    // Name longer than 30
    userEvent.type(
      screen.getByTestId("name"),
      "longer than 30 charrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"
    );
    userEvent.click(screen.getByTestId("signUpButton"));
    expect(
      screen.getByText(/length must be between 1 and 30\./i)
    ).toBeInTheDocument();
    // Ensures there's no post request
    expect(axios.post.mock.calls.length).toEqual(0);
  });

  it("should return email field error", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // Go to sign up page
    userEvent.click(screen.getByTestId("avatar"));
    userEvent.click(screen.getByTestId("signInButton"));
    userEvent.click(screen.getByTestId("signUpButton"));
    // Missing email
    userEvent.click(screen.getByTestId("signUpButton"));
    expect(
      screen.getByText(/not a valid email address\./i)
    ).toBeInTheDocument();
    // Email longer than 30
    userEvent.type(
      screen.getByTestId("email"),
      "abcdejkfkjhkjfhasdkjhfahjsdfkjghasdf1234567890@gmail.com"
    );
    userEvent.click(screen.getByTestId("signUpButton"));
    expect(
      screen.getByText(/longer than maximum length 30\./i)
    ).toBeInTheDocument();
    // Ensures there's no post request
    expect(axios.post.mock.calls.length).toEqual(0);
  });

  it("should return password field error", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // Go to sign up page
    userEvent.click(screen.getByTestId("avatar"));
    userEvent.click(screen.getByTestId("signInButton"));
    userEvent.click(screen.getByTestId("signUpButton"));
    // Missing password
    userEvent.click(screen.getByTestId("signUpButton"));
    await screen.findByText(/shorter than minimum length 6\./i);
    // Not sastified password constraints
    userEvent.type(screen.getByTestId("password"), "123abc");
    userEvent.click(screen.getByTestId("signUpButton"));
    await screen.findByText(
      /contains at least one uppercase, one lowercase, and one number\./i
    );
    // Ensures there's no post request
    expect(axios.post.mock.calls.length).toEqual(0);
  });

  it("should return duplicated email error", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // Go to sign up page
    userEvent.click(screen.getByTestId("avatar"));
    userEvent.click(screen.getByTestId("signInButton"));
    userEvent.click(screen.getByTestId("signUpButton"));
    // Type fields
    userEvent.type(screen.getByTestId("name"), mockedUser.name);
    userEvent.type(screen.getByTestId("email"), duplicatedEmail);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign up
    userEvent.click(screen.getByTestId("signUpButton"));
    // Wait for calling all api
    await waitFor(() => expect(axios.post.mock.calls.length).toEqual(1));
    // Wait for toast message
    await screen.findByText(/email already exists/i);
  });
});
