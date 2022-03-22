import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaginationItem } from "components/Common/Items";
import { notifyNegative } from "components/Common/Toast";
import { viewCategoriesListAction } from "actions/categories";
import { Link, useSearchParams } from "react-router-dom";
import { limitCategories } from "constants/pagination";

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
  const [searchParams, setSearchParams] = useSearchParams();
  let page = parseInt(searchParams.get("page") ?? 0);

  // Fetch the categories list
  useEffect(() => {
    // Default page is 0
    if (page < 1) {
      setSearchParams({ page: 1 });
    } else {
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
    }
  }, [dispatch, page, setSearchParams]);

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
      <PaginationItem {...categoryPagination}></PaginationItem>
      <div>Categories List</div>
      {Array.isArray(categoriesList) && categoriesList.length > 0 && (
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
