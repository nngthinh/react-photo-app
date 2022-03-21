import { useDispatch, useSelector } from "react-redux";
import { PaginationItem } from "../Items";
import "./Sidebar.css";
const Sidebar = () => {
  const categoriesList = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const dispatchViewCategories = () => dispatch();
  return <SidebarView />;
};

const SidebarView = ({ mode = "partial", categoriesList = [] }) => {
  return (
    <PaginationItem></PaginationItem>
    // <div className="sidebar">
    //   <title>Category</title>
    //   <ul>
    //     {categoriesList.map((category) => (
    //       <li key={category.id}>{category.name}</li>
    //     ))}
    //   </ul>
    // </div>
  );
};

export default Sidebar;
