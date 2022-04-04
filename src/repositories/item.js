import { baseUrl } from "configuration";
import RestService from "utils/services/rest";

class ItemsRepository {
  static async viewItems(categoryId, offset, limit) {
    const url = `${baseUrl}/categories/${categoryId}/items?offset=${offset}&limit=${limit}`;
    try {
      const result = await RestService.get(url);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async createItem(categoryId, description, imageUrl) {
    const url = `${baseUrl}/categories/${categoryId}/items`;
    const body = { description, imageUrl };

    try {
      const result = await RestService.postWithToken(url, body);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async viewItem(categoryId, itemId) {
    const url = `${baseUrl}/categories/${categoryId}/items/${itemId}`;
    try {
      const result = await RestService.get(url);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateItem(categoryId, itemId, description, imageUrl) {
    const url = `${baseUrl}/categories/${categoryId}/items/${itemId}`;
    const body = { description, imageUrl };
    try {
      const result = await RestService.putWithToken(url, body);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteItem(categoryId, itemId) {
    const url = `${baseUrl}/categories/${categoryId}/items/${itemId}`;
    try {
      const result = await RestService.deleteWithToken(url);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default ItemsRepository;
