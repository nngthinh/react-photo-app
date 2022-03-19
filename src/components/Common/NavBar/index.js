import { signOutAction } from "actions/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ButtonItem } from "../Item";
import "./Navbar.css";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const dispatchSignOut = () => dispatch(signOutAction());
  return <NavbarView user={user} onSignOut={dispatchSignOut} />;
};

const NavbarView = ({ user, onSignOut }) => {
  const isLoggedIn = user.isLoggedIn ?? false;
  // Navigators
  const nagivate = useNavigate();
  const navigateSignIn = () => nagivate(`/signin`);

  // Button click
  const handleSignIn = (e) => {
    navigateSignIn();
  };

  const handleSignOut = async (e) => {
    const signOutResult = await onSignOut();
    if (signOutResult.success) {
      window.location.reload(false);
    }
  };

  // Return view
  return (
    <div className="navbar u-shadowSmall">
      <div className="navbarWrapper">
        <div className="left Brown500">
          <div>
            {isLoggedIn
              ? `Hi ${user.info?.name ?? ""}!`
              : "Welcome to Photo app!"}
          </div>
        </div>
        <div className="right">
          {isLoggedIn ? (
            <ButtonItem
              data-testid="signOutButton"
              value={"Sign Out"}
              variant={"negative_outline"}
              onClick={handleSignOut}
              size="medium"
            ></ButtonItem>
          ) : (
            <ButtonItem
              data-testid="signInButton"
              value={"Sign In"}
              variant={"primary_outline"}
              onClick={handleSignIn}
              size="medium"
            ></ButtonItem>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
