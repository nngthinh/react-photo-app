import axios from "axios";
import SignUp from "components/Auth/SignUp";
import baseUrl from "constants/apiUrl";

jest.mock("axios");

const signUpUrl = `${baseUrl}/auth`;
const signInUrl = `${baseUrl}/users`;

axios.get = jest.fn().mockImplementation((url) => {});

axios.post = jest.fn().mockImplementation((url, body) => {});

describe("sign up success", () => {});

describe("sign up failed", () => {});
