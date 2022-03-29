import { waitFor } from "@testing-library/react";
import * as axios from "axios";
import RestService from "utils/services/rest";

// Wrapper for error testing

class NoErrorThrownError extends Error {}

const getError = async (call) => {
  try {
    await call();
    throw new NoErrorThrownError();
  } catch (error) {
    return error;
  }
};

// Mocked data
// - Url
const baseUrl = "https://localhost:5000";
const [baseGet, basePost, basePut, baseDelete] = [
  "get",
  "post",
  "put",
  "delete",
];
const mockedFailedUrl = "failed";
const mockedErrorUrl = "error";
// - Response and data
const mockedBody = { id: 1, name: "Happy" };
const mockedSuccessData = { message: "success message" };
const mockedSuccessResponse = { data: { ...mockedSuccessData } };
const mockedFailedData = { message: "failed message" };
const mockedFailedResponse = { response: { data: { ...mockedFailedData } } };
const mockedError = new Error("error message");
// - Token and config
const mockedToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MywiaWF0IjoxNjQ3MjM1NzQ3LCJleHAiOjE2NDczMjIxNDd9.01yuTZgLzz61L3aHnbqkczy9fB0tuTKTwd_39iRqkLQ";
const mockedConfig = { "Content-Type": "application/x-www-form-urlencoded" };
const combineConfig = (token = "", config) => {
  return token
    ? {
        ...config,
        headers: { ...config["headers"], Authorization: `Bearer ${token}` },
      }
    : config;
};

// Store user token in local storage
const setUserMockedToken = () => {
  global.localStorage.setItem(
    "state",
    JSON.stringify({ user: { token: mockedToken } })
  );
};

// Mock server APIs
jest.mock("axios");

// Clear all local storage's state
afterEach(() => {
  global.localStorage.clear();
});

// Testing
describe("get without token", () => {
  const mockedUrl = `${baseUrl}/${baseGet}`;
  it("to have successful response from server", async () => {
    // Mock api
    axios.get.mockImplementationOnce(async (url, config) =>
      Promise.resolve(mockedSuccessResponse)
    );
    // Assertion
    const data = await RestService.get(mockedUrl);
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(mockedUrl, {});
    expect(data).toEqual(mockedSuccessData);
  });

  it("to have failed response from server", async () => {
    // Mock api
    axios.get.mockImplementationOnce(async (url, config) =>
      Promise.reject(mockedFailedResponse)
    );
    // Assertion
    const error = await getError(
      async () => await RestService.get(mockedFailedUrl)
    );
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(mockedFailedUrl, {});
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedFailedData);
  });

  it("to have error", async () => {
    // Mock api
    axios.get.mockImplementationOnce(async (url, config) => {
      throw mockedError;
    });
    // Assertion
    const error = await getError(
      async () => await RestService.get(mockedErrorUrl)
    );
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(mockedErrorUrl, {});
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedError);
  });
});

describe("get with token", () => {
  const mockedUrl = `${baseUrl}/${baseGet}`;
  it("to have successful response from server", async () => {
    // Mock api
    axios.get.mockImplementationOnce(async (url, config) =>
      Promise.resolve(mockedSuccessResponse)
    );
    // Store user token
    setUserMockedToken();
    // Assertion
    const data = await RestService.getWithToken(mockedUrl);
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(mockedUrl, combineConfig(mockedToken, {}));
    expect(data).toEqual(mockedSuccessData);
  });

  it("to have failed response from server", async () => {
    // Mock api
    axios.get.mockImplementationOnce(async (url, config) =>
      Promise.reject(mockedFailedResponse)
    );
    // Store user token
    setUserMockedToken();
    // Assertion
    const error = await getError(
      async () => await RestService.getWithToken(mockedFailedUrl)
    );
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(
      mockedFailedUrl,
      combineConfig(mockedToken, {})
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedFailedData);
  });

  it("to have error", async () => {
    // Mock api
    axios.get.mockImplementationOnce(async (url, config) => {
      throw mockedError;
    });
    // Store user token
    setUserMockedToken();
    // Assertion
    const error = await getError(
      async () => await RestService.getWithToken(mockedErrorUrl)
    );
    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(
      mockedErrorUrl,
      combineConfig(mockedToken, {})
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedError);
  });
});

describe("post without token", () => {
  const mockedUrl = `${baseUrl}/${basePost}`;
  it("to have successful response from server", async () => {
    // Mock api
    axios.post.mockImplementationOnce(async (url, body, config) =>
      Promise.resolve(mockedSuccessResponse)
    );
    // Assertion
    const data = await RestService.post(mockedUrl, mockedBody);
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith(mockedUrl, mockedBody, {});
    expect(data).toEqual(mockedSuccessData);
  });

  it("to have failed response from server", async () => {
    // Mock api
    axios.post.mockImplementationOnce(async (url, body, config) =>
      Promise.reject(mockedFailedResponse)
    );
    // Assertion
    const error = await getError(
      async () => await RestService.post(mockedFailedUrl, mockedBody)
    );
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith(mockedFailedUrl, mockedBody, {});
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedFailedData);
  });

  it("to have error", async () => {
    // Mock api
    axios.post.mockImplementationOnce(async (url, body, config) => {
      throw mockedError;
    });
    // Assertion
    const error = await getError(
      async () => await RestService.post(mockedErrorUrl, mockedBody)
    );
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith(mockedErrorUrl, mockedBody, {});
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedError);
  });
});

describe("post with token", () => {
  const mockedUrl = `${baseUrl}/${basePost}`;
  it("to have successful response from server", async () => {
    // Mock api
    axios.post.mockImplementationOnce(async (url, body, config) =>
      Promise.resolve(mockedSuccessResponse)
    );
    // Store user token
    setUserMockedToken();
    // Assertion
    const data = await RestService.postWithToken(mockedUrl, mockedBody);
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith(
      mockedUrl,
      mockedBody,
      combineConfig(mockedToken, {})
    );
    expect(data).toEqual(mockedSuccessData);
  });

  it("to have failed response from server", async () => {
    // Mock api
    axios.post.mockImplementationOnce(async (url, body, config) =>
      Promise.reject(mockedFailedResponse)
    );
    // Store user token
    setUserMockedToken();
    // Assertion
    const error = await getError(
      async () => await RestService.postWithToken(mockedFailedUrl, mockedBody)
    );
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith(
      mockedFailedUrl,
      mockedBody,
      combineConfig(mockedToken, {})
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedFailedData);
  });

  it("to have error", async () => {
    // Mock api
    axios.post.mockImplementationOnce(async (url, body, config) => {
      throw mockedError;
    });
    // Store user token
    setUserMockedToken();
    // Assertion
    const error = await getError(
      async () => await RestService.postWithToken(mockedErrorUrl, mockedBody)
    );
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith(
      mockedErrorUrl,
      mockedBody,
      combineConfig(mockedToken, {})
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedError);
  });
});

describe("put with token", () => {
  const mockedUrl = `${baseUrl}/${basePut}`;
  it("to have successful response from server", async () => {
    // Mock api
    axios.put.mockImplementationOnce(async (url, body, config) =>
      Promise.resolve(mockedSuccessResponse)
    );
    // Store user token
    setUserMockedToken();
    // Assertion
    const data = await RestService.putWithToken(mockedUrl, mockedBody);
    expect(axios.put).toBeCalledTimes(1);
    expect(axios.put).toBeCalledWith(
      mockedUrl,
      mockedBody,
      combineConfig(mockedToken, {})
    );
    expect(data).toEqual(mockedSuccessData);
  });

  it("to have failed response from server", async () => {
    // Mock api
    axios.put.mockImplementationOnce(async (url, body, config) =>
      Promise.reject(mockedFailedResponse)
    );
    // Store user token
    setUserMockedToken();
    // Assertion
    const error = await getError(
      async () => await RestService.putWithToken(mockedFailedUrl, mockedBody)
    );
    expect(axios.put).toBeCalledTimes(1);
    expect(axios.put).toBeCalledWith(
      mockedFailedUrl,
      mockedBody,
      combineConfig(mockedToken, {})
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedFailedData);
  });

  it("to have error", async () => {
    // Mock api
    axios.put.mockImplementationOnce(async (url, body, config) => {
      throw mockedError;
    });
    // Store user token
    setUserMockedToken();
    // Assertion
    const error = await getError(
      async () => await RestService.putWithToken(mockedErrorUrl, mockedBody)
    );
    expect(axios.put).toBeCalledTimes(1);
    expect(axios.put).toBeCalledWith(
      mockedErrorUrl,
      mockedBody,
      combineConfig(mockedToken, {})
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedError);
  });
});

describe("delete with token", () => {
  const mockedUrl = `${baseUrl}/${baseDelete}`;
  it("to have successful response from server", async () => {
    // Mock api
    axios.delete.mockImplementationOnce(async (url, config) =>
      Promise.resolve(mockedSuccessResponse)
    );
    // Store user token
    setUserMockedToken();
    // Assertion
    const data = await RestService.deleteWithToken(mockedUrl);
    expect(axios.delete).toBeCalledTimes(1);
    expect(axios.delete).toBeCalledWith(
      mockedUrl,
      combineConfig(mockedToken, {})
    );
    expect(data).toEqual(mockedSuccessData);
  });

  it("to have failed response from server", async () => {
    // Mock api
    axios.delete.mockImplementationOnce(async (url, config) =>
      Promise.reject(mockedFailedResponse)
    );
    // Store user token
    setUserMockedToken();
    // Assertion
    const error = await getError(
      async () => await RestService.deleteWithToken(mockedFailedUrl)
    );
    expect(axios.delete).toBeCalledTimes(1);
    expect(axios.delete).toBeCalledWith(
      mockedFailedUrl,
      combineConfig(mockedToken, {})
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedFailedData);
  });

  it("to have error", async () => {
    // Mock api
    axios.delete.mockImplementationOnce(async (url, config) => {
      throw mockedError;
    });
    // Store user token
    setUserMockedToken();
    // Assertion
    const error = await getError(
      async () => await RestService.deleteWithToken(mockedErrorUrl)
    );
    expect(axios.delete).toBeCalledTimes(1);
    expect(axios.delete).toBeCalledWith(
      mockedErrorUrl,
      combineConfig(mockedToken, {})
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toEqual(mockedError);
  });
});
