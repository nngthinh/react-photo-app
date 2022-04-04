import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "tests/utils/rtl";
import { usersData } from "tests/fixtures/database";
import RestService from "utils/services/rest";
import App from "App";

// Mock data
const mockedUser = usersData.info[1];
const wrongEmail = "hehe" + mockedUser.email;
const wrongPassword = "hehe" + mockedUser.password;

jest.mock("utils/services/rest", () => ({
  getWithToken: jest.fn(),
  post: jest.fn(),
}));

// Testing
describe("sign in", () => {
  // Setup
  beforeEach(() => {
    // Clear env
    window.localStorage.clear();
    // Mock server
    RestService.getWithToken.mockImplementation(async (url, config) =>
      Promise.resolve({ name: mockedUser.name, id: mockedUser.id })
    );
    RestService.post.mockImplementation(async (url, body, config) => {
      // Sign in
      if (
        body.email !== mockedUser.email ||
        body.password !== mockedUser.password
      ) {
        return Promise.reject({ message: "Invalid email or password." });
      }
      return Promise.resolve({ accessToken: mockedUser.token });
    });
  });

  // Navigation
  it("should be able to go to sign up page", async () => {
    render(<App />, { route: "/signin" });
    userEvent.click(screen.getByTestId("navigateSignUpButton"));
    await screen.findByTestId("signUpButton");
    expect(window.location.pathname).toBe("/signup");
  });

  // Sign in successfully
  it("should return no error", async () => {
    render(<App />, { route: "/signin" });

    // Type fields
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign in
    userEvent.click(screen.getByTestId("signInButton"));

    // Wait for calling all api
    await waitFor(() => expect(RestService.post.mock.calls.length).toBe(1)); // Sign in
    await screen.findByTestId("home");
    await waitFor(() =>
      expect(RestService.getWithToken.mock.calls.length).toBe(1)
    ); // Auto sign in check
    // Wait for toast message
    await screen.findByText(/sign in successfully\./i);
  });

  // Sign in failed
  it("should return email field error", async () => {
    render(<App />, { route: "/signin" });

    // Type other valid inputs
    userEvent.type(screen.getByTestId("password"), mockedUser.password);

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
    expect(RestService.post.mock.calls.length).toBe(0);
  });

  it("should return password field error", async () => {
    render(<App />, { route: "/signin" });

    // Type other valid inputs
    userEvent.type(screen.getByTestId("email"), mockedUser.email);

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
    expect(RestService.post.mock.calls.length).toBe(0);
  });

  it("should return invalid email or password error", async () => {
    render(<App />, { route: "/signin" });
    // Wrong email
    userEvent.type(screen.getByTestId("email"), wrongEmail);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    userEvent.click(screen.getByTestId("signInButton"));
    // Wait for calling all api
    await waitFor(() => expect(RestService.post.mock.calls.length).toBe(1));
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
    await waitFor(() => expect(RestService.post.mock.calls.length).toBe(2));
    // Wait for toast message
    await screen.findByText(/invalid email or password/i);
  });
});
