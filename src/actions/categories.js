import { KCategoriesAction } from "constants/actions";
import CategoriesRepository from "repositories/category";

const viewCategoriesAction = (offset, limit) => ({
    pendingActionType: KCategoriesAction.PENDING_VIEW_CATEGORIES,
    pendingAction: async () => CategoriesRepository.viewCateogries(offset, limit);
});

const createCategoryAction = (name, description, imageUrl) => ({
    pendingActionType: KCategoriesAction.PENDING_CREATE_CATEGORY,
    pendingActionL: async () => CategoriesRepository.createCategory(name, description, imageUrl)
});

const viewCategoryAction = (categoryId) => ({});
const updateCategoryAction = (categoryId, name, description, imageUrl) => ({});

export {viewCategoriesAction, createCategoryAction};