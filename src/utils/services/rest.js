import * as axios from "axios";
import {
  convertCamelToSnakeJSON,
  convertSnakeToCamelJSON,
} from "utils/services/convertJson";
import { loadState } from "./localStorage";

// Rest service with Beaer supported
export class RestService {
  // Generate the new config with bearer token in the header field
  static #addTokenToConfigs = (config = {}, token) => {
    if (typeof token === "string" && token.length > 0) {
      return {
        ...config,
        headers: {
          ...config["headers"],
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return config;
  };

  static #getToken = () => loadState()?.token ?? "";

  // All RESTful services
  // - Without token
  static async get(url, config = {}) {
    try {
      const result = await axios.get(url, config);
      return convertSnakeToCamelJSON(result);
    } catch (error) {
      throw error;
    }
  }

  static async post(url, body, config = {}) {
    try {
      const result = await axios.post(
        url,
        convertCamelToSnakeJSON(body),
        config
      );
      return convertSnakeToCamelJSON(result);
    } catch (error) {
      throw error;
    }
  }

  static async getWithToken(url, config = {}) {
    const token = RestService.#getToken();
    const finalConfig = RestService.#addTokenToConfigs(config, token);
    try {
      const result = await axios.get(url, finalConfig);
      return convertSnakeToCamelJSON(result);
    } catch (error) {
      throw error;
    }
  }

  static async postWithToken(url, body, config = {}) {
    const token = RestService.#getToken();
    const finalConfig = RestService.#addTokenToConfigs(config, token);
    try {
      const result = await axios.post(
        url,
        convertCamelToSnakeJSON(body),
        finalConfig
      );
      return convertSnakeToCamelJSON(result);
    } catch (error) {
      throw error;
    }
  }
}
