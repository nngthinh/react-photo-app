import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import base64 from "base-64";
import { notifyNegative, notifyPositive } from "components/Common/Toast";
import { validateDescription, validateImageUrl } from "utils/validations/items";
import { ButtonItem, InputItem } from "components/Common/Items";
import {
  createItemAction,
  viewItemAction,
  updateItemAction,
  clearItemAction,
} from "actions/items";
import { UserInputAction } from "constants/actions";
import { ErrorImg, InitialImg } from "assets/images";
import "./index.css";

const ItemAction = ({ type }) => {
  const { categoryId, itemId } = useParams();
  // Logged in is required in this page
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userInfo = useSelector((state) => state.user.info);
  const itemDetail = useSelector((state) => state.items.detail);

  const dispatch = useDispatch();
  // Items actions
  const dispatchCreateItem = (categoryId, description, imageUrl) =>
    dispatch(createItemAction(categoryId, description, imageUrl));
  const dispatchUpdateItem = (categoryId, itemId, description, imageUrl) =>
    dispatch(updateItemAction(categoryId, itemId, description, imageUrl));

  const navigate = useNavigate();
  const location = useLocation();

  // In adding category, no operation is required in advance
  // In editing category, we need to fetch it's data
  useEffect(() => {
    const navigateWithNextUrl = (pathname) => {
      const nextUrl = base64.encode(
        `${location.pathname}${location.search}${location.hash}`
      );
      navigate(
        { pathname, search: createSearchParams({ next: nextUrl }).toString() },
        { replace: true }
      );
    };

    if (!isLoggedIn) {
      navigateWithNextUrl("/signin");
    } else if (type === UserInputAction.TYPE_EDIT) {
      const getItemInfo = async () => {
        const viewItemDetailResult = await dispatch(
          viewItemAction(categoryId, itemId)
        );
        if (!viewItemDetailResult.success) {
          notifyNegative(viewItemDetailResult.error.message);
        } else {
          const itemDetail = viewItemDetailResult.data;
          if (itemDetail.author.id !== userInfo?.id) {
            notifyNegative(
              "You are not allowed to perform that operation. Please try using another account."
            );
            navigate(
              { pathname: `/categories/${categoryId}/items/${itemId}` },
              { replace: true }
            );
          }
        }
      };
      getItemInfo();
    }

    return () => {
      dispatch(clearItemAction());
    };
  }, [
    categoryId,
    dispatch,
    isLoggedIn,
    itemId,
    location.hash,
    location.pathname,
    location.search,
    navigate,
    type,
    userInfo?.id, // Note
  ]);

  return (
    <ItemActionView
      type={type}
      categoryId={categoryId}
      itemId={itemId}
      itemDetail={itemDetail}
      onCreateItem={dispatchCreateItem}
      onUpdateItem={dispatchUpdateItem}
    ></ItemActionView>
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
        case UserInputAction.ON_CHANGE:
          return {
            value: descriptionAction.value,
            error: null,
          };
        case UserInputAction.ON_VALIDATE:
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
        case UserInputAction.ON_CHANGE:
          return {
            value: imageUrlAction.value,
            error: null,
          };
        case UserInputAction.ON_VALIDATE:
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
    setImageUrl({
      type: UserInputAction.ON_CHANGE,
      value: itemDetail?.imageUrl ?? "",
    });
    setDescription({
      type: UserInputAction.ON_CHANGE,
      value: itemDetail?.description ?? "",
    });
  }, [itemDetail?.description, itemDetail?.imageUrl]);

  const navigate = useNavigate();

  // On action
  const handleSubmit = async (e) => {
    // Both two actions requires the same validations
    if (
      validateDescription(description.value) ||
      validateImageUrl(imageUrl.value)
    ) {
      setDescription({ type: UserInputAction.ON_VALIDATE });
      setImageUrl({ type: UserInputAction.ON_VALIDATE });
      return;
    }

    // Add item
    if (type === UserInputAction.TYPE_ADD) {
      const createItem = async () => {
        setIsSubmitting(true);
        const createItemResult = await onCreateItem(
          categoryId,
          description.value,
          imageUrl.value
        );
        setIsSubmitting(false);
        if (createItemResult.success) {
          notifyPositive("Create item successfully.");
          navigate(`/categories/${categoryId}`);
        } else {
          if (createItemResult.error.data) {
            const errors = createItemResult.error;
            setDescription({
              type: UserInputAction.ON_VALIDATE,
              error: errors.description[0],
            });
            setImageUrl({
              type: UserInputAction.ON_VALIDATE,
              error: errors.imageUrl[0],
            });
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
        setIsSubmitting(true);
        const updateItemResult = await onUpdateItem(
          categoryId,
          itemId,
          description.value,
          imageUrl.value
        );
        setIsSubmitting(false);
        if (updateItemResult.success) {
          notifyPositive("Update item successfully.");
          navigate(`/categories/${categoryId}/items/${itemId}`);
        } else {
          if (updateItemResult.error.data) {
            const errors = updateItemResult.error;
            setDescription({
              type: UserInputAction.ON_VALIDATE,
              error: errors.description[0],
            });
            setImageUrl({
              type: UserInputAction.ON_VALIDATE,
              error: errors.imageUrl[0],
            });
          } else {
            notifyNegative(updateItemResult.error.message);
          }
        }
      };
      await updateItem();
    }
  };

  return (
    <div className="itemAction">
      <div className="itemActionWrapper container">
        <h1 className="u-marginBottomExtraLarge">
          {type === UserInputAction.TYPE_ADD ? "Create new item" : "Edit item"}
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
                setDescription({
                  type: UserInputAction.ON_CHANGE,
                  value: e.target.value,
                });
              }}
              handleOnBlur={(e) =>
                setDescription({ type: UserInputAction.ON_VALIDATE })
              }
              error={description.error}
              readOnly={isSubmitting}
            ></InputItem>
            <InputItem
              data-testid="imageUrl"
              className="u-marginBottomExtraSmall"
              type="text"
              value={imageUrl.value}
              placeholder={"Image URL"}
              handleOnChange={(e) => {
                setImageUrl({
                  type: UserInputAction.ON_CHANGE,
                  value: e.target.value,
                });
              }}
              handleOnBlur={(e) => {
                setImageUrl({ type: UserInputAction.ON_VALIDATE });
              }}
              error={imageUrl.error}
              readOnly={isSubmitting}
            ></InputItem>
          </div>
          <div className="u-sizeFull md:u-size3of12">
            <img
              data-testid="itemImageUrl"
              className="itemActionImg"
              src={imageUrl.value}
              alt={imageUrl.error ? "Cannot load the image" : "Waiting"}
              onError={({ currentTarget }) => {
                currentTarget.onError = null; // Prevent looping
                // Blank url
                if (imageUrl.value.length === 0) {
                  currentTarget.src = InitialImg;
                }
                // Wrong url resource
                else {
                  currentTarget.src = ErrorImg;
                  setImageUrl({
                    type: UserInputAction.ON_VALIDATE,
                    error: "Cannot load the image.",
                  });
                }
              }}
            ></img>
          </div>
        </div>
        <div className="buttonSection">
          <ButtonItem
            data-testid={
              type === UserInputAction.TYPE_ADD
                ? "addItemButton"
                : "editItemButton"
            }
            className="u-marginBottomTiny"
            value={
              type === UserInputAction.TYPE_ADD ? "Create item" : "Update item"
            }
            variant={type === UserInputAction.TYPE_ADD ? "primary" : "accent"}
            onClick={handleSubmit}
            isSubmitting={isSubmitting}
          ></ButtonItem>
        </div>
      </div>
    </div>
  );
};

export default ItemAction;
