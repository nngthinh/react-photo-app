import RestService from "utils/services/rest";
import App from "App";
import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import createStoreSynchedWithLocalStorage from "stores";
import { MemoryRouter } from "react-router-dom";
import usersFixture from "tests/fixtures/users";

// Global store with no user session
let store;

// Mock data
const mockedUser = usersFixture.info[1];
const wrongEmail = "hehe" + mockedUser.email;
const wrongPassword = "hehe" + mockedUser.password;

jest.mock("utils/services/rest", () => ({
  getWithToken: jest.fn(),
  post: jest.fn(),
}));

// Setup
beforeEach(() => {
  // Mock server
  RestService.getWithToken.mockImplementation(async (url, config) => {
    Promise.resolve({ data: { name: mockedUser.name, id: mockedUser.id } });
  });
  RestService.post.mockImplementation(async (url, body, config) => {
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
        accessToken: mockedUser.token,
      },
    });
  });

  // Create store
  store = createStoreSynchedWithLocalStorage();
});

// Clean the environment
afterEach(() => {
  document.body.textContent = "";
  global.localStorage.clear();
});

describe("sign in success", () => {
  it("should return no error", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    // Go to sign in page
    userEvent.click(screen.getByTestId("avatar"));
    userEvent.click(await screen.findByTestId("signInButton"));
    userEvent.click(screen.getByTestId("signInButton"));

    // Type fields
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign in
    userEvent.click(screen.getByTestId("signInButton"));

    // Wait for calling all api
    await waitFor(() => expect(RestService.post.mock.calls.length).toEqual(1)); // Sign in
    await screen.findByTestId("home");
    await waitFor(() =>
      expect(RestService.getWithToken.mock.calls.length).toEqual(1)
    ); // Auto sign in check
    // Wait for toast message
    await screen.findByText(/sign in successfully\./i);
  });
});

describe("sign in failed", () => {
  it("should return email field error", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/signin"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

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
    expect(RestService.post.mock.calls.length).toEqual(0);
  });

  it("should return password field error", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/signin"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

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
    expect(RestService.post.mock.calls.length).toEqual(0);
  });

  it("should return invalid email or password error", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/signin"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Wrong email
    userEvent.type(screen.getByTestId("email"), wrongEmail);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    userEvent.click(screen.getByTestId("signInButton"));
    // Wait for calling all api
    await waitFor(() => expect(RestService.post.mock.calls.length).toEqual(1));
    // Wait for toast message
    await screen.findByText(/invalid email or password/i);
    // Clean input
    userEvent.clear(screen.getByTestId("email"));
    userEvent.clear(screen.getByTestId("password"));
    // Wrong password
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(screen.getByTestId("password"), wrongPassword);

    // await waitForElementToBeRemoved(() =>
    //   screen.queryByText(/invalid email or password/i)
    // );
    // expect(
    //   await screen.findByText(/invalid email or password/i)
    // ).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("signInButton"));
    // Wait for calling all api
    await waitFor(() => expect(RestService.post.mock.calls.length).toEqual(2));
    // Wait for toast message
    await screen.findByText(/invalid email or password/i);
  });
});
