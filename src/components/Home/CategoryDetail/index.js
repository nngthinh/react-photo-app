import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewCategoryAction } from "actions/categories";
import { notifyNegative } from "components/Common/Toast";
import { Icon } from "@ahaui/react";
import ItemsList from "../ItemsList";

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const categoryDetail = useSelector((state) => state.categories.detail);
  const dispatch = useDispatch();

  useEffect(() => {
    const viewCategoryDetail = async () => {
      // get category detail
      const viewCategoyResult = await dispatch(viewCategoryAction(categoryId));
      if (!viewCategoyResult.success) {
        notifyNegative(viewCategoyResult.error.message);
      }
    };
    viewCategoryDetail();
  }, [categoryId, dispatch]);

  return (
    <CategoryDetailView
      categoryId={categoryId}
      categoryDetail={categoryDetail}
    ></CategoryDetailView>
  );
};

const CategoryDetailView = ({ categoryId, categoryDetail }) => {
  const { name, description, imageUrl } = categoryDetail;
  return (
    <>
      <div className="categoryDetail">
        <div className="categoryDetailWrapper">
          <h1>{name}</h1>
          <div>{description}</div>
          <img src={imageUrl} alt={name} />

          <Link to={`/categories/${categoryId}/edit`}>
            <Icon size="small" name="edit" />
          </Link>

          <ItemsList categoryId={categoryId}></ItemsList>
        </div>
      </div>
    </>
  );
};

export default CategoryDetail;
