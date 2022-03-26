import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  createSearchParams,
} from "react-router-dom";
import {
  createCategoryAction,
  viewCategoryAction,
  updateCategoryAction,
} from "actions/categories";
import { notifyNegative, notifyPositive } from "components/Common/Toast";
import {
  validateDescription,
  validateImageUrl,
  validateName,
} from "utils/validations/categories";
import { ButtonItem, InputItem } from "components/Common/Items";
import base64 from "base-64";
import "./index.css";

const CategoryAction = ({ type }) => {
  const { categoryId } = useParams();
  // Logged in is required in this page
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const categoryDetail = useSelector((state) => state.categories.detail);

  const dispatch = useDispatch();
  const dispatchCreateCategory = (name, description, imageUrl) =>
    dispatch(createCategoryAction(name, description, imageUrl));
  const dispatchUpdateCategory = (categoryId, name, description, imageUrl) =>
    dispatch(updateCategoryAction(categoryId, name, description, imageUrl));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      const nextUrl = base64.encode(
        `${location.pathname}${location.search}${location.hash}`
      );
      console.log(createSearchParams({ next: nextUrl }).toString());
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
      const getCategoryInfo = async () => {
        const viewCategoryDetailResult = await dispatch(
          viewCategoryAction(categoryId)
        );
        if (!viewCategoryDetailResult.success) {
          notifyNegative(viewCategoryDetailResult.error.message);
        }
      };
      getCategoryInfo();
    }
  });

  return (
    isLoggedIn &&
    (type === "add" ? (
      <CategoryActionView
        type="add"
        onCreateCategory={dispatchCreateCategory}
      ></CategoryActionView>
    ) : (
      <CategoryActionView
        type="edit"
        categoryId={categoryId}
        categoryDetail={categoryDetail}
        onUpdateCategory={dispatchUpdateCategory}
      ></CategoryActionView>
    ))
  );
};

const CategoryActionView = ({
  type,
  categoryId,
  categoryDetail,
  onCreateCategory,
  onUpdateCategory,
}) => {
  // Input states
  const [name, setName] = useReducer(
    (name, nameAction) => {
      switch (nameAction.type) {
        case "ON_CHANGE":
          return {
            value: nameAction.value,
            error: null,
          };
        case "ON_VALIDATE":
          return {
            value: name.value,
            error: nameAction.error ?? validateName(name.value),
          };
        default:
          return { ...name };
      }
    },
    { value: "", error: null }
  );

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
    setImageUrl({ type: "ON_CHANGE", value: categoryDetail?.imageUrl ?? "" });
    setDescription({
      type: "ON_CHANGE",
      value: categoryDetail?.description ?? "",
    });
    setName({ type: "ON_CHANGE", value: categoryDetail?.name ?? "" });
  }, [
    categoryDetail?.description,
    categoryDetail?.imageUrl,
    categoryDetail?.name,
  ]);

  const navigate = useNavigate();

  // On action
  const handleSubmit = async (e) => {
    // Both two actions requires the same validations
    if (
      validateName(name.value) ||
      validateDescription(description.value) ||
      validateImageUrl(imageUrl.value)
    ) {
      setName({ type: "ON_VALIDATE" });
      setDescription({ type: "ON_VALIDATE" });
      setImageUrl({ type: "ON_VALIDATE" });
      return;
    }
    setIsSubmitting(true);
    // Add category
    if (type === "add") {
      const createCategory = async () => {
        const createCategoryResult = await onCreateCategory(
          name.value,
          description.value,
          imageUrl.value
        );
        if (createCategoryResult.success) {
          notifyPositive("Create category successfully.");
          navigate("/categories");
        } else {
          if (createCategoryResult.error.data) {
            const errors = createCategoryResult.error;
            setName({ type: "ON_VALIDATE", error: errors.name[0] });
            setDescription({
              type: "ON_VALIDATE",
              error: errors.description[0],
            });
            setImageUrl({ type: "ON_VALIDATE", error: errors.imageUrl[0] });
          } else {
            notifyNegative(createCategoryResult.error.message);
          }
        }
      };

      await createCategory();
    }

    // Update category
    else {
      const updateCategory = async () => {
        const updateCategoryResult = await onUpdateCategory(
          categoryId,
          name.value,
          description.value,
          imageUrl.value
        );
        if (updateCategoryResult.success) {
          notifyPositive("Update category successfully.");
          navigate(`/categories/${categoryId}`);
        } else {
          if (updateCategoryResult.error.data) {
            const errors = updateCategoryResult.error;
            setName({ type: "ON_VALIDATE", error: errors.name[0] });
            setDescription({
              type: "ON_VALIDATE",
              error: errors.description[0],
            });
            setImageUrl({ type: "ON_VALIDATE", error: errors.imageUrl[0] });
          } else {
            notifyNegative(updateCategoryResult.error.message);
          }
        }
      };

      await updateCategory();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="categoryAction container">
      <div className="categoryActionWrapper">
        <h1 className="u-marginBottomExtraLarge">
          {type === "add" ? "Create new category" : "Edit category"}
        </h1>
        <div className="inputSecion u-marginBottomLarge Grid">
          <div className="u-sizeFull md:u-size9of12 u-marginBottomMedium">
            <InputItem
              data-testid="name"
              className="u-marginBottomExtraSmall"
              type="text"
              value={name.value}
              placeholder={"Name"}
              handleOnChange={(e) => {
                setName({ type: "ON_CHANGE", value: e.target.value });
              }}
              handleOnBlur={(e) => setName({ type: "ON_VALIDATE" })}
              error={name.error}
              readOnly={isSubmitting}
            ></InputItem>
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
              className="categoryActionImg"
              src={imageUrl.value}
              alt={imageUrl.error ? "Somethings went wrong" : "Waiting"}
            ></img>
          </div>
        </div>
        <div className="buttonSection">
          <ButtonItem
            data-testid="categoryActionButton"
            className="u-marginBottomTiny"
            value={type === "add" ? "Create category" : "Update category"}
            variant={type === "add" ? "primary" : "accent"}
            onClick={handleSubmit}
            isSubmitting={isSubmitting}
          ></ButtonItem>
        </div>
      </div>
    </div>
  );
};

export default CategoryAction;
