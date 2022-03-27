import RestService from "utils/services/rest";
import App from "App";
import { render, screen, waitFor } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import usersFixture from "tests/fixtures/users";

// Mock data
const mockedUser = usersFixture.info[1]; // get the first user info
const duplicatedEmail = usersFixture.info[2].email;

jest.mock("utils/services/rest", () => ({
  getWithToken: jest.fn(),
  post: jest.fn(),
}));

// Setup
beforeEach(() => {
  RestService.getWithToken.mockImplementation(async (url, config) => {
    Promise.resolve({ data: { name: mockedUser.name, id: mockedUser.id } });
  });
  RestService.post.mockImplementation(async (url, body, config) => {
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

// Cleanup environment
afterEach(() => {
  document.body.textContent = "";
  global.localStorage.clear();
});

describe("navigation", () => {
  it("can navigate to sign in page", async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
    userEvent.click(screen.getByTestId("navigateSignInButton"));
    await screen.findByTestId("signInButton");
  });
});

describe("sign up success", () => {
  it("should return no error", async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
    // Type fields
    userEvent.type(screen.getByTestId("name"), mockedUser.name);
    userEvent.type(screen.getByTestId("email"), mockedUser.email);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign up
    userEvent.click(screen.getByTestId("signUpButton"));
    // Wait for calling all api
    await waitFor(() => expect(RestService.post.mock.calls.length).toEqual(2));
    await waitFor(() =>
      expect(RestService.getWithToken.mock.calls.length).toEqual(1)
    );
    // Navigate to home
    await screen.findByTestId("home");
    // Wait for toast message
    await screen.findByText(/create account successfully\./i);
  });
});

describe("sign up failed", () => {
  it("should return name field error", async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
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
    expect(RestService.post.mock.calls.length).toEqual(0);
  });

  it("should return email field error", async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
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
    expect(RestService.post.mock.calls.length).toEqual(0);
  });

  it("should return password field error", async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
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
    expect(RestService.post.mock.calls.length).toEqual(0);
  });

  it("should return duplicated email error", async () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <App />
      </MemoryRouter>
    );
    // Type fields
    userEvent.type(screen.getByTestId("name"), mockedUser.name);
    userEvent.type(screen.getByTestId("email"), duplicatedEmail);
    userEvent.type(screen.getByTestId("password"), mockedUser.password);
    // Sign up
    userEvent.click(screen.getByTestId("signUpButton"));
    // Wait for calling all api
    await waitFor(() => expect(RestService.post.mock.calls.length).toEqual(1));
    // Wait for toast message
    await screen.findByText(/email already exists/i);
  });
});
