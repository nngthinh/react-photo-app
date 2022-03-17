import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.css";
const Sidebar = () => {
  const categoriesList = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const dispatchViewCategories = () => dispatch();
  return <SidebarView />;
};

const SidebarView = ({ categoriesList = [] }) => {
  return (
    <div className="sidebar">
      <title>Category</title>
      <ul>
        {categoriesList.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
