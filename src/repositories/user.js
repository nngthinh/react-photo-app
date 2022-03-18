import { baseUrl } from "constants/apiUrl";
const { RestService } = require("utils/services/rest");

class UserRepository {
  static async signIn(email, password) {
    const url = `${baseUrl}/auth`;
    const body = {
      email: email,
      password: password,
    };
    try {
      const result = await RestService.post(url, body);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async signUp(name, email, password) {
    const url = `${baseUrl}/users`;
    const body = {
      email: email,
      password: password,
      name: name,
    };
    try {
      const result = await RestService.post(url, body);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async signOut() {
    // Didn't have sign out api.
    return setTimeout(() => Promise.resolve(), 500);
  }

  static async getUserInfo() {
    const url = `${baseUrl}/users/me`;
    // Get token from local storage
    try {
      const result = await RestService.getWithToken(url);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
