import * as React from "react";
import "./signUn.css";
export const SignUnView = () => {
  return (
    <div className="signUp">
      <div className="signUpWrapper">
        <h1>Sign Up</h1>
        <form>
          <input type="text" placeholder="Name"></input>
          <input type="text" placeholder="Email"></input>
          <input type="password" placeholder="Password"></input>
          <button type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
};
