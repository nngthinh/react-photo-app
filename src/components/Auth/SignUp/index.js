import { useState, useReducer } from "react";
import { useDispatch } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Separator } from "@ahaui/react";
import base64 from "base-64";
import { signInAction, signUpAction } from "actions/user";
import { ButtonItem, InputItem } from "components/Common/Items";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "utils/validations/auth";
import { notifyNegative, notifyPositive } from "components/Common/Toast";
import { UserInputAction } from "constants/actions";
import "./index.css";

// Components
const SignUp = () => {
  const dispatch = useDispatch();
  const dispatchSignUp = (name, email, password) =>
    dispatch(signUpAction(name, email, password));
  const dispatchSignIn = (email, password) =>
    dispatch(signInAction(email, password));

  // pass next url to sign in page
  const [searchParams] = useSearchParams();
  const nextUrl = searchParams.get("next");

  return (
    <SignUpView
      nextUrl={nextUrl}
      onSignUp={dispatchSignUp}
      onAutoSignIn={dispatchSignIn}
    ></SignUpView>
  );
};

const SignUpView = ({ nextUrl, onSignUp, onAutoSignIn }) => {
  // Input states
  const [name, setName] = useReducer(
    (name, nameAction) => {
      switch (nameAction.type) {
        case UserInputAction.ON_CHANGE:
          return {
            value: nameAction.value,
            error: null,
          };
        case UserInputAction.ON_VALIDATE:
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

  const [email, setEmail] = useReducer(
    (email, emailAction) => {
      switch (emailAction.type) {
        case UserInputAction.ON_CHANGE:
          return {
            value: emailAction.value,
            error: null,
          };
        case UserInputAction.ON_VALIDATE:
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

  const [password, setPassword] = useReducer(
    (password, passwordAction) => {
      switch (passwordAction.type) {
        case UserInputAction.ON_CHANGE:
          return {
            value: passwordAction.value,
            error: null,
          };
        case UserInputAction.ON_VALIDATE:
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigators
  const navigate = useNavigate();
  const navigateHome = () =>
    navigate(nextUrl ? base64.decode(nextUrl) : "/home");
  const navigateSignIn = () =>
    navigate(
      nextUrl
        ? {
            pathname: "/signin",
            search: createSearchParams({ next: nextUrl }).toString(),
          }
        : { pathname: "/signin" }
    );

  // Handle submit
  const handleSubmit = async (e) => {
    // Validate all fields before submitting
    if (
      validateName(name.value) ||
      validateEmail(email.value) ||
      validatePassword(password.value)
    ) {
      setName({ type: UserInputAction.ON_VALIDATE });
      setEmail({ type: UserInputAction.ON_VALIDATE });
      setPassword({ type: UserInputAction.ON_VALIDATE });
      return;
    }
    setIsSubmitting(true);
    // Sign up
    const signUpResult = await onSignUp(
      name.value,
      email.value,
      password.value
    );

    setIsSubmitting(false);

    if (signUpResult.success) {
      notifyPositive("Create account successfully.");
      // Sign in and get token
      const signInResult = await onAutoSignIn(email.value, password.value);
      if (signInResult.success) {
        navigateHome();
      }
    } else {
      // Field validation
      if (signUpResult.error.data) {
        const fieldErrors = signUpResult.error.data;
        setName({
          type: UserInputAction.ON_VALIDATE,
          error: fieldErrors.name?.[0],
        });
        setEmail({
          type: UserInputAction.ON_VALIDATE,
          error: fieldErrors.email?.[0],
        });
        setPassword({
          type: UserInputAction.ON_VALIDATE,
          error: fieldErrors.password?.[0],
        });
      }
      // Show all error
      notifyNegative(signUpResult.error.message);
    }
  };

  // Return view
  return (
    <div className="signUp">
      <div className="signUpWrapper">
        <h1 className="u-marginBottomExtraLarge">Create new account</h1>
        <div className="inputSecion u-marginBottomLarge">
          <InputItem
            data-testid="name"
            className="u-marginBottomExtraSmall"
            type="text"
            value={name.value}
            placeholder={"Name"}
            handleOnChange={(e) => {
              setName({
                type: UserInputAction.ON_CHANGE,
                value: e.target.value,
              });
            }}
            handleOnBlur={(e) => setName({ type: UserInputAction.ON_VALIDATE })}
            error={name.error}
            readOnly={isSubmitting}
          ></InputItem>
          <InputItem
            data-testid="email"
            className="u-marginBottomExtraSmall"
            type="text"
            value={email.value}
            placeholder={"Email"}
            handleOnChange={(e) => {
              setEmail({
                type: UserInputAction.ON_CHANGE,
                value: e.target.value,
              });
            }}
            handleOnBlur={(e) =>
              setEmail({ type: UserInputAction.ON_VALIDATE })
            }
            error={email.error}
            readOnly={isSubmitting}
          ></InputItem>
          <InputItem
            data-testid="password"
            className="u-marginBottomExtraSmall"
            type="password"
            value={password.value}
            placeholder={"Password"}
            handleOnChange={(e) => {
              setPassword({
                type: UserInputAction.ON_CHANGE,
                value: e.target.value,
              });
            }}
            handleOnBlur={(e) =>
              setPassword({ type: UserInputAction.ON_VALIDATE })
            }
            error={password.error}
            readOnly={isSubmitting}
          ></InputItem>
        </div>
        <div className="buttonSection">
          <ButtonItem
            data-testid="signUpButton"
            className="u-marginBottomTiny"
            value={"Create account"}
            onClick={handleSubmit}
            isSubmitting={isSubmitting}
          ></ButtonItem>
          <Separator
            className="u-marginTopLarge u-marginBottomSmall"
            label="or"
            variant="lighter"
          />
          <ButtonItem
            data-testid="navigateSignInButton"
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
