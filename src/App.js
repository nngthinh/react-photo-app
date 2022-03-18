import SignUp from "components/Auth/SignUp";
import SignIn from "components/Auth/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "@ahaui/css/dist/index.min.css";
import { getUserInfoAction, signOutAction } from "actions/user";
import Home from "components/Home";
import { useEffect } from "react";

const App = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      const getUserInfoResult = dispatch(getUserInfoAction());
      if (!getUserInfoResult.success) {
        dispatch(signOutAction());
      }
    }
  }, [dispatch, isLoggedIn]);
  // Route page
  return <AppView></AppView>;
};

const AppView = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/*" element={<Home />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
