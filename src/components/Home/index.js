import Navbar from "components/Common/NavBar";
import { Route, Routes } from "react-router-dom";
import Blank from "./Blank";

const Home = () => {
  return <HomwView />;
};

const HomwView = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Blank />}></Route>
      </Routes>
    </>
  );
};

export default Home;
