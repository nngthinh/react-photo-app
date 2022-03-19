import * as React from "react";
import { useDispatch } from "react-redux";
import { signInAction, signUpAction } from "actions/user";
import { ButtonItem, InputItem } from "components/Common/Items";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "utils/validation/auth";
import "./signUp.css";
import { useNavigate } from "react-router-dom";
import { Separator } from "@ahaui/react";

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

  // Navigators
  const navigate = useNavigate();
  const navigateHome = () => navigate(`/home`);
  const navigateSignIn = () => navigate(`/signin`);

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
      if (signInResult.success) {
        navigateHome();
      } else {
        navigateSignIn();
      }
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

  // Return view
  return (
    <div className="signUp">
      <div className="signUpWrapper u-marginTopExtraLarge">
        <h1 className="u-marginBottomExtraLarge">Create new account</h1>
        <form id="signUpForm" onSubmit={handleSubmit}>
          <div className="inputSecion u-marginBottomLarge">
            <InputItem
              data-testid="name"
              className="u-marginBottomExtraSmall"
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
              data-testid="email"
              className="u-marginBottomExtraSmall"
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
              data-testid="password"
              className="u-marginBottomExtraSmall"
              type="password"
              value={password.value}
              placeholder={"Password"}
              handleOnChange={(e) => {
                setPassword({ type: "ON_CHANGE", value: e.target.value });
              }}
              handleOnBlur={(e) => setPassword({ type: "ON_VALIDATE" })}
              error={password.error}
            ></InputItem>
          </div>
        </form>
        <div className="buttonSection">
          <ButtonItem
            data-testid="signUpButton"
            className="u-marginBottomTiny"
            value={"Create account"}
            type="submit"
            form="signUpForm"
          ></ButtonItem>
          <Separator
            className="u-marginTopLarge u-marginBottomSmall"
            label="or"
            variant="lighter"
          />
          <ButtonItem
            data-testid="signInButton"
            variant="secondary"
            className="u-marginBottomTiny"
            value={"Sign In"}
            onClick={() => navigateSignIn()}
          ></ButtonItem>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
