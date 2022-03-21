import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaginationItem } from "../Items";
import { viewCategoriesListAction } from "actions/categories";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { notifyNegative } from "../Toast";

const Sidebar = () => {
  const [paginationLimit, paginationTotal] = useSelector((state) => [
    state.categories.pagination.limit,
    state.categories.pagination.total,
  ]);
  const categoriesData = useSelector((state) => state.categories.data);
  const dispatch = useDispatch();

  // Get page from URL search params
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  let page = searchParams.get("page");
  // Default page is 0
  if (page === null) {
    navigate(`./?page=${0}`);
  }
  page = parseInt(page);
  // Fetch the categories list
  useEffect(() => {
    // Get from server
    const getCategoriesList = async () => {
      const [offset, limit] = [paginationLimit * (page - 1), paginationLimit];
      const viewCategoriesListResult = await dispatch(
        viewCategoriesListAction(offset, limit)
      );

      if (!viewCategoriesListResult.success) {
        notifyNegative(viewCategoriesListResult.error);
      }
    };
    getCategoriesList();
  }, [paginationLimit, dispatch, navigate, page]);

  return (
    <SidebarView
      categoryPagination={{
        maxIndex: paginationTotal,
        currentIndex: page,
      }}
      categoriesList={categoriesData}
    />
  );
};

const SidebarView = ({
  mode = "collapsed",
  categoryPagination,
  categoriesList,
}) => {
  return (
    <>
      <PaginationItem {...categoryPagination}></PaginationItem>
      <div className="categories">
        <div className="categoriesWrapper"></div>
      </div>
    </>
    // <div className="sidebar">
    //   <title>Category</title>
    //   <ul>
    //     {categoriesList.map((category) => (
    //       <li key={category.id}>{category.name}</li>
    //     ))}
    //   </ul>
    // </div>
  );
};

export default Sidebar;
