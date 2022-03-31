import { ItemsAction } from "constants/actions";
import ItemsRepository from "repositories/item";

const viewItemsListAction = (categoryId, offset, limit) => ({
  pendingActionType: ItemsAction.PENDING_VIEW_ITEMS,
  pendingAction: async () =>
    ItemsRepository.viewItems(categoryId, offset, limit),
});

const createItemAction = (categoryId, description, imageUrl) => ({
  pendingActionType: ItemsAction.PENDING_CREATE_ITEM,
  pendingAction: async () =>
    ItemsRepository.createItem(categoryId, description, imageUrl),
});

const viewItemAction = (categoryId, itemId) => ({
  pendingActionType: ItemsAction.PENDING_VIEW_ITEM,
  pendingAction: async () => ItemsRepository.viewItem(categoryId, itemId),
});

const updateItemAction = (categoryId, itemId, description, imageUrl) => ({
  pendingActionType: ItemsAction.PENDING_UPDATE_ITEM,
  pendingAction: async () =>
    ItemsRepository.updateItem(categoryId, itemId, description, imageUrl),
});

const deleteItemAction = (categoryId, itemId) => ({
  pendingActionType: ItemsAction.PENDING_DELETE_ITEM,
  pendingAction: async () => ItemsRepository.deleteItem(categoryId, itemId),
});

export {
  viewItemsListAction,
  createItemAction,
  viewItemAction,
  updateItemAction,
  deleteItemAction,
};
