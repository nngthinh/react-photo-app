import { baseUrl } from "constants/apiUrl";
const { RestService } = require("utils/services/rest");

class UserRepository {
  static signIn(email, password) {
    const url = `${baseUrl}/auth`;
    const body = {
      email: email,
      password: password,
    };
    RestService.post(url, body)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  }

  static signUp(name, email, password) {
    const url = `${baseUrl}/users`;
    const body = {
      email: email,
      password: password,
      name: name,
    };
    RestService.post(url, body)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  }

  static signOut() {
    // Just detele user token because ... BE didn't have that service -_-
  }

  static getUserInfo() {
    const url = `${baseUrl}/users/me`;
    // Get token from local storage
    RestService.get(url)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  }
}

export default UserRepository;
