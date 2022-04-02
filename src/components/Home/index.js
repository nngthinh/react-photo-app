import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "components/Common/NavBar";
import CategoriesList from "components/Home/CategoriesList";
import CategoryAction from "components/Home/CategoryAction";
import CategoryDetail from "components/Home/CategoryDetail";
import ItemAction from "components/Home/ItemAction";
import ItemDetail from "components/Home/ItemDetail";
import { UserInputAction } from "constants/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { cleanUserInfoAction, getUserInfoAction } from "actions/user";

const Home = () => {
  // States
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  // Keep user session
  useEffect(() => {
    const keepUserSession = async (isLoggedIn) => {
      if (isLoggedIn) {
        const getUserInfoResult = await dispatch(getUserInfoAction());
        if (!getUserInfoResult.success) {
          // If there's a network error, do nothing
          if (String(getUserInfoResult.error.message).includes("Network Error"))
            return;
          // If user session is expired or invalid, wipe out that session
          dispatch(cleanUserInfoAction());
        }
      }
    };
    keepUserSession(isLoggedIn);
  }, [dispatch, isLoggedIn]);

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
