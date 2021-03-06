import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@ahaui/react";
import { notifyNegative, notifyPositive } from "components/Common/Toast";
import { BreadcrumbItem, ButtonItem } from "components/Common/Items";
import {
  clearItemAction,
  deleteItemAction,
  viewItemAction,
} from "actions/items";
import { clearModalAction, showModalAction } from "actions/modal";
import { viewCategoryAction, clearCategoryAction } from "actions/categories";
import "./index.css";

const ItemDetail = () => {
  const { categoryId, itemId } = useParams();
  const userInfo = useSelector((state) => state.user.info);
  const itemDetail = useSelector((state) => state.items.detail);
  const categoryDetail = useSelector((state) => state.categories.detail);
  const dispatch = useDispatch();
  const dispatchShowModal = (content, props) =>
    dispatch(showModalAction(content, props));
  const dispatchClearModal = () => dispatch(clearModalAction());
  const dispatchDeleteItem = (categoryId, itemId) =>
    dispatch(deleteItemAction(categoryId, itemId));

  useEffect(() => {
    const viewItemDetail = async () => {
      const viewItemDetailResult = await dispatch(
        viewItemAction(categoryId, itemId)
      );
      if (!viewItemDetailResult.success) {
        if (viewItemDetailResult.skipError) return;
        notifyNegative(viewItemDetailResult.error.message);
      }
    };
    viewItemDetail();

    return () => {
      dispatch(clearItemAction());
    };
  }, [categoryId, dispatch, itemId]);

  useEffect(() => {
    const viewCategoryDetail = async () => {
      const viewCategoryDetailResult = await dispatch(
        viewCategoryAction(categoryId)
      );
      if (!viewCategoryDetailResult.success) {
        if (viewCategoryDetailResult.skipError) return;
        notifyNegative(viewCategoryDetailResult.error.message);
      }
    };
    viewCategoryDetail();

    return () => {
      dispatch(clearCategoryAction());
    };
  }, [categoryId, dispatch]);

  return (
    <ItemDetailView
      userInfo={userInfo}
      categoryDetail={categoryDetail}
      categoryId={categoryId}
      itemId={itemId}
      itemDetail={itemDetail}
      onDeleteItem={dispatchDeleteItem}
      onShowModal={dispatchShowModal}
      onClearModal={dispatchClearModal}
    ></ItemDetailView>
  );
};

const ItemDetailView = ({
  userInfo,
  categoryId,
  categoryDetail,
  itemId,
  itemDetail,
  onDeleteItem,
  onShowModal,
  onClearModal,
}) => {
  const { description, imageUrl, author } = itemDetail;

  const navigate = useNavigate();

  const handleDeleteItem = async () => {
    const deleteItem = async () => {
      const deleteItemResult = await onDeleteItem(categoryId, itemId);
      if (deleteItemResult.success) {
        navigate(`/categories/${categoryId}`);
        onClearModal();
        notifyPositive("Delete item successfully.");
      } else {
        if (deleteItemResult.skipError) return;
        notifyNegative(deleteItemResult.error.message);
      }
    };
    onShowModal(
      {
        title: "Delete item",
        body: "Are you sure you want to delete this item?",
        button1: "Cancel",
        button2: "Delete",
      },
      {
        modal: {
          onHide: () => onClearModal(),
        },
        header: {
          onHide: () => onClearModal(),
        },
        button1: {
          onClick: () => onClearModal(),
        },
        button2: {
          onClick: () => deleteItem(),
          variant: "accent",
        },
      }
    );
  };

  const navigateEditItem = (categoryId, itemId) => {
    navigate(`/categories/${categoryId}/items/${itemId}/edit`);
  };

  return (
    <>
      <div className="itemDetail">
        <div className="itemDetailWrapper container">
          <div className="u-marginVerticalMedium">
            {itemDetail && categoryDetail ? (
              <BreadcrumbItem
                items={[
                  {
                    id: 1,
                    name: "Home",
                    link: "/",
                  },
                  {
                    id: 2,
                    name: categoryDetail.name,
                    link: `/categories/${categoryId}`,
                  },
                  { id: 3, name: `Item ${itemDetail.id}`, link: "/" },
                ]}
              ></BreadcrumbItem>
            ) : (
              <Skeleton width="200px"></Skeleton>
            )}
          </div>

          <div className="u-flex u-flexColumn u-alignItemsCenter">
            <div className="u-sizeFull sm:u-sizeFull md:u-size4of12 lg:u-size4of12 u-marginBottomMedium">
              {imageUrl ? (
                <img
                  className="itemDetailImg"
                  src={imageUrl}
                  alt={description}
                  data-testid="image"
                />
              ) : (
                <div className="itemDetailImg">
                  <Skeleton width="100%" height="100%"></Skeleton>
                </div>
              )}
            </div>
            <div className="u-sizeFull u-marginBottomLarge">
              {description ? (
                <div className="u-textCenter" data-testid="description">
                  {description}
                </div>
              ) : (
                <div className="u-flex u-alignItemsCenter u-flexColumn">
                  <Skeleton width="80%"></Skeleton>
                  <Skeleton width="100%"></Skeleton>
                  <Skeleton width="60%"></Skeleton>
                </div>
              )}
            </div>

            {author ? (
              userInfo?.id === author?.id ? (
                <div className="u-flex">
                  <div className="u-marginRightExtraSmall">
                    <ButtonItem
                      size="medium"
                      width="auto"
                      value="Edit"
                      variant="accent"
                      icon="edit"
                      iconSize="small"
                      onClick={() => navigateEditItem(categoryId, itemId)}
                      data-testid="navigateEditItemButton"
                    ></ButtonItem>
                  </div>
                  <div>
                    <ButtonItem
                      size="medium"
                      width="auto"
                      value="Delete"
                      variant="negative_outline"
                      icon="trash"
                      iconSize="small"
                      onClick={() => handleDeleteItem()}
                      data-testid="deleteItemButton"
                    ></ButtonItem>
                  </div>
                </div>
              ) : (
                <div className="u-textGray u-textCenter" data-testid="author">
                  By {author?.name}
                </div>
              )
            ) : (
              <div className="u-sizeFull u-flex u-justifyContentCenter">
                <Skeleton width="20%"></Skeleton>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
