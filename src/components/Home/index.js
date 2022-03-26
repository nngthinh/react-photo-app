import Navbar from "components/Common/NavBar";
import { Navigate, Route, Routes } from "react-router-dom";
import CategoriesList from "./CategoriesList";
import CategoryAction from "./CategoryAction";
import CategoryDetail from "./CategoryDetail";
import ItemAction from "./ItemAction";
import ItemDetail from "./ItemDetail";
import ItemsList from "./ItemsList";

const Home = () => {
  return <HomeView />;
};

const HomeView = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Category */}
        <Route path="/categories" element={<CategoriesList />}></Route>
        <Route
          path="/categories/add"
          element={<CategoryAction type="add" />}
        ></Route>
        <Route
          path="/categories/:categoryId"
          element={<CategoryDetail />}
        ></Route>
        <Route
          path="/categories/:categoryId/edit"
          element={<CategoryAction type="edit" />}
        ></Route>
        {/* Item */}
        <Route
          path="/categories/:categoryId/items"
          element={<ItemsList />}
        ></Route>
        <Route
          path="/categories/:categoryId/items/add"
          element={<ItemAction type="add" />}
        ></Route>
        <Route
          path="/categories/:categoryId/items/:itemId"
          element={<ItemDetail />}
        ></Route>
        <Route
          path="/categories/:categoryId/items/:itemId/edit"
          element={<ItemAction type="edit" />}
        ></Route>
        {/* Replace wrong routes*/}
        <Route
          path="/*"
          element={<Navigate to="/categories" replace={true} />}
        />
        <Route path="/categories/:categoryId/*" element={<CategoryDetail />} />
      </Routes>
    </>
  );
};

export default Home;
