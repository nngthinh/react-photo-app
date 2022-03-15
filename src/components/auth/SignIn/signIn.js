import * as React from "react";
import { useSelector } from "react-redux";
import "./SignIn.css";
const SignInView = () => {
  // const counter = useSelector((state) => {
  //   state.user;
  // });
  return (
    <div>
      <div className="signInWrapper">
        <h1>Sign In</h1>
        <form>
          <input type="text" placeholder="Email"></input>
          <input type="password" placeholder="Password"></input>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default SignInView;
