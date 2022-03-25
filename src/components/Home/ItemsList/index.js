import { viewItemsListAction } from "actions/items";
import { ButtonItem, PaginationItem } from "components/Common/Items";
import { notifyNegative } from "components/Common/Toast";
import { limitItemDesc, limitItemsPagination } from "constants/limit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { shortenContent } from "utils/helpers/content";
import { Skeleton } from "@ahaui/react";
import "./index.css";

const ItemsList = ({ categoryId }) => {
  const itemsList = useSelector((state) => state.items.list);
  const userInfo = useSelector((state) => state.user.info);
  const itemsPaginationTotal = useSelector(
    (state) => state.items.pagination.total
  );
  const dispatch = useDispatch();

  // Items pagination
  const [searchParams] = useSearchParams();
  let page =
    Array.from(searchParams).length === 0
      ? 1
      : parseInt(searchParams.get("page") ?? 0);

  const navigate = useNavigate();

  // Clear search param
  useEffect(() => {
    if (page === 0) {
      // Navigate to default url
      navigate(`/categories/${categoryId}`, { replace: true });
    }
  });

  useEffect(() => {
    const viewItemsList = async () => {
      const [offset, limit] = [
        limitItemsPagination * (page - 1),
        limitItemsPagination,
      ];
      const viewItemsListResult = await dispatch(
        viewItemsListAction(categoryId, offset, limit)
      );
      if (!viewItemsListResult.success) {
        notifyNegative(viewItemsListResult.error.message);
      }
    };
    if (page > 0) {
      viewItemsList();
    }
  }, [categoryId, dispatch, page]);

  return page > 0 ? (
    <ItemsListView
      categoryId={categoryId}
      itemsList={itemsList}
      itemsPagination={{
        maxIndex: itemsPaginationTotal ?? 0,
        currentIndex: page,
      }}
      userInfo={userInfo}
    ></ItemsListView>
  ) : (
    <></>
  );
};

const ItemsListView = ({
  categoryId,
  itemsPagination,
  itemsList = [],
  userInfo = {},
} = {}) => {
  const navigate = useNavigate();
  const navigateCreateItem = (categoryId) => {
    navigate(`/categories/${categoryId}/items/add`);
  };
  const navigateEditItem = (categoryId, itemId) => {
    navigate(`/categories/${categoryId}/items/${itemId}/edit`);
  };

  return (
    <div className="itemList">
      <div className="u-flex u-justifyContentBetween u-alignItemsCenter">
        <ButtonItem
          size="small"
          width="auto"
          value="New item"
          variant="primary_outline"
          icon="plus"
          sizeIcon="extraSmall"
          onClick={() => navigateCreateItem(categoryId)}
        ></ButtonItem>
        <div className="u-marginVerticalMedium">
          <PaginationItem {...itemsPagination}></PaginationItem>
        </div>
      </div>
      {itemsList.length ? (
        <div className="u-flex u-flexColumn u-alignItemsStart itemsListSection">
          {itemsList.map((item) => (
            <div
              key={item.id}
              className="u-flex u-alignItemsCenter u-justifyContentBetween u-sizeFull u-marginBottomSmall"
            >
              <Link
                to={`/categories/${categoryId}/items/${item.id}`}
                className="u-flex u-alignItemsCenter u-justifyContentStart u-flexGrow1"
              >
                <img
                  className="itemImg u-marginRightSmall"
                  width="100%"
                  src={item.imageUrl}
                  alt={item.name}
                />
                <div className="u-flex u-flexColumn">
                  <div className="u-text200">
                    {shortenContent(item.description, limitItemDesc)}
                  </div>
                  <div className="u-marginTopSmall u-text200">
                    {userInfo?.id === item.author.id ? (
                      <ButtonItem
                        size="small"
                        width="auto"
                        value="Edit"
                        variant="accent_outline"
                        icon="edit"
                        sizeIcon="extraSmall"
                        onClick={() => navigateEditItem(categoryId, item.id)}
                      ></ButtonItem>
                    ) : (
                      <div className="u-textGray">By {item.author.name}</div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        [...Array(limitItemsPagination).keys()].map((id) => (
          <div
            key={id}
            className="u-flex u-alignItemsCenter u-justifyContentBetween u-sizeFull u-marginBottomSmall"
          >
            <div className="u-flex u-alignItemsCenter u-justifyContentStart u-sizeFull">
              <div className="itemImg u-marginRightSmall">
                <Skeleton width="100%" height="100%"></Skeleton>
              </div>
              <div className="u-flex u-flexColumn u-marginRightSmall u-flexGrow1">
                <Skeleton width="80%"></Skeleton>
                <Skeleton width="100%"></Skeleton>
                <div className="u-marginTopSmall">
                  <Skeleton width="20%"></Skeleton>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ItemsList;
