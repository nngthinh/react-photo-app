import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { notifyNegative, notifyPositive } from "components/Common/Toast";
import { validateDescription, validateImageUrl } from "utils/validations/items";
import { ButtonItem, InputItem } from "components/Common/Items";
import {
  createItemAction,
  viewItemAction,
  updateItemAction,
} from "actions/items";
import { setLaterUrlAction } from "actions/user";

const ItemAction = ({ type }) => {
  const { categoryId, itemId } = useParams();
  // Logged in is required in this page
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const itemDetail = useSelector((state) => state.items.detail);

  const dispatch = useDispatch();
  // Items actions
  const dispatchCreateItem = (categoryId, description, imageUrl) =>
    dispatch(createItemAction(categoryId, description, imageUrl));
  const dispatchUpdateItem = (categoryId, itemId, description, imageUrl) =>
    dispatch(updateItemAction(categoryId, itemId, description, imageUrl));

  const navigate = useNavigate();
  const location = useLocation();

  // Auto navigate to sign in
  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(
        setLaterUrlAction(
          `${location.pathname}${location.search}${location.hash}` // Store current URL for later redirection
        )
      );
      navigate("/signin", { replace: true });
    }
  });

  // In adding category, no operation is required in advance
  // In editing category, we need to fetch it's data
  useEffect(() => {
    if (type === "edit") {
      const getItemInfo = async () => {
        const viewItemDetailResult = await dispatch(
          viewItemAction(categoryId, itemId)
        );
        if (!viewItemDetailResult.success) {
          notifyNegative(viewItemDetailResult.error.message);
        }
      };
      getItemInfo();
    }
  }, [categoryId, dispatch, itemId, type]);

  return (
    isLoggedIn &&
    (type === "add" ? (
      <CategoryActionView
        type="add"
        categoryId={categoryId}
        onCreateItem={dispatchCreateItem}
      ></CategoryActionView>
    ) : (
      <CategoryActionView
        type="edit"
        categoryId={categoryId}
        itemId={itemId}
        itemDetail={itemDetail}
        onUpdateItem={dispatchUpdateItem}
      ></CategoryActionView>
    ))
  );
};

const CategoryActionView = ({
  type,
  categoryId,
  itemId,
  itemDetail = {},
  onCreateItem,
  onUpdateItem,
} = {}) => {
  // Input states

  const [description, setDescription] = useReducer(
    (description, descriptionAction) => {
      switch (descriptionAction.type) {
        case "ON_CHANGE":
          return {
            value: descriptionAction.value,
            error: null,
          };
        case "ON_VALIDATE":
          return {
            value: description.value,
            error:
              descriptionAction.error ?? validateDescription(description.value),
          };
        default:
          return { ...description };
      }
    },
    { value: itemDetail.description ?? "", error: null }
  );

  const [imageUrl, setImageUrl] = useReducer(
    (imageUrl, imageUrlAction) => {
      switch (imageUrlAction.type) {
        case "ON_CHANGE":
          return {
            value: imageUrlAction.value,
            error: null,
          };
        case "ON_VALIDATE":
          return {
            value: imageUrl.value,
            error: imageUrlAction.error ?? validateImageUrl(imageUrl.value),
          };
        default:
          return { ...imageUrl };
      }
    },
    { value: itemDetail.imageUrl ?? "", errors: null }
  );

  const navigate = useNavigate();

  // On action
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Both two actions requires the same validations
    if (
      validateDescription(description.value) ||
      validateImageUrl(imageUrl.value)
    ) {
      setDescription({ type: "ON_VALIDATE" });
      setImageUrl({ type: "ON_VALIDATE" });
      return;
    }

    // Add item
    if (type === "add") {
      const createItem = async () => {
        const createItemResult = await onCreateItem(
          categoryId,
          description.value,
          imageUrl.value
        );
        if (createItemResult.success) {
          notifyPositive("Create item successfully.");
          navigate(-1);
        } else {
          if (createItemResult.error.data) {
            const errors = createItemResult.error;
            setDescription({
              type: "ON_VALIDATE",
              error: errors.description[0],
            });
            setImageUrl({ type: "ON_VALIDATE", error: errors.imageUrl[0] });
          } else {
            notifyNegative(createItemResult.error.message);
          }
        }
      };

      createItem();
    }

    // Update item
    else {
      const updateItem = async () => {
        const updateItemResult = await onUpdateItem(
          categoryId,
          itemId,
          description.value,
          imageUrl.value
        );
        if (updateItemResult.success) {
          notifyPositive("Update item successfully.");
          navigate(-1);
        } else {
          if (updateItemResult.error.data) {
            const errors = updateItemResult.error;
            setDescription({
              type: "ON_VALIDATE",
              error: errors.description[0],
            });
            setImageUrl({ type: "ON_VALIDATE", error: errors.imageUrl[0] });
          } else {
            notifyNegative(updateItemResult.error.message);
          }
        }
      };

      updateItem();
    }
  };

  return (
    <div className="itemAction">
      <div className="itemActionWrapper">
        <h1 className="u-marginBottomExtraLarge">
          {type === "add" ? "Create new item" : "Edit item"}
        </h1>
        <form id="itemActionForm" onSubmit={handleSubmit}>
          <div className="inputSecion u-marginBottomLarge">
            <InputItem
              data-testid="description"
              className="u-marginBottomExtraSmall"
              type="text"
              value={description.value}
              placeholder={"Description"}
              handleOnChange={(e) => {
                setDescription({ type: "ON_CHANGE", value: e.target.value });
              }}
              handleOnBlur={(e) => setDescription({ type: "ON_VALIDATE" })}
              error={description.error}
            ></InputItem>
            <InputItem
              data-testid="password"
              className="u-marginBottomExtraSmall"
              type="text"
              value={imageUrl.value}
              placeholder={"Image URL"}
              handleOnChange={(e) => {
                setImageUrl({ type: "ON_CHANGE", value: e.target.value });
              }}
              handleOnBlur={(e) => {
                setImageUrl({ type: "ON_VALIDATE" });
              }}
              error={imageUrl.error}
            ></InputItem>
            <img
              src={imageUrl.value}
              alt={imageUrl.error ? "Somethings went wrong" : "Waiting"}
            ></img>
          </div>
        </form>
        <div className="buttonSection">
          <ButtonItem
            data-testid="itemActionButton"
            className="u-marginBottomTiny"
            value={type === "add" ? "Create item" : "Update item"}
            type="submit"
            form="itemActionForm"
          ></ButtonItem>
        </div>
      </div>
    </div>
  );
};

export default ItemAction;
