import { signOutAction } from "actions/user";
import { useDispatch, useSelector } from "react-redux";
import "./Navbar.css";

const Navbar = () => {
  const userInfo = useSelector((state) => state.user.info);
  const dispatch = useDispatch();
  const dispatchSignOut = () => dispatch(signOutAction());
  return <NavbarView userInfo={userInfo} onSignOut={dispatchSignOut} />;
};

const NavbarView = ({ userInfo, onSignOut }) => {
  const isLoggedIn = userInfo ? true : false;
  return (
    <div className="navbar">
      <div className="navbarWrapper">
        <div className="left">
          <div>
            {isLoggedIn ? `Hi ${userInfo.name}!` : "Welcome to Photo app!"}
          </div>
        </div>
        <div className="right">
          {isLoggedIn ? <button>Sign Out</button> : <button>Sign In</button>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
