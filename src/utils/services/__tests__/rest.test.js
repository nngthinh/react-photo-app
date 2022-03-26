import * as axios from "axios";
import { RestService } from "utils/services/rest";

// Base url
const baseUrl = "https://localhost:5000";
const [baseGet, basePost, basePut, basePatch, baseDelete] = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
];

// Mocked data
const mockedBody = { id: 1, name: "Happy" };
const mockedSuccessData = { data: "success" };
const mockedFailedData = { error: "not authorized" };
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

// Clear all local storage's state
afterAll(() => {
  global.localStorage.clear();
});

jest.mock("axios");

describe("get", () => {
  it("without token", () => {
    const mockedUrl = `${baseUrl}/${baseGet}`;
    // Mock server
    axios.get.mockImplementation((url, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.get(mockedUrl).then((data) => {
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith(mockedUrl, {});
      expect(data).toEqual(mockedSuccessData);
    });
  });

  it("with token", () => {
    const mockedUrl = `${baseUrl}/${baseGet}`;
    // Mock server
    axios.get.mockImplementation((url, config) =>
      Promise.resolve(mockedSuccessData)
    );
    setUserMockedToken();
    // Request
    return RestService.getWithToken(mockedUrl).then((data) => {
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith(
        mockedUrl,
        combineConfig(mockedToken, {})
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });

  it("with token and config", () => {
    const mockedUrl = `${baseUrl}/${baseGet}`;
    // Mock server
    axios.get.mockImplementation((url, config) =>
      Promise.resolve(mockedSuccessData)
    );

    // Save token
    setUserMockedToken();

    // Request
    return RestService.getWithToken(mockedUrl, mockedConfig).then((data) => {
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith(
        mockedUrl,
        combineConfig(mockedToken, mockedConfig)
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
});

describe("post", () => {
  it("without token", () => {
    const mockedUrl = `${baseUrl}/${basePost}`;
    // Mock server
    axios.post.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.post(mockedUrl, mockedBody).then((data) => {
      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(mockedUrl, mockedBody, {});
      expect(data).toEqual(mockedSuccessData);
    });
  });
  it("with token", () => {
    const mockedUrl = `${baseUrl}/${basePost}`;
    // Mock server
    axios.post.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );

    // Save token
    setUserMockedToken();

    // Request
    return RestService.postWithToken(mockedUrl, mockedBody).then((data) => {
      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(
        mockedUrl,
        mockedBody,
        combineConfig(mockedToken, {})
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
  it("with token and config", () => {
    const mockedUrl = `${baseUrl}/${basePost}`;
    // Mock server
    axios.post.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );

    // Save token
    setUserMockedToken();

    // Request
    return RestService.postWithToken(mockedUrl, mockedBody, mockedConfig).then(
      (data) => {
        expect(axios.post).toBeCalledTimes(1);
        expect(axios.post).toBeCalledWith(
          mockedUrl,
          mockedBody,
          combineConfig(mockedToken, mockedConfig)
        );
        expect(data).toEqual(mockedSuccessData);
      }
    );
  });
});

describe("put", () => {
  it("with token", () => {
    const mockedUrl = `${baseUrl}/${basePut}`;
    // Mock server
    axios.put.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );

    // Save token
    setUserMockedToken();

    // Request
    return RestService.putWithToken(mockedUrl, mockedBody).then((data) => {
      expect(axios.put).toBeCalledTimes(1);
      expect(axios.put).toBeCalledWith(
        mockedUrl,
        mockedBody,
        combineConfig(mockedToken, {})
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
  it("with token and config", () => {
    const mockedUrl = `${baseUrl}/${basePut}`;
    // Mock server
    axios.put.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );

    // Save token
    setUserMockedToken();

    // Request
    return RestService.putWithToken(mockedUrl, mockedBody, mockedConfig).then(
      (data) => {
        expect(axios.put).toBeCalledTimes(1);
        expect(axios.put).toBeCalledWith(
          mockedUrl,
          mockedBody,
          combineConfig(mockedToken, mockedConfig)
        );
        expect(data).toEqual(mockedSuccessData);
      }
    );
  });
});

describe("delete", () => {
  it("with token", () => {
    const mockedUrl = `${baseUrl}/${baseDelete}`;
    // Mock server
    axios.delete.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );

    // Save token
    setUserMockedToken();

    // Request
    return RestService.deleteWithToken(mockedUrl).then((data) => {
      expect(axios.delete).toBeCalledTimes(1);
      expect(axios.delete).toBeCalledWith(
        mockedUrl,
        combineConfig(mockedToken, {})
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
  it("delete with token and config", () => {
    const mockedUrl = `${baseUrl}/${baseDelete}`;
    // Mock server
    axios.delete.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );

    // Save token
    setUserMockedToken();

    // Request
    return RestService.deleteWithToken(mockedUrl, mockedConfig).then((data) => {
      expect(axios.delete).toBeCalledTimes(1);
      expect(axios.delete).toBeCalledWith(
        mockedUrl,
        combineConfig(mockedToken, mockedConfig)
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
});
