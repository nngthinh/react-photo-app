import * as React from "react";
import { useDispatch } from "react-redux";
import { signInAction, signUpAction } from "actions/user";
import InputItem from "components/Common/Item";
import "./signUp.css";

// Components
const SignUp = () => {
  // TODO: Should lift it up?
  const dispatch = useDispatch();
  const dispatchSignUp = (name, email, password) =>
    dispatch(signUpAction(name, email, password));
  const dispatchSignIn = (email, password) =>
    dispatch(signInAction(email, password));
  return (
    <SignUpView
      onSignUp={dispatchSignUp}
      onAutoSignIn={dispatchSignIn}
    ></SignUpView>
  );
};

const SignUpView = ({ onSignUp, onAutoSignIn }) => {
  // - Validators
  const validateName = (name) =>
    name.length > 30 || name.length === 0
      ? "Length must be between 1 and 30."
      : null;

  const validateEmail = (email) =>
    email.length > 30
      ? "Longer than maximum length 30."
      : !String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ? "Not a valid email address."
      : null;

  const validatePassword = (password) =>
    password.length < 6 ? "Shorter than minimum length 6." : null;
  // Input states
  const [name, setName] = React.useReducer(
    (name, nameAction) => {
      switch (nameAction.type) {
        case "ON_CHANGE":
          return {
            value: nameAction.value,
            error: null,
          };
        case "ON_VALIDATE":
          return {
            value: name.value,
            error: nameAction.error ?? validateName(name.value),
          };
        default:
          return { ...name };
      }
    },
    { value: "", error: null }
  );
  const [email, setEmail] = React.useReducer(
    (email, emailAction) => {
      switch (emailAction.type) {
        case "ON_CHANGE":
          return {
            value: emailAction.value,
            error: null,
          };
        case "ON_VALIDATE":
          return {
            value: email.value,
            error: emailAction.error ?? validateEmail(email.value),
          };
        default:
          return { ...email };
      }
    },
    { value: "", error: null }
  );
  const [password, setPassword] = React.useReducer(
    (password, passwordAction) => {
      switch (passwordAction.type) {
        case "ON_CHANGE":
          return {
            value: passwordAction.value,
            error: null,
          };
        case "ON_VALIDATE":
          return {
            value: password.value,
            error: passwordAction.error ?? validatePassword(password.value),
          };
        default:
          return { ...password };
      }
    },
    { value: "", errors: null }
  );

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields before submitting
    if (
      validateName(name.value) ||
      validateEmail(email.value) ||
      validatePassword(password.value)
    ) {
      setName({ type: "ON_VALIDATE" });
      setEmail({ type: "ON_VALIDATE" });
      setPassword({ type: "ON_VALIDATE" });
      return;
    }
    // Sign up
    const signUpResult = await onSignUp(
      name.value,
      email.value,
      password.value
    );
    if (signUpResult.success) {
      // Sign in and get token
      const signInResult = await onAutoSignIn(email.value, password.value);
    } else {
      // Field validation
      if (signUpResult.error.data) {
        const fieldErrors = signUpResult.error.data;
        setName({ type: "ON_VALIDATE", error: fieldErrors.name?.[0] });
        setEmail({ type: "ON_VALIDATE", error: fieldErrors.email?.[0] });
        setPassword({ type: "ON_VALIDATE", error: fieldErrors.password?.[0] });
      }
      // Modal message
      console.log(signUpResult.error.message);
    }
  };

  return (
    <div className="signUp">
      <div className="signUpWrapper">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <InputItem
            type="text"
            value={name.value}
            placeholder={"Name"}
            handleOnChange={(e) => {
              setName({ type: "ON_CHANGE", value: e.target.value });
            }}
            handleOnBlur={(e) => setName({ type: "ON_VALIDATE" })}
            error={name.error}
          ></InputItem>
          <InputItem
            type="text"
            value={email.value}
            placeholder={"Email"}
            handleOnChange={(e) => {
              setEmail({ type: "ON_CHANGE", value: e.target.value });
            }}
            handleOnBlur={(e) => setEmail({ type: "ON_VALIDATE" })}
            error={email.error}
          ></InputItem>
          <InputItem
            type="password"
            value={password.value}
            placeholder={"Password"}
            handleOnChange={(e) => {
              setPassword({ type: "ON_CHANGE", value: e.target.value });
            }}
            handleOnBlur={(e) => setPassword({ type: "ON_VALIDATE" })}
            error={password.error}
          ></InputItem>
          <button type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
