
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../src/images/railwayLogo.png";
import RAILWAY_CONST from "../utils/RailwayConst"


const WithoutHeaderLayout = () => {
  return (
    <div>
       <header className="headerRow top-0 z-20 fixed bg-white w-full flex justify-between items-center px-4 shadow-md">
      <div className="max-w-[1300px] mx-auto flex flex-row justify-between w-full">
        {/* Logo */}
        <div>
          <Link to={RAILWAY_CONST.ROUTE.HOME}>
            <img className="sm:h-[80px] h-[24px] mt-[5px]" src={logo} alt="Logo" />
          </Link>
        </div>
       
      </div>
    </header>
      <Outlet />
      <div className="fixed bottom0 z-20 w-full">
      <Footer />
      </div>
    </div>
  );
};

export default WithoutHeaderLayout;
