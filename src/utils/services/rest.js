import * as axios from "axios";
import {
  convertCamelToSnakeJSON,
  convertSnakeToCamelJSON,
} from "utils/helpers/convertJson";
import { loadState } from "./localStorage";

// Rest service with Beaer supported
export default class RestService {
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

  // Get authorization token
  static #getToken = () => loadState()?.user?.token ?? "";

  // Format body, response, error
  static #formatBody = (body) => {
    return convertCamelToSnakeJSON(body);
  };

  static #formatResponse = (response) => {
    return convertSnakeToCamelJSON(response);
  };

  static #formatError = (error) => {
    // Response from server
    if (error.response) {
      const errorData = error.response.data;
      return convertSnakeToCamelJSON(errorData);
    }
    // Other error (e.g undefined data)
    else {
      return { message: error };
    }
  };

  // All RESTful APIs
  static async get(url, config = {}) {
    try {
      const response = await axios.get(url, config);
      return RestService.#formatResponse(response);
    } catch (error) {
      throw RestService.#formatError(error);
    }
  }

  static async post(url, body, config = {}) {
    try {
      const response = await axios.post(
        url,
        convertCamelToSnakeJSON(body),
        config
      );
      return RestService.#formatResponse(response);
    } catch (error) {
      throw RestService.#formatError(error);
    }
  }

  static async getWithToken(url, config = {}) {
    try {
      const token = RestService.#getToken();
      const finalConfig = RestService.#addTokenToConfigs(config, token);
      const response = await axios.get(url, finalConfig);
      return RestService.#formatResponse(response);
    } catch (error) {
      throw RestService.#formatError(error);
    }
  }

  static async postWithToken(url, body, config = {}) {
    try {
      const token = RestService.#getToken();
      const finalConfig = RestService.#addTokenToConfigs(config, token);
      const response = await axios.post(
        url,
        convertCamelToSnakeJSON(body),
        finalConfig
      );
      return RestService.#formatResponse(response);
    } catch (error) {
      throw RestService.#formatError(error);
    }
  }

  static async putWithToken(url, body, config = {}) {
    try {
      const token = RestService.#getToken();
      const finalConfig = RestService.#addTokenToConfigs(config, token);
      const response = await axios.put(
        url,
        convertCamelToSnakeJSON(body),
        finalConfig
      );
      return RestService.#formatResponse(response);
    } catch (error) {
      throw RestService.#formatError(error);
    }
  }

  static async deleteWithToken(url, config = {}) {
    try {
      const token = RestService.#getToken();
      const finalConfig = RestService.#addTokenToConfigs(config, token);
      const response = await axios.delete(url, finalConfig);
      return RestService.#formatResponse(response);
    } catch (error) {
      throw RestService.#formatError(error);
    }
  }
}
