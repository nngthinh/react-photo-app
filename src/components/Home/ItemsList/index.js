import { viewItemsListAction } from "actions/items";
import { PaginationItem } from "components/Common/Items";
import { notifyNegative } from "components/Common/Toast";
import { limitItems } from "constants/pagination";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

const ItemsList = ({ categoryId }) => {
  const itemsList = useSelector((state) => state.items.list);
  const itemsPaginationTotal = useSelector(
    (state) => state.items.pagination.total
  );
  const dispatch = useDispatch();

  // Items pagination
  const [searchParams, setSearchParams] = useSearchParams();
  let page = parseInt(searchParams.get("page") ?? 1);

  useEffect(() => {
    const viewItemsList = async () => {
      // and get items list
      const [offset, limit] = [limitItems * (page - 1), limitItems];
      const viewItemsListResult = await dispatch(
        viewItemsListAction(categoryId, offset, limit)
      );
      if (!viewItemsListResult.success) {
        notifyNegative(viewItemsListResult.error.message);
      }
    };
    viewItemsList();
  });
  return (
    <ItemsListView
      itemsList={itemsList}
      itemsPagination={{
        maxIndex: itemsPaginationTotal ?? 0,
        currentIndex: page,
      }}
    ></ItemsListView>
  );
};

const ItemsListView = ({
  categoryId,
  itemsPagination,
  itemsList = [],
} = {}) => {
  return (
    <>
      <PaginationItem {...itemsPagination}></PaginationItem>
      {itemsList.length && (
        <ul>
          {itemsList.map((item) => (
            <li key={item.id}>
              <Link to={`/categories/${categoryId}/items/${item.id}`}>
                <div>{item.description}</div>
                <img src={item.imageUrl} alt={item.name} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ItemsList;
