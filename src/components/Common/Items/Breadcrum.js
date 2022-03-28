import { Breadcrumb } from "@ahaui/react";

const BreadcrumbItem = ({ items }) => {
  return (
    Array.isArray(items) &&
    items.length > 0 && <BreadcrumbItemView items={items}></BreadcrumbItemView>
  );
};

const BreadcrumbItemView = ({ items }) => {
  return (
    <Breadcrumb>
      {items.map(({ id, name, link }) => (
        <Breadcrumb.Item key={id} href={link} data-testid={`breadcrumb-${id}`}>
          {name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbItem;
