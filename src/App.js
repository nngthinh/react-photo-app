import SignUp from "components/Auth/SignUp";
import SignIn from "components/Auth/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import "@ahaui/css/dist/index.min.css";
import {
  getUserInfoAction,
  removeLaterUrlAction,
  signOutAction,
} from "actions/user";
import Home from "components/Home";
import { useEffect } from "react";
import Toast from "components/Common/Toast";
import CustomModal from "components/Common/Modal";

const App = () => {
  // States
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const laterUrl = useSelector((state) => state.user.laterUrl);
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && laterUrl) {
      dispatch(removeLaterUrlAction());
      navigate(laterUrl);
    }
  });

  // Auto sign in and later url navigation
  useEffect(() => {
    const autoSignIn = async (isLoggedIn) => {
      if (isLoggedIn) {
        const getUserInfoResult = await dispatch(getUserInfoAction());
        if (!getUserInfoResult.success) {
          dispatch(signOutAction());
        }
      }
    };
    autoSignIn(isLoggedIn);
  }, [dispatch, isLoggedIn]);
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
      <Routes>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/*" element={<Home />}></Route>
      </Routes>
    </>
  );
};

export default App;
