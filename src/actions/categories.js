import { CategoriesAction } from "constants/actions";
import CategoriesRepository from "repositories/category";

const viewCategoriesListAction = (offset, limit) => ({
  pendingActionType: CategoriesAction.PENDING_VIEW_CATEGORIES,
  pendingAction: async () => CategoriesRepository.viewCateogries(offset, limit),
});

const createCategoryAction = (name, description, imageUrl) => ({
  pendingActionType: CategoriesAction.PENDING_CREATE_CATEGORY,
  pendingAction: async () =>
    CategoriesRepository.createCategory(name, description, imageUrl),
});

const viewCategoryAction = (categoryId) => ({
  pendingActionType: CategoriesAction.PENDING_VIEW_CATEGORY,
  pendingAction: async () => CategoriesRepository.viewCategory(categoryId),
});

const updateCategoryAction = (categoryId, name, description, imageUrl) => ({
  pendingActionType: CategoriesAction.PENDING_UPDATE_CATEGORY,
  pendingAction: async () =>
    CategoriesRepository.updateCategory(
      categoryId,
      name,
      description,
      imageUrl
    ),
});

const clearCategoryAction = () => ({
  type: CategoriesAction.CLEAR_CATEGORY_INFO,
});

export {
  viewCategoriesListAction,
  createCategoryAction,
  viewCategoryAction,
  updateCategoryAction,
  clearCategoryAction,
};
