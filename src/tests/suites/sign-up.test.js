import RestService from "utils/services/rest";
import App from "App";
import { render, screen, waitFor } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import { usersData } from "tests/fixtures/database";

// Mock data
const mockedUser = usersData.info[1]; // get the first user info
const duplicatedEmail = usersData.info[2].email;

jest.mock("utils/services/rest", () => ({
  getWithToken: jest.fn(),
  post: jest.fn(),
}));

// Setup
beforeEach(() => {
  RestService.getWithToken.mockImplementation(async (url, config) =>
    Promise.resolve({ name: mockedUser.name, id: mockedUser.id })
  );
  RestService.post.mockImplementation(async (url, body, config) => {
    const { pathname } = new URL(url);
    // Sign up
    if (pathname === "/users") {
      if (body.email === duplicatedEmail) {
        return Promise.reject({ message: "Email already exists" });
      }
      return Promise.resolve({ data: {} });
    }
    // Sign in
    else {
      if (
        body.email !== mockedUser.email ||
        body.password !== mockedUser.password
      ) {
        return Promise.reject({ message: "Invalid email or password." });
      }
      return Promise.resolve({ accessToken: "sampleAccessToken" });
    }
  });
});

afterEach(() => {
  global.localStorage.clear();
});

// Testing
describe("sign up", () => {
  // Navigation
  it("should be able to go to sign in page", async () => {
    render(<App />, { route: "/signup" });
    userEvent.click(screen.getByTestId("navigateSignInButton"));
    await screen.findByTestId("signInButton");
    expect(window.location.pathname).toBe("/signin");
  });

  // SIgn up successfully
  it("should return no error", async () => {
    render(<App />, { route: "/signup" });
    // Type fields
    userEvent.type(screen.getByTestId("name"), mockedUser.name);
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign up
    userEvent.click(screen.getByTestId("signUpButton"));
    // Wait for calling all api
    await waitFor(() => expect(RestService.post.mock.calls.length).toBe(2));
    await waitFor(() =>
      expect(RestService.getWithToken.mock.calls.length).toBe(1)
    );
    // Navigate to home
    await screen.findByTestId("home");
    // Wait for toast message
    await screen.findByText(/create account successfully\./i);
  });

  // SIgn up failed
  it("should return name field error", async () => {
    render(<App />, { route: "/signup" });
    // Type other valid inputs
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
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
    expect(RestService.post.mock.calls.length).toBe(0);
  });

  it("should return email field error", async () => {
    render(<App />, { route: "/signup" });
    // Type other valid inputs
    userEvent.type(screen.getByTestId("name"), mockedUser.name);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
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
    expect(RestService.post.mock.calls.length).toBe(0);
  });

  it("should return password field error", async () => {
    render(<App />, { route: "/signup" });
    // Type other valid inputs
    userEvent.type(screen.getByTestId("name"), mockedUser.name);
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
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
    expect(RestService.post.mock.calls.length).toBe(0);
  });

  it("should return duplicated email error", async () => {
    render(<App />, { route: "/signup" });
    // Type fields
    userEvent.type(screen.getByTestId("name"), mockedUser.name);
    userEvent.type(screen.getByTestId("email"), duplicatedEmail);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign up
    userEvent.click(screen.getByTestId("signUpButton"));
    // Wait for calling all api
    await waitFor(() => expect(RestService.post.mock.calls.length).toBe(1));
    // Wait for toast message
    await screen.findByText(/email already exists/i);
  });
});
