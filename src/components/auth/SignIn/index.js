import { useReducer } from "react";
import { signInAction } from "actions/user";
import { ButtonItem, InputItem } from "components/Common/Items";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "utils/validations/auth";
import "./SignIn.css";
import { Separator } from "@ahaui/react";
import { notifyNegative, notifyPositive } from "components/Common/Toast";
const SignIn = () => {
  const dispatch = useDispatch();
  const dispatchSignIn = (email, password) =>
    dispatch(signInAction(email, password));
  return <SignInView onSignIn={dispatchSignIn}></SignInView>;
};

const SignInView = ({ onSignIn }) => {
  // Input states
  const [email, setEmail] = useReducer(
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

  const [password, setPassword] = useReducer(
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
  const navigateSignUp = () => navigate(`/signUp`);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    if (validateEmail(email.value) || validatePassword(password.value)) {
      setEmail({ type: "ON_VALIDATE" });
      setPassword({ type: "ON_VALIDATE" });
      return;
    }
    // Sign up
    const signInResult = await onSignIn(email.value, password.value);
    if (signInResult.success) {
      notifyPositive("Sign in successfully.");
      navigateHome();
    } else {
      if (signInResult.error.data) {
        const fieldErrors = signInResult.error.data;
        setEmail({ type: "ON_VALIDATE", error: fieldErrors.email?.[0] });
        setPassword({ type: "ON_VALIDATE", error: fieldErrors.password?.[0] });
      } else {
        const messageError = signInResult.error.message;
        notifyNegative(String(messageError));
      }
    }
  };

  // Return view
  return (
    <div className="signIn">
      <div className="signInWrapper u-marginTopExtraLarge">
        <h1 className="u-marginBottomExtraLarge">Sign in</h1>
        <form id="signInForm" onSubmit={handleSubmit}>
          <div className="inputSecion u-marginBottomLarge">
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
            data-testid="signInButton"
            className="u-marginBottomTiny"
            value={"Sign In"}
            type="submit"
            form="signInForm"
          ></ButtonItem>
          <Separator
            className="u-marginTopLarge u-marginBottomSmall"
            label="or"
            variant="lighter"
          />
          <ButtonItem
            data-testid="signUpButton"
            variant="secondary"
            className="u-marginBottomTiny"
            value={"Create account"}
            onClick={() => navigateSignUp()}
          ></ButtonItem>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
