import * as React from "react";
import "./signIn.css";
export const SignInView = () => {
  return (
    <div class="signInWrapper">
      <h1>Sign In</h1>
      <form>
        <input type="text" placeholder="Name"></input>
        <input type="text" placeholder="Email"></input>
        <input type="password" placeholder="Password"></input>
        <button type="submit">Create account</button>
      </form>
    </div>
  );
};
