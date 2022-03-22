import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewCategoryAction } from "actions/categories";
import { viewItemsListAction } from "actions/items";
import { PaginationItem } from "components/Common/Items";

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
    // get category detail
    // dispatch(viewCategoryAction());
    // and get items list
    // dispatch(viewItemsListAction());
  }, [dispatch, categoryId]);

  return (
    <CategoryDetailView
      categoryDetail={categoryDetail}
      itemsList={itemsList}
      itemsPagination={{ maxIndex: itemsPaginationTotal ?? 0 }}
    ></CategoryDetailView>
  );
};

const CategoryDetailView = ({
  categoryDetail,
  itemsPagination,
  itemsList = [],
} = {}) => {
  return (
    <>
      <div>Category Detail</div>
      <PaginationItem {...itemsPagination}></PaginationItem>
    </>
  );
};

export default CategoryDetail;
