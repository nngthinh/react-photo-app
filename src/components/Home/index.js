import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "components/Common/NavBar";
import CategoriesList from "components/Home/CategoriesList";
import CategoryAction from "components/Home/CategoryAction";
import CategoryDetail from "components/Home/CategoryDetail";
import ItemAction from "components/Home/ItemAction";
import ItemDetail from "components/Home/ItemDetail";
import { UserInputAction } from "constants/actions";

const Home = () => {
  return <HomeView />;
};

const HomeView = () => {
  // useEffect(() => {
  //   first

  //   return () => {
  //     second
  //   }
  // }, [third])

  return (
    <>
      <Navbar />
      <Routes>
        {/* Category */}
        <Route path="/categories" element={<CategoriesList />}></Route>
        <Route
          path="/categories/add"
          element={<CategoryAction type={UserInputAction.TYPE_ADD} />}
        ></Route>
        <Route
          path="/categories/:categoryId"
          element={<CategoryDetail />}
        ></Route>
        <Route
          path="/categories/:categoryId/edit"
          element={<CategoryAction type={UserInputAction.TYPE_EDIT} />}
        ></Route>
        {/* Item */}
        <Route
          path="/categories/:categoryId/items/add"
          element={<ItemAction type={UserInputAction.TYPE_ADD} />}
        ></Route>
        <Route
          path="/categories/:categoryId/items/:itemId"
          element={<ItemDetail />}
        ></Route>
        <Route
          path="/categories/:categoryId/items/:itemId/edit"
          element={<ItemAction type={UserInputAction.TYPE_EDIT} />}
        ></Route>
        {/* Wrong routes*/}
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
