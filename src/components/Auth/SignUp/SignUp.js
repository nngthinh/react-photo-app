import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { signUpAction } from "actions/user";
import "./signUp.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const dispatchSignUp = (name, email, password) =>
    dispatch(signUpAction(name, email, password));
  return <SignUpView onSignUp={dispatchSignUp}></SignUpView>;
};

const SignUpView = ({ onSignUp, errors = {} }) => {
  const nameInput = React.useRef("");
  const emailInput = React.useRef("");
  const passwordInput = React.useRef("");
  // Handle submit
  const _onSubmit = (e) => {
    e.preventDefault();
    // Validate all fields
    console.log(nameInput.current.value);
    console.log(emailInput.current.value);
    console.log(passwordInput.current.value);
    // Call action
    // onSignUp();
  };

  return (
    <div className="signUp">
      <div className="signUpWrapper">
        <h1>Sign Up</h1>
        <form onSubmit={_onSubmit}>
          <input ref={nameInput} type="text" placeholder="Name"></input>
          {errors["name"] ? <p>{errors["name"]}</p> : <></>}
          <input ref={emailInput} type="text" placeholder="Email"></input>
          {errors["email"] ? <p>{errors["mail"]}</p> : <></>}
          <input
            ref={passwordInput}
            type="password"
            placeholder="Password"
          ></input>
          {errors["password"] !== null ? <p>{errors["password"]}</p> : <></>}
          <button type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
