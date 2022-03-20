import axios from "axios";
import App from "App";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import createStoreSynchedWithLocalStorage from "stores";
import { act } from "react-dom/test-utils";

// Global store with no user session
const store = createStoreSynchedWithLocalStorage();

// Mock data
const mockedUser = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "123abC#ef",
};

jest.mock("axios");

// Setup
beforeEach(() => {
  axios.get.mockImplementation(async (url, config) => {
    Promise.resolve({ data: { name: mockedUser.name, id: 1 } });
  });
  axios.post.mockImplementation(async (url, body, config) => {
    // Sign in
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
  });
});

// Clean storage
afterEach(() => {
  localStorage.clear();
});

describe("sign in success", () => {
  it("should return no error", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // Go to sign in page
    userEvent.click(screen.getByTestId("signInButton"));

    // Type fields
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign in
    userEvent.click(screen.getByTestId("signInButton"));

    // Wait for calling all api
    await waitFor(() => expect(axios.post.mock.calls.length).toEqual(1));
    await waitFor(() => expect(axios.get.mock.calls.length).toEqual(1));
    // Wait for toast message
    await screen.findByText(/sign in successfully\./i);
  });
});

describe("sign in failed", () => {
  it("should return email field error", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // Go to sign in page
    userEvent.click(screen.getByTestId("signInButton"));

    // Missing email
    userEvent.click(screen.getByTestId("signInButton"));
    expect(
      screen.getByText(/not a valid email address\./i)
    ).toBeInTheDocument();

    // Email longer than 30
    userEvent.type(
      screen.getByTestId("email"),
      "abcdejkfkjhkjfhasdkjhfahjsdfkjghasdf1234567890@gmail.com"
    );
    userEvent.click(screen.getByTestId("signInButton"));
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
    // Go to sign in page
    userEvent.click(screen.getByTestId("signInButton"));

    // Missing password
    userEvent.click(screen.getByTestId("signInButton"));
    await screen.findByText(/shorter than minimum length 6\./i);

    // Not sastified password constraints
    userEvent.type(screen.getByTestId("password"), "123abc");
    userEvent.click(screen.getByTestId("signInButton"));
    await screen.findByText(
      /contains at least one uppercase, one lowercase, and one number\./i
    );

    // Ensures there's no post request
    expect(axios.post.mock.calls.length).toEqual(0);
  });

  it("should return invalid email or password error", async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    // Go to sign in page
    userEvent.click(screen.getByTestId("signInButton"));

    // Wrong email
    userEvent.type(screen.getByTestId("email"), "noise" + mockedUser.email);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    userEvent.click(screen.getByTestId("signInButton"));
    // Wait for calling all api
    await waitFor(() => expect(axios.post.mock.calls.length).toEqual(1));
    // Wait for toast message
    await screen.findByText(/invalid email or password/i);
    // await waitForElementToBeRemoved(
    //   screen.queryByText(/invalid email or password/i)
    // );
    // Wrong password
    userEvent.clear(screen.getByTestId("email"));
    userEvent.clear(screen.getByTestId("password"));
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(
      screen.getByTestId("password"),
      mockedUser.password + "noise"
    );
    userEvent.click(screen.getByTestId("signInButton"));
    // Wait for calling all api
    await waitFor(() => expect(axios.post.mock.calls.length).toEqual(2));
    // Wait for toast message
    await screen.findByText(/invalid email or password/i);
  });
});
