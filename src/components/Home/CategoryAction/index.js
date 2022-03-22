import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategoryAction,
  viewCategoryAction,
  updateCategoryAction,
} from "actions/categories";

const CategoryAction = ({ type }) => {
  const { categoryId } = useParams();
  // Required logged in in this page
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin");
    }
    // In adding category, no operation is required in advance
    // In editing category, we need to fetch it's data
    else if (type === "edit") {
      const getCategoryInfo = async () => {
        await dispatch(viewCategoryAction(categoryId));
      };
      getCategoryInfo();
    }
  }, [categoryId, dispatch, isLoggedIn, navigate, type]);

  return type === "add" ? (
    <CategoryActionView type="add"></CategoryActionView>
  ) : (
    <CategoryActionView type="edit"></CategoryActionView>
  );
};

const CategoryActionView = ({ type }) => {
  return (
    <div className="categoryAction">
      <div className="categoryActionWrapper"></div>
    </div>
  );
};

export default CategoryAction;
