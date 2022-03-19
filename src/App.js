import SignUp from "components/Auth/SignUp";
import SignIn from "components/Auth/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "@ahaui/css/dist/index.min.css";
import { getUserInfoAction, signOutAction } from "actions/user";
import Home from "components/Home";
import { useEffect } from "react";
import Toast, { notifyNegative, notifyPositive } from "components/Common/Toast";
import CustomModal from "components/Common/Modal";

const App = () => {
  // States
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  // Auto sign in
  useEffect(() => {
    const autoSignIn = async (isLoggedIn) => {
      if (isLoggedIn) {
        const getUserInfoResult = await dispatch(getUserInfoAction());
        if (getUserInfoResult.success) {
          notifyPositive("Success");
        } else {
          dispatch(signOutAction());
          notifyNegative("Failed");
        }
      }
    };
    autoSignIn(isLoggedIn);
  }, [isLoggedIn, dispatch]);
  // Route page
  return (
    <>
      <NotiView modal={modal}></NotiView>
      <MainAppView></MainAppView>
    </>
  );
};

const NotiView = ({ modal }) => {
  return (
    <>
      <Toast />
      {modal.show && <CustomModal {...modal.config} />}
    </>
  );
};

const MainAppView = () => {
  return (
    <>
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
