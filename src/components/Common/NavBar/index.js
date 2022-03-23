import { showModalAction, clearModalAction } from "actions/modal";
import { signOutAction } from "actions/user";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { ButtonItem } from "../Items";
import { notifyNegative } from "../Toast";
import "./index.css";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const dispatchSignOut = () => dispatch(signOutAction());
  const dispatchShowModal = (contents, props) =>
    dispatch(showModalAction(contents, props));
  const dispatchClearModal = () => dispatch(clearModalAction());
  return (
    <NavbarView
      user={user}
      onSignOut={dispatchSignOut}
      onShowModal={dispatchShowModal}
      onClearModal={dispatchClearModal}
    />
  );
};

const NavbarView = ({ user, onSignOut, onShowModal, onClearModal }) => {
  const isLoggedIn = user.isLoggedIn ?? false;

  // Navigators
  const navigate = useNavigate();

  // Button click
  const handleSignIn = (e) => {
    navigate(`/signin`);
  };

  const handleSignOut = (e) => {
    const signOut = async (e) => {
      const signOutResult = await onSignOut();
      if (signOutResult.success) {
        onClearModal();
        navigate("/");
      } else {
        notifyNegative(signOutResult.error.message);
      }
    };
    onShowModal(
      {
        title: "Signing out",
        body: "Are you sure you want to sign out?",
        button1: "Cancel",
        button2: "Yes",
      },
      {
        modal: {
          onHide: () => onClearModal(),
        },
        header: {
          onHide: () => onClearModal(),
        },
        button1: {
          onClick: () => onClearModal(),
        },
        button2: {
          onClick: () => signOut(),
        },
      }
    );
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
