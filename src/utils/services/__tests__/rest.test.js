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

jest.mock("axios");

describe("get", () => {
  test("get without token", () => {
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
  test("get with token", () => {
    const mockedUrl = `${baseUrl}/${baseGet}`;
    // Mock server
    axios.get.mockImplementation((url, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.get(mockedUrl, mockedToken).then((data) => {
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toBeCalledWith(
        mockedUrl,
        combineConfig(mockedToken, {})
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
  test("get with token and config", () => {
    const mockedUrl = `${baseUrl}/${baseGet}`;
    // Mock server
    axios.get.mockImplementation((url, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.get(mockedUrl, mockedToken, mockedConfig).then(
      (data) => {
        expect(axios.get).toBeCalledTimes(1);
        expect(axios.get).toBeCalledWith(
          mockedUrl,
          combineConfig(mockedToken, mockedConfig)
        );
        expect(data).toEqual(mockedSuccessData);
      }
    );
  });
});

describe("post", () => {
  test("post without token", () => {
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
  test("post with token", () => {
    const mockedUrl = `${baseUrl}/${basePost}`;
    // Mock server
    axios.post.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.post(mockedUrl, mockedBody, mockedToken).then((data) => {
      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(
        mockedUrl,
        mockedBody,
        combineConfig(mockedToken, {})
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
  test("post with token and config", () => {
    const mockedUrl = `${baseUrl}/${basePost}`;
    // Mock server
    axios.post.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.post(
      mockedUrl,
      mockedBody,
      mockedToken,
      mockedConfig
    ).then((data) => {
      expect(axios.post).toBeCalledTimes(1);
      expect(axios.post).toBeCalledWith(
        mockedUrl,
        mockedBody,
        combineConfig(mockedToken, mockedConfig)
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
});

describe("put", () => {
  test("put without token", () => {
    const mockedUrl = `${baseUrl}/${basePut}`;
    // Mock server
    axios.put.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.put(mockedUrl, mockedBody).then((data) => {
      expect(axios.put).toBeCalledTimes(1);
      expect(axios.put).toBeCalledWith(mockedUrl, mockedBody, {});
      expect(data).toEqual(mockedSuccessData);
    });
  });
  test("put with token", () => {
    const mockedUrl = `${baseUrl}/${basePut}`;
    // Mock server
    axios.put.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.put(mockedUrl, mockedBody, mockedToken).then((data) => {
      expect(axios.put).toBeCalledTimes(1);
      expect(axios.put).toBeCalledWith(
        mockedUrl,
        mockedBody,
        combineConfig(mockedToken, {})
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
  test("put with token and config", () => {
    const mockedUrl = `${baseUrl}/${basePut}`;
    // Mock server
    axios.put.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.put(
      mockedUrl,
      mockedBody,
      mockedToken,
      mockedConfig
    ).then((data) => {
      expect(axios.put).toBeCalledTimes(1);
      expect(axios.put).toBeCalledWith(
        mockedUrl,
        mockedBody,
        combineConfig(mockedToken, mockedConfig)
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
});

describe("patch", () => {
  test("patch without token", () => {
    const mockedUrl = `${baseUrl}/${basePatch}`;
    // Mock server
    axios.patch.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.patch(mockedUrl, mockedBody).then((data) => {
      expect(axios.patch).toBeCalledTimes(1);
      expect(axios.patch).toBeCalledWith(mockedUrl, mockedBody, {});
      expect(data).toEqual(mockedSuccessData);
    });
  });
  test("patch with token", () => {
    const mockedUrl = `${baseUrl}/${basePatch}`;
    // Mock server
    axios.patch.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.patch(mockedUrl, mockedBody, mockedToken).then(
      (data) => {
        expect(axios.patch).toBeCalledTimes(1);
        expect(axios.patch).toBeCalledWith(
          mockedUrl,
          mockedBody,
          combineConfig(mockedToken, {})
        );
        expect(data).toEqual(mockedSuccessData);
      }
    );
  });
  test("patch with token adn config", () => {
    const mockedUrl = `${baseUrl}/${basePatch}`;
    // Mock server
    axios.patch.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.patch(
      mockedUrl,
      mockedBody,
      mockedToken,
      mockedConfig
    ).then((data) => {
      expect(axios.patch).toBeCalledTimes(1);
      expect(axios.patch).toBeCalledWith(
        mockedUrl,
        mockedBody,
        combineConfig(mockedToken, mockedConfig)
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
});

describe("delete", () => {
  test("delete without token", () => {
    const mockedUrl = `${baseUrl}/${baseDelete}`;
    // Mock server
    axios.delete.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.delete(mockedUrl, mockedBody).then((data) => {
      expect(axios.delete).toBeCalledTimes(1);
      expect(axios.delete).toBeCalledWith(mockedUrl, mockedBody, {});
      expect(data).toEqual(mockedSuccessData);
    });
  });
  test("delete with token", () => {
    const mockedUrl = `${baseUrl}/${baseDelete}`;
    // Mock server
    axios.delete.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.delete(mockedUrl, mockedBody, mockedToken).then(
      (data) => {
        expect(axios.delete).toBeCalledTimes(1);
        expect(axios.delete).toBeCalledWith(
          mockedUrl,
          mockedBody,
          combineConfig(mockedToken, {})
        );
        expect(data).toEqual(mockedSuccessData);
      }
    );
  });
  test("delete with token and config", () => {
    const mockedUrl = `${baseUrl}/${baseDelete}`;
    // Mock server
    axios.delete.mockImplementation((url, body, config) =>
      Promise.resolve(mockedSuccessData)
    );
    // Request
    return RestService.delete(
      mockedUrl,
      mockedBody,
      mockedToken,
      mockedConfig
    ).then((data) => {
      expect(axios.delete).toBeCalledTimes(1);
      expect(axios.delete).toBeCalledWith(
        mockedUrl,
        mockedBody,
        combineConfig(mockedToken, mockedConfig)
      );
      expect(data).toEqual(mockedSuccessData);
    });
  });
});
