import { signInAction } from "actions/user";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SignIn.css";
const SignIn = () => {
  const previousUser = useSelector((state) => state.previousUser);
  const dispatch = useDispatch();
  const dispatchSignIn = dispatch(signInAction());
  return (
    <div>
      <div className="signInWrapper">
        <h1>Sign In</h1>
        <form>
          <input type="text" placeholder="Email"></input>
          <input type="password" placeholder="Password"></input>
          <button type="submit" onClick={() => dispatchSignIn()}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
