
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../src/images/logo.png";
import RAILWAY_CONST from "../utils/RailwayConst"
import railPlotLogo from "../../src/images/railPlotLogo.png";
import logoIconRailPlot from "../../src/images/logoIconRailPlot.png";

const WithoutHeaderLayout = () => {
  return (
    <div>
       <header className="headerRow top-0 z-20 fixed bg-white w-full flex justify-between items-center px-4 shadow-md">
      <div className="max-w-[1300px] mx-auto flex flex-row justify-between w-full">
        {/* Logo */}
        <div className="h-[90px] logoHeader">
              <Link
                to={
                  RAILWAY_CONST.ROUTE.HOME
                }
              >
              
                <span className="flex flex-row">
                  <img
                    src={logoIconRailPlot}
                    alt="logo"
                    className="h-[44px] mr-[4px]"
                  />
                  <span>
                    <img
                      src={railPlotLogo}
                      alt="logo"
                      className="h-[30px] mt-[2px] mb-[-3px]"
                    />
                    <span className=" text-[10px] ml-[1px]">
                      Visualize. Analyze. Optimize.
                    </span>
                  </span>
                </span>
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
