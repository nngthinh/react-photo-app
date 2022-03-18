import axios from "axios";
import SignIn from "components/Auth/SignIn";
import baseUrl from "constants/apiUrl";

jest.mock("axios");

const signInUrl = `${baseUrl}/users`;

axios.get = jest.fn().mockImplementation((url) => {});
axios.post = jest.fn().mockImplementation((url, body) => {});

describe("sign in success", () => {
  test("no error", () => {});
});
describe("sign in failed", () => {
  test("error in name", () => {});
  test("error in email", () => {});
  test("error in password", () => {});
});
