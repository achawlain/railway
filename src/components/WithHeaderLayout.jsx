import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const WithHeaderLayout = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/home";
  return (
    <div>
      <Header/>
      <div className="containerLayout mt-[60px] w-full pt-[30px]">
      <Outlet />
      </div>
      {showFooter && <Footer />} 
    </div>
  );
};

export default WithHeaderLayout;