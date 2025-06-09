
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
                    className="h-[51px] mr-[4px]"
                  />
                  <span className="flex flex-col">
                    <img
                      src={railPlotLogo}
                      alt="logo"
                      className="h-[30px] mb-[4px]"
                    />
                    <span className=" text-[10px] ml-[1px] leading-[14px] border-black border-b border-t inline-block">
                      <span className="text-[#d7270c] text-[13px] font-bold">
                        V
                      </span>
                      isualize{" "}
                      <span className="text-[#d7270c] text-[13px] font-bold">
                        A
                      </span>
                      nalyze{" "}
                      <span className="text-[#d7270c] text-[13px] font-bold">
                        O
                      </span>
                      ptimize
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
