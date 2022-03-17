import SignUp from "components/Auth/SignUp";
import SignIn from "components/Auth/SignIn";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { loadState } from "utils/services/localStorage";
import { getUserInfoAction } from "actions/user";
import Home from "components/Home";

const App = () => {
  // const dispatch = useDispatch();
  // const dispatchGetUserInfo = () => dispatch(getUserInfoAction());
  // // Auto sign in
  // const autoSignIn = async () => {
  //   const getUserInfoResult = await onAutoSignIn();
  //   console.log(getUserInfoResult);
  // };
  // autoSignIn();
  // const { user } = loadState() ?? {};
  // if (user && user.token) {
  //   const getUserInfoResult = dispatchGetUserInfo();
  //   console.log(getUserInfoResult);
  // }
  // Route page
  return <AppView></AppView>;
};

const AppView = ({ onAutoSignIn }) => {
  return (
    <Router>
      <Routes>
        <Route path="/signIn" element={<SignIn />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/*" element={<Home />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
