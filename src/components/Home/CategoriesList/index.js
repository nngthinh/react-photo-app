import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaginationItem } from "components/Common/Items";
import { notifyNegative } from "components/Common/Toast";
import { viewCategoriesListAction } from "actions/categories";
import { useLocation, useNavigate } from "react-router-dom";
import { limitCategories } from "constants/pagination";

const CategoriesList = () => {
  const paginationTotal = useSelector(
    (state) => state.categories.pagination.total
  );
  const categoriesList = useSelector((state) => state.categories.data);
  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  // Get page from URL search params
  const searchParams = new URLSearchParams(location.search);
  let page = parseInt(searchParams.get("page") ?? 0);

  // Fetch the categories list
  useEffect(() => {
    // Default page is 0
    if (page < 1) {
      navigate("./?page=1");
    } else {
      // Get from server
      const getCategoriesList = async () => {
        const [offset, limit] = [limitCategories * (page - 1), limitCategories];
        const viewCategoriesListResult = await dispatch(
          viewCategoriesListAction(offset, limit)
        );

        if (!viewCategoriesListResult.success) {
          notifyNegative(viewCategoriesListResult.error);
        }
      };
      getCategoriesList();
    }
  }, [dispatch, navigate, location, page]);

  return (
    page > 0 && (
      <CategoriesListView
        categoryPagination={{
          minIndex: 1,
          maxIndex: paginationTotal,
          currentIndex: page,
          step: limitCategories,
        }}
        categoriesList={categoriesList}
      />
    )
  );
};

const CategoriesListView = ({ categoryPagination, categoriesList = [] }) => {
  console.log(categoriesList);
  return (
    <>
      <PaginationItem {...categoryPagination}></PaginationItem>
      <div>Categories List</div>
      <ul>
        {Array.isArray(categoriesList) &&
          categoriesList.map((category) => (
            <li key={category.id}>
              <h1>{category.name}</h1>
              <div>{category.description}</div>
              <img src={category.imageUrl} alt={category.name} />
            </li>
          ))}
      </ul>
    </>
  );
};

export default CategoriesList;
