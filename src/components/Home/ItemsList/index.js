import { viewItemsListAction } from "actions/items";
import { ButtonItem, PaginationItem } from "components/Common/Items";
import { notifyNegative } from "components/Common/Toast";
import { limitItems } from "constants/pagination";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
      const [offset, limit] = [limitItems * (page - 1), limitItems];
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

  return (
    page > 0 && (
      <ItemsListView
        categoryId={categoryId}
        itemsList={itemsList}
        itemsPagination={{
          maxIndex: itemsPaginationTotal ?? 0,
          currentIndex: page,
        }}
        userInfo={userInfo}
      ></ItemsListView>
    )
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
      {itemsList.length && (
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
                  <div>{item.description}</div>
                  <div className="u-marginTopSmall">
                    {userInfo?.id === item.author.id ? (
                      <div className="u-textAccent u-text200">By you</div>
                    ) : (
                      <div className="u-textGray">By {item.author.name}</div>
                    )}
                  </div>
                </div>
              </Link>
              {userInfo?.id === item.author.id && (
                <div>
                  <ButtonItem
                    size="small"
                    width="auto"
                    value="Edit"
                    variant="accent_outline"
                    icon="edit"
                    sizeIcon="extraSmall"
                    onClick={() => navigateEditItem(categoryId, item.id)}
                  ></ButtonItem>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsList;
