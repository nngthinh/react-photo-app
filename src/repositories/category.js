import { baseUrl } from "constants/apiUrl";
const { RestService } = require("utils/services/rest");

class Category {
  static async createCategory(name, description, image_url) {
    const url = `${baseUrl}/categories`;
    const body = {
      name: name,
      description: description,
      imageUrl: url,
    };
    
    try {
      const result = await RestService.postWithToken(url, body);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async viewCateogries(offset, limit) {
    const url = `${baseUrl}/categories?offset=${offset}&limit=${limit}`;
    try {
      const result = await 
    }
  }
}
