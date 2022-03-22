const CategoryAction = ({ type }) => {
  return type === "add" ? (
    <CategoryActionAddView></CategoryActionAddView>
  ) : (
    <CategoryActionEditView></CategoryActionEditView>
  );
};

const CategoryActionAddView = () => {
  return (
    <>
      <div>Category Add View</div>
    </>
  );
};

const CategoryActionEditView = () => {
  return (
    <>
      <div>Category Edit View</div>
    </>
  );
};

export default CategoryAction;
