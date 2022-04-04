import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import "@ahaui/css/dist/index.min.css";
import SignIn from "components/Auth/SignIn";
import SignUp from "components/Auth/SignUp";
import Home from "components/Home";
import Toast from "components/Common/Toast";
import CustomModal from "components/Common/Modal";
import "./App.css";

const App = () => {
  const modal = useSelector((state) => state.modal);
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
