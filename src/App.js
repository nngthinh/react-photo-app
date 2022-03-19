import SignUp from "components/Auth/SignUp";
import SignIn from "components/Auth/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "@ahaui/css/dist/index.min.css";
import { getUserInfoAction, signOutAction } from "actions/user";
import Home from "components/Home";
import { useEffect } from "react";
import Toast, {
  notify,
  notifyInformation,
  notifyNegative,
  notifyPositive,
  notifyWarning,
} from "components/Common/Toast";

const App = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const autoSignIn = async (isLoggedIn) => {
      if (isLoggedIn) {
        const getUserInfoResult = await dispatch(getUserInfoAction());
        if (getUserInfoResult.success) {
          return true;
        }
        dispatch(signOutAction());
      }
      return false;
    };
    const res = autoSignIn(isLoggedIn);
    notify("General");
    notifyInformation("Info");
    notifyPositive("Success");
    notifyWarning("Warn");
    notifyNegative("Failed");
  }, [isLoggedIn, dispatch]);
  // Route page
  return <AppView></AppView>;
};

const AppView = () => {
  return (
    <>
      <Toast />
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/*" element={<Home />}></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
