import { deleteItemAction, viewItemAction } from "actions/items";
import { notifyNegative, notifyPositive } from "components/Common/Toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@ahaui/react";
import { clearModalAction, showModalAction } from "actions/modal";

const ItemDetail = () => {
  const { categoryId, itemId } = useParams();
  const userInfo = useSelector((state) => state.user.info);
  const itemDetail = useSelector((state) => state.items.detail);
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
        notifyNegative(viewItemDetailResult.error.message);
      }
    };
    viewItemDetail();
  }, [categoryId, dispatch, itemId]);

  return (
    <ItemDetailView
      userInfo={userInfo}
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

  return (
    <>
      <div className="itemDetail">
        <div className="itemDetailWrapper">
          <div>{description}</div>
          <img src={imageUrl} alt={description} />
          {userInfo?.id === author?.id ? (
            <>
              <Link to={`/categories/${categoryId}/items/${itemId}/edit`}>
                <Icon size="small" name="edit" />
              </Link>
              <button onClick={() => handleDeleteItem()}>
                <Icon size="medium" name="trash" />
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
