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
      const res = await RestService.post(url, body);
      return res;
    } catch (err) {
      throw err;
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
      const res = await RestService.post(url, body);
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async signOut() {
    // Just detele user token because ... BE didn't have that service -_-
  }

  static async getUserInfo() {
    const url = `${baseUrl}/users/me`;
    // Get token from local storage
    try {
      const res = await RestService.get(url);
      return res;
    } catch (err) {
      throw err;
    }
  }
}

export default UserRepository;
