import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import ScrollToTopButton from "./ScrollToTopComponent";

const WithHeaderLayout = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/home";
  return (
    <div>
      <Header/>
      <div className="containerLayout mt-[60px] w-full pt-[20px]">
      <Outlet />
      </div>
      {showFooter && <Footer />} 
      <ScrollToTopButton />
    </div>
  );
};

export default WithHeaderLayout;