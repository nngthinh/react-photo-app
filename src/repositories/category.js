import { baseUrl } from "constants/apiUrl";
const { RestService } = require("utils/services/rest");

class CategoriesRepository {
  static async viewCateogries(offset, limit) {
    const url = `${baseUrl}/categories?offset=${offset}&limit=${limit}`;
    try {
      const result = await RestService.getWithToken(url);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async createCategory(name, description, imageUrl) {
    const url = `${baseUrl}/categories`;
    const body = { name, description, imageUrl };

    try {
      const result = await RestService.postWithToken(url, body);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async viewCategory(categoryId) {
    const url = `${baseUrl}/categories/${categoryId}`;
    try {
      const result = await RestService.getWithToken(url);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateCategory(categoryId, name, description, imageUrl) {
    const url = `${baseUrl}/categories/${categoryId}`;
    const body = { name, description, imageUrl };
    try {
      const result = await RestService.putWithToken(url, body);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default CategoriesRepository;
