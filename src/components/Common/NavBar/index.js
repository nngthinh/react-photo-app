import "./Navbar.css";

const Navbar = () => {
  return <NavbarView />;
};

const NavbarView = () => {
  return (
    <div className="navbar">
      <div className="navbarWrapper">
        <div className="left">
          <div>Welcome to Photo app</div>
        </div>
        <div className="right">
          <button>Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
