import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@ahaui/react";

const BreadcrumbItem = ({ items }) => {
  return (
    Array.isArray(items) &&
    items.length > 0 && <BreadcrumbItemView items={items}></BreadcrumbItemView>
  );
};

const BreadcrumbItemView = ({ items }) => {
  const navigate = useNavigate();
  return (
    <Breadcrumb>
      {items.map(({ id, name, link }) => (
        // JSDom didn't support navigation. Use useNavigate hook instead
        <Breadcrumb.Item
          key={id}
          onClick={() => navigate(link)}
          data-testid={`breadcrumb-${id}`}
        >
          {name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbItem;
