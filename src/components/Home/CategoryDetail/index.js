import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewCategoryAction } from "actions/categories";
import { notifyNegative } from "components/Common/Toast";
import { Icon, Skeleton, Separator } from "@ahaui/react";
import "./index.css";
import ItemsList from "components/Home/ItemsList";
import { BreadcrumbItem, ButtonItem } from "components/Common/Items";

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const categoryDetail = useSelector((state) => state.categories.detail);
  const dispatch = useDispatch();

  useEffect(() => {
    const viewCategoryDetail = async () => {
      // get category detail
      const viewCategoyResult = await dispatch(viewCategoryAction(categoryId));
      if (!viewCategoyResult.success) {
        notifyNegative(viewCategoyResult.error.message);
      }
    };
    viewCategoryDetail();
  }, [categoryId, dispatch]);

  return (
    <CategoryDetailView
      categoryId={categoryId}
      categoryDetail={categoryDetail}
    ></CategoryDetailView>
  );
};

const CategoryDetailView = ({ categoryId, categoryDetail }) => {
  const { name, description, imageUrl } = categoryDetail;
  const navigate = useNavigate();
  const navigateEditCategory = (categoryId) => {
    navigate(`/categories/${categoryId}/edit`);
  };

  return (
    <>
      <div className="categoryDetail container">
        <div className="categoryDetailWrapper">
          <div className="u-marginBottomMedium">
            {name ? (
              <BreadcrumbItem
                items={[
                  {
                    id: 1,
                    name: "Home",
                    link: "./",
                  },
                  { id: 2, name, link: "./" },
                ]}
              ></BreadcrumbItem>
            ) : (
              <Skeleton width="200px"></Skeleton>
            )}
          </div>
          <div className="Grid u-alignItemsStart u-marginBottomMedium">
            <div className="u-sizeFull sm:u-sizeFull md:u-size4of12 lg:u-size4of12 u-marginBottomMedium">
              {imageUrl ? (
                <img className="categoryImg" src={imageUrl} alt={name} />
              ) : (
                <div className="categoryImg">
                  <Skeleton width="100%" height="100%"></Skeleton>
                </div>
              )}
            </div>
            <div className="u-flex u-flexColumn u-sizeFull sm:u-sizeFull md:u-size8of12">
              {name ? (
                <>
                  <h1 className="u-textLeft">{name}</h1>
                  <div className="u-textleft">{description}</div>
                  <div className="u-marginTopMedium ">
                    <ButtonItem
                      size="medium"
                      width="auto"
                      value="Edit"
                      variant="accent"
                      icon="edit"
                      sizeIcon="small"
                      onClick={() => navigateEditCategory(categoryId)}
                    ></ButtonItem>
                  </div>
                </>
              ) : (
                <>
                  <div className="u-marginBottomMedium">
                    <Skeleton width="200px" height="44px"></Skeleton>
                  </div>
                  <Skeleton width="80%"></Skeleton>
                  <Skeleton width="100%"></Skeleton>
                  <Skeleton width="50%"></Skeleton>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="Grid ">
              <div className="u-sizeFull md:u-size2of12"></div>
              <div className="u-sizeFull md:u-size8of12">
                <div className="u-textCenter u-marginBottomMedium">
                  Let's explore!
                </div>
                <Separator variant="lighter"></Separator>
                <ItemsList categoryId={categoryId}></ItemsList>
              </div>
              <div className="u-sizeFull sm:u-size2of12"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryDetail;
