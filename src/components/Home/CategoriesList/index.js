import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaginationItem } from "components/Common/Items";
import { notifyNegative } from "components/Common/Toast";
import { viewCategoriesListAction } from "actions/categories";
import { Link, useSearchParams } from "react-router-dom";
import { limitCategories } from "constants/pagination";
import { Icon } from "@ahaui/react";

const CategoriesList = () => {
  const categoriesPaginationTotal = useSelector(
    (state) => state.categories.pagination.total
  );
  const categoriesList = useSelector((state) => state.categories.list);
  const dispatch = useDispatch();

  // Can use useLocation, useNavigate and URLSearchParams
  // const location = useLocation();
  // const navigate = useNavigate();
  // const searchParams = new URLSearchParams(location.search);
  const [searchParams] = useSearchParams();
  let page = parseInt(searchParams.get("page") ?? 1);

  // Fetch the categories list
  useEffect(() => {
    // Get from server
    const getCategoriesList = async () => {
      const [offset, limit] = [limitCategories * (page - 1), limitCategories];
      const viewCategoriesListResult = await dispatch(
        viewCategoriesListAction(offset, limit)
      );

      if (!viewCategoriesListResult.success) {
        notifyNegative(viewCategoriesListResult.error.message);
      }
    };
    getCategoriesList();
  }, [dispatch, page]);

  return (
    page > 0 && (
      <CategoriesListView
        categoryPagination={{
          maxIndex: categoriesPaginationTotal ?? 0,
          currentIndex: page,
        }}
        categoriesList={categoriesList}
      />
    )
  );
};

const CategoriesListView = ({ categoryPagination, categoriesList = [] }) => {
  return (
    <>
      <div>Categories List</div>
      <PaginationItem {...categoryPagination}></PaginationItem>
      <Link to={`/categories/add`}>
        <Icon size="medium" name="create" data-testid="createCategoryButton" />
      </Link>

      {categoriesList.length && (
        <ul>
          {categoriesList.map((category) => (
            <li key={category.id}>
              <Link to={`/categories/${category.id}`}>
                <h1>{category.name}</h1>
                <div>{category.description}</div>
                <img src={category.imageUrl} alt={category.name} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default CategoriesList;
