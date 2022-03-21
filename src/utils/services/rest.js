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

  // Authorized token
  static #getToken = () => loadState()?.user?.token ?? "";

  // All RESTful APIs
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
    try {
      const token = RestService.#getToken();
      const finalConfig = RestService.#addTokenToConfigs(config, token);
      const result = await axios.get(url, finalConfig);
      return convertSnakeToCamelJSON(result);
    } catch (error) {
      throw error;
    }
  }

  static async postWithToken(url, body, config = {}) {
    try {
      const token = RestService.#getToken();
      const finalConfig = RestService.#addTokenToConfigs(config, token);
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

  static async putWithToken(url, body, config = {}) {
    try {
      const token = RestService.#getToken();
      const finalConfig = RestService.#addTokenToConfigs(config, token);
      const result = await axios.put(
        url,
        convertCamelToSnakeJSON(body),
        finalConfig
      );
      return convertSnakeToCamelJSON(result);
    } catch (error) {
      throw error;
    }
  }

  static async deleteWithToken(url, config = {}) {
    try {
      const token = RestService.#getToken();
      const finalConfig = RestService.#addTokenToConfigs(config, token);
      const result = await axios.delete(url, finalConfig);
      return convertSnakeToCamelJSON(result);
    } catch (error) {
      throw error;
    }
  }
}
