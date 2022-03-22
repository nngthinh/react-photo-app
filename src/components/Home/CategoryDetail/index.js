import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewCategoryAction } from "actions/categories";
import { viewItemsListAction } from "actions/items";
import { PaginationItem } from "components/Common/Items";
import { notifyNegative } from "components/Common/Toast";
import { limitItems } from "constants/pagination";

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const categoryDetail = useSelector((state) => state.categories.detail);
  const itemsList = useSelector((state) => state.items.list);
  const itemsPaginationTotal = useSelector(
    (state) => state.items.pagination.total
  );
  const dispatch = useDispatch();

  // Items pagination
  const [searchParams, setSearchParams] = useSearchParams();
  let page = parseInt(searchParams.get("page") ?? 0);

  useEffect(() => {
    if (page < 1) {
      setSearchParams({ page: 1 }, { replace: true });
    } else {
      const viewCategoryDetail = async () => {
        // get category detail
        const viewCategoyResult = await dispatch(
          viewCategoryAction(categoryId)
        );
        if (!viewCategoyResult.success) {
          notifyNegative(viewCategoyResult.error.message);
        } else {
          // and get items list
          const [offset, limit] = [limitItems * (page - 1), limitItems];
          const viewItemsListResult = await dispatch(
            viewItemsListAction(categoryId, offset, limit)
          );
          if (!viewItemsListResult.success) {
            notifyNegative(viewCategoyResult.error.message);
          }
        }
      };
      viewCategoryDetail();
    }
  }, [categoryId, dispatch, page, setSearchParams]);

  return (
    <CategoryDetailView
      categoryId={categoryId}
      categoryDetail={categoryDetail}
      itemsList={itemsList}
      itemsPagination={{
        maxIndex: itemsPaginationTotal ?? 0,
        currentIndex: page,
      }}
    ></CategoryDetailView>
  );
};

const CategoryDetailView = ({
  categoryId,
  categoryDetail,
  itemsPagination,
  itemsList = [],
} = {}) => {
  const { name, description, imageUrl } = categoryDetail;
  return (
    <>
      <div>
        <h1>{name}</h1>
        <div>{description}</div>
        <img src={imageUrl} alt={name} />
      </div>
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

export default CategoryDetail;
