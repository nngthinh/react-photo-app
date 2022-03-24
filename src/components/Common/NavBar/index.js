import { showModalAction, clearModalAction } from "actions/modal";
import { signOutAction } from "actions/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ButtonItem } from "../Items";
import { notifyNegative, notifyPositive } from "../Toast";
import { Avatar, Icon, Dropdown, Toggle } from "@ahaui/react";
import "./index.css";
import { useState } from "react";

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
        notifyPositive("Sign out successfully.");
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

  // Dark mode state
  const [isDark, setIsDark] = useState(false);

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
            <Dropdown alignRight className="profile">
              <Dropdown.Toggle className="u-lineHeightNone">
                <div>
                  <Avatar
                    className="u-backgroundPrimaryLight u-text200"
                    text={user.info?.name[0].toUpperCase()}
                  />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Container className="u-paddingVerticalExtraSmall">
                <Dropdown.Item className="u-paddingTopExtraSmall u-paddingBottomExtraSmall">
                  <Toggle
                    className="u-marginRightSmall"
                    checked={isDark}
                    onClick={() => setIsDark(!isDark)}
                    textLabelOn={"Dark mode"}
                    textLabelOff={"Light mode"}
                  />
                </Dropdown.Item>
                <Dropdown.Item className="u-paddingTopExtraSmall u-paddingBottomExtraSmall">
                  <div
                    data-testid="signOutButton"
                    onClick={() => handleSignOut()}
                  >
                    <Icon
                      name="power"
                      size="small"
                      className="u-textNegative"
                    />
                    <span className="u-marginLeftExtraSmall u-textNegative">
                      Sign out
                    </span>
                  </div>
                </Dropdown.Item>
              </Dropdown.Container>
            </Dropdown>
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
