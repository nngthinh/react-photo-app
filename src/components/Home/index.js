import Navbar from "components/Common/NavBar";
import Sidebar from "components/Common/SideBar";
import { Route, Routes } from "react-router-dom";
import Blank from "./Blank";

const Home = () => {
  return <HomwView />;
};

const HomwView = () => {
  return (
    <>
      <Navbar />
      <Sidebar></Sidebar>
      <Routes>
        <Route path="/" element={<Blank />}></Route>
      </Routes>
    </>
  );
};

export default Home;
