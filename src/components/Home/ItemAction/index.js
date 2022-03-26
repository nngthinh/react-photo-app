import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { notifyNegative, notifyPositive } from "components/Common/Toast";
import { validateDescription, validateImageUrl } from "utils/validations/items";
import { ButtonItem, InputItem } from "components/Common/Items";
import {
  createItemAction,
  viewItemAction,
  updateItemAction,
} from "actions/items";
import base64 from "base-64";
import "./index.css";

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
      const nextUrl = base64.encode(
        `${location.pathname}${location.search}${location.hash}`
      );
      navigate(
        {
          pathname: "/signin",
          search: createSearchParams({ next: nextUrl }).toString(),
        },
        { replace: true }
      );
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
  });

  return (
    isLoggedIn && (
      <ItemActionView
        type={type}
        categoryId={categoryId}
        itemId={itemId}
        itemDetail={itemDetail}
        onCreateItem={dispatchCreateItem}
        onUpdateItem={dispatchUpdateItem}
      ></ItemActionView>
    )
  );
};

const ItemActionView = ({
  type,
  categoryId,
  itemId,
  itemDetail,
  onCreateItem,
  onUpdateItem,
}) => {
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
    { value: "", error: null }
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
    { value: "", errors: null }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setImageUrl({ type: "ON_CHANGE", value: itemDetail?.imageUrl ?? "" });
    setDescription({ type: "ON_CHANGE", value: itemDetail?.description ?? "" });
  }, [itemDetail?.description, itemDetail?.imageUrl]);

  const navigate = useNavigate();

  // On action
  const handleSubmit = async (e) => {
    // Both two actions requires the same validations
    if (
      validateDescription(description.value) ||
      validateImageUrl(imageUrl.value)
    ) {
      setDescription({ type: "ON_VALIDATE" });
      setImageUrl({ type: "ON_VALIDATE" });
      return;
    }

    setIsSubmitting(true);

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
          navigate(`/categories/${categoryId}`);
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
      await createItem();
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
          navigate(`/category/${categoryId}/items/${itemId}`);
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
      await updateItem();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="itemAction container">
      <div className="itemActionWrapper">
        <h1 className="u-marginBottomExtraLarge">
          {type === "add" ? "Create new item" : "Edit item"}
        </h1>
        <div className="inputSecion u-marginBottomLarge Grid">
          <div className="u-sizeFull md:u-size9of12 u-marginBottomMedium">
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
              readOnly={isSubmitting}
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
              readOnly={isSubmitting}
            ></InputItem>
          </div>
          <div className="u-sizeFull md:u-size3of12">
            <img
              className="itemActionImg"
              src={imageUrl.value}
              alt={imageUrl.error ? "Somethings went wrong" : "Waiting"}
            ></img>
          </div>
        </div>
        <div className="buttonSection">
          <ButtonItem
            data-testid="itemActionButton"
            className="u-marginBottomTiny"
            value={type === "add" ? "Create item" : "Update item"}
            variant={type === "add" ? "primary" : "accent"}
            onClick={handleSubmit}
            isSubmitting={isSubmitting}
          ></ButtonItem>
        </div>
      </div>
    </div>
  );
};

export default ItemAction;
