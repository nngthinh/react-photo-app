import * as axios from "axios";

// Rest service with Beaer supported
class RestBearerService {
  // Generate the new config with bearer token in the header field
  static #addTokenToConfig = (config, token) => {
    if (typeof token === "string" && token.length > 0) {
      return {
        ...config,
        headers: { ...config["headers"], Authorization: `Bearer ${token}` },
      };
    }
    return config;
  };

  // All RESTful services
  static async get(url, token = "", otherConfigs = {}) {
    config = RestBearerService.#addTokenToConfig(otherConfigs, token);
    return await axios.get(url, config);
  }

  static async post(url, body, token = "", otherConfigs = {}) {
    config = RestBearerService.#addTokenToConfig(otherConfigs, token);
    return await axios.post(url, body, config);
  }

  static async put(url, body, token = "", otherConfigs = {}) {
    config = RestBearerService.#addTokenToConfig(otherConfigs, token);
    return await axios.put(url, body);
  }

  static async patch(url, body, token = "", otherConfigs = {}) {
    config = RestBearerService.#addTokenToConfig(otherConfigs, token);
    return await axios.patch(url, body);
  }

  static async delete(url, body, token = "", otherConfigs = {}) {
    config = RestBearerService.#addTokenToConfig(otherConfigs, token);
    return await axios.delete(url, body);
  }
}
