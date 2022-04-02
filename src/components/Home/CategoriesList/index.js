import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton, Separator } from "@ahaui/react";
import { ButtonItem, PaginationItem } from "components/Common/Items";
import { notifyNegative } from "components/Common/Toast";
import CustomLimit from "constants/limit";
import { viewCategoriesListAction } from "actions/categories";
import { shortenContent } from "utils/helpers/content";
import CustomError from "constants/error";
import "./index.css";
import { useState } from "react";
import OfflinePage from "components/Common/Offline";

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
  let page =
    Array.from(searchParams).length === 0
      ? 1
      : parseInt(searchParams.get("page") ?? 0);

  const navigate = useNavigate();

  const [isOnLine, setIsOnLine] = useState(true);

  // Wrong page param
  useEffect(() => {
    if (page === 0) {
      // Navigate to default url
      navigate("/categories");
    }
  }, [navigate, page]);

  // Fetch the categories list
  useEffect(() => {
    const getCategoriesList = async () => {
      const [offset, limit] = [
        CustomLimit.CATEGORY_PAGINATION * (page - 1),
        CustomLimit.CATEGORY_PAGINATION,
      ];
      const viewCategoriesListResult = await dispatch(
        viewCategoriesListAction(offset, limit)
      );

      if (!viewCategoriesListResult.success) {
        if (
          String(
            viewCategoriesListResult.error.message.includes(
              CustomError.NETWORK_ERROR
            )
          )
        ) {
          setIsOnLine(false);
        } else {
          notifyNegative(viewCategoriesListResult.error.message);
        }
      }
    };
    getCategoriesList();
  }, [dispatch, page]);

  return isOnLine ? (
    <CategoriesListView
      categoryPagination={{
        maxIndex: categoriesPaginationTotal ?? 0,
        currentIndex: page,
      }}
      categoriesList={categoriesList}
    />
  ) : (
    <OfflinePage reconnect={() => navigate(0)} />
  );
};

const CategoriesListView = ({ categoryPagination, categoriesList = [] }) => {
  const navigate = useNavigate();
  const navigateCreateCategory = () => {
    navigate("/categories/add");
  };

  return (
    <div className="categoriesList">
      <div className="categoriesListWrapper container">
        <div className="u-marginBottomExtraLarge">
          <h1 className="u-textCenter">Topics</h1>
          <div className=" u-textCenter">What's your favorite one today?</div>
        </div>
        <Separator variant="lighter"></Separator>
        <div className="u-flex u-justifyContentBetween u-alignItemsCenter">
          <div className="createCategoryButton">
            <ButtonItem
              data-testid="navigateCreateCategoryButton"
              size="small"
              width="auto"
              value="New category"
              variant="primary_outline"
              icon="plus"
              iconSize="extraSmall"
              onClick={() => navigateCreateCategory()}
            ></ButtonItem>
          </div>
          <div className="u-marginVerticalMedium">
            <PaginationItem {...categoryPagination}></PaginationItem>
          </div>
        </div>
        <div className="Grid categoriesListSection">
          {categoriesList
            ? categoriesList.map((category) => (
                <div
                  key={category.id}
                  className="categoriesListItem u-sizeFull md:u-size6of12 lg:u-size3of12 u-marginBottomLarge u-paddingVerticalSmall"
                >
                  <Link
                    to={`/categories/${category.id}`}
                    data-testid={`categoryDetail-${category.id}`}
                  >
                    <img
                      className="categoryImg u-marginBottomSmall"
                      width="100%"
                      src={category.imageUrl}
                      alt={category.name}
                      data-testid={`categoryDetail-${category.id}-image`}
                    />
                    <div
                      className="u-fontBold u-textLeft"
                      data-testid={`categoryDetail-${category.id}-name`}
                    >
                      {category.name}
                    </div>
                    <div
                      className="u-textLeft u-textGray"
                      data-testid={`categoryDetail-${category.id}-description`}
                    >
                      {shortenContent(
                        category.description,
                        CustomLimit.CATEGORY_DESCRIPTION
                      )}
                    </div>
                  </Link>
                </div>
              ))
            : [...Array(CustomLimit.CATEGORY_PAGINATION).keys()].map((id) => (
                <div
                  key={id}
                  className="u-sizeFull md:u-size6of12 lg:u-size3of12 u-marginBottomLarge "
                >
                  <div className="categoryImg u-marginBottomSmall">
                    <Skeleton width="100%" height="100%"></Skeleton>
                  </div>
                  <Skeleton width="60%"></Skeleton>
                  <Skeleton></Skeleton>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesList;
