import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, Icon, Dropdown, Toggle, Separator } from "@ahaui/react";
import { signOutAction } from "actions/user";
import { showModalAction, clearModalAction } from "actions/modal";
import { notifyNegative, notifyPositive } from "../Toast";
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
  const navigateSignIn = (e) => {
    navigate(`/signin`);
  };
  const navigateHome = () => {
    navigate(`/`);
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

  // Greeting (just for fun)
  const greeting = (username) => {
    const hour = new Date().getHours();
    return `Good ${
      5 <= hour && hour < 12
        ? "morning"
        : 12 <= hour && hour < 17
        ? "afternoon"
        : 17 <= hour && hour < 21
        ? "evening"
        : "night"
    }, ${String(username)}!`;
  };

  // Return view
  return (
    <div className="navbar u-shadowSmall">
      <div className="navbarWrapper container">
        <div className="left Brown500 u-flex u-alignItemsCenter">
          <span
            data-testid="home"
            className="home u-fontBold u-text400"
            onClick={() => navigateHome()}
          >
            PhotoApp
          </span>
        </div>
        <div className="right u-flex u-alignItemsCenter ">
          <div className="u-marginRightSmall">
            {isLoggedIn ? greeting(user.info?.name) : "Welcome to PhotoApp!"}
          </div>
          <Dropdown alignRight className="profile">
            <Dropdown.Toggle className="u-lineHeightNone">
              <div>
                {isLoggedIn ? (
                  <Avatar
                    data-testid="avatar"
                    className="u-backgroundPrimaryLight"
                    text={user.info?.name[0].toUpperCase()}
                    size="medium"
                  />
                ) : (
                  <Icon
                    data-testid="avatar"
                    size="medium"
                    name="contact"
                    className="u-textGray"
                  />
                )}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Container className="u-paddingVerticalExtraSmall u-marginTopExtraSmall">
              {/* <Separator variant="lighter" /> */}
              <Dropdown.Item
                className="u-flex u-justifyContentCenter u-alignItemsCenter u-paddingVerticalExtraSmall"
                onClick={() => setIsDark(!isDark)}
              >
                <Toggle
                  checked={isDark}
                  textLabelOn={"Dark mode"}
                  textLabelOff={"Light mode"}
                />
              </Dropdown.Item>
              <Separator variant="lighter" className="u-marginTopExtraSmall" />
              {isLoggedIn ? (
                <Dropdown.Item
                  data-testid="signOutButton"
                  className="u-flex u-justifyContentCenter u-alignItemsCenter u-paddingVerticalExtraSmall u-marginTopExtraSmall"
                  onClick={() => handleSignOut()}
                >
                  <Icon name="power" size="small" className="u-textNegative" />
                  <span className="u-marginLeftExtraSmall u-textNegative">
                    Sign out
                  </span>
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  data-testid="navigateSignInButton"
                  className="u-flex u-justifyContentCenter u-alignItemsCenter u-paddingVerticalExtraSmall u-marginTopExtraSmall"
                  onClick={() => navigateSignIn()}
                >
                  <Icon
                    name="arrowForward"
                    size="small"
                    className="u-textPrimary"
                  />
                  <span className="u-marginLeftExtraSmall u-textPrimary">
                    Sign in
                  </span>
                </Dropdown.Item>
              )}
            </Dropdown.Container>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
