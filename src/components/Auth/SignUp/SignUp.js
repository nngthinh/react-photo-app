import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { signUpAction } from "actions/user";
import "./signUp.css";

const SignUp = () => {
  const errors = useSelector((state) => state.user.errors?.signUp ?? {});
  const dispatch = useDispatch();
  const dispatchSignUp = (name, email, password) =>
    dispatch(signUpAction(name, email, password));
  return (
    <SignUpView
      onSignUp={dispatchSignUp}
      onAutoSignIn={dispatchSignUp}
      errors={errors}
    ></SignUpView>
  );
};

const SignUpView = ({ onSignUp, onAutoSignIn, errors = {} }) => {
  const nameInput = React.useRef("");
  const emailInput = React.useRef("");
  const passwordInput = React.useRef("");
  // Handle submit
  const _onSubmit = (e) => {
    e.preventDefault();
    // Validate all fields
    const [name, email, password] = [
      nameInput.current.value,
      emailInput.current.value,
      passwordInput.current.value,
    ];
    // Call action
    const res = onSignUp(name, email, password);
    console.log(res);
    if (false) {
      onAutoSignIn(email, password);
    }
  };

  return (
    <div className="signUp">
      <div className="signUpWrapper">
        <h1>Sign Up</h1>
        <form onSubmit={_onSubmit}>
          <input ref={nameInput} type="text" placeholder="Name"></input>
          {errors["name"] ?? <p>{errors["name"]}</p>}
          <input ref={emailInput} type="text" placeholder="Email"></input>
          {errors["email"] ?? <p>{errors["mail"]}</p>}
          <input
            ref={passwordInput}
            type="password"
            placeholder="Password"
          ></input>
          {errors["password"] ?? <p>{errors["password"]}</p>}
          <button type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
