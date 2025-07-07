import React, { useState, useEffect } from "react";
import Reports from "../pages/Reports";
import LocoPilotReport from "./LocoPilotReport";
import ManageLocoPilot from "./ManageLocoPilot";
import BreakingPattern from "./BreakingPattern";

import dailyReportIcon from "../images/DailyReport.svg";
import locoPilotReport from "../images/locoPilotReport.svg";
import locoPilotIcon from "../images/locoPilotIcon.svg";
import breakPatternIcon from "../images/breakPatternIcon.svg";

const ControlCenterComponent = () => {
  const [selectedtab, setSelectedTab] = useState("Daily Report");
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSelectTab = (tab) => {
    setSelectedTab(tab);
    setIsShowMenu(false);
  };
  return (
    <div>
      <div className="w-full hideDesktop">
        <h1 className="text-[22px] text-[#30424c] font-medium mb-4 text-center pb-2 relative pt-4">
          Control Center
        </h1>
      </div>
      <div className="w-full flex flex-row controlCenterCol">
        <div className="leftMenuCol w-[300px] bg-[#2c215d] h-[calc(100vh_-_80px)] fixed top-[80px] z-20">
          {/* <div className="text-[#fff] border-b-2 border-[#fff] px-4 py-4 text-[22px]">
            Reports
          </div> */}
          <div className="leftColInner">
            <div
              className={`hideDesktop showSelectedItem z-30 relative ${
                isShowMenu ? "active" : ""
              } `}
              onClick={() => setIsShowMenu(!isShowMenu)}
            >
              {selectedtab}{" "}
            </div>
            {(isShowMenu || windowWidth > 768) && (
              <ul className="bg-[#2c215d]">
                <li
                  onClick={() => handleSelectTab("Daily Report")}
                  className={`${
                    selectedtab === "Daily Report" ? "selectedCol" : null
                  } cursor-pointer flex items-center border-b border-b-[#030015]`}
                >
                  <span className="w-[40px] mr-[15px]">
                    <img
                      src={dailyReportIcon}
                      alt="icon"
                      className=" h-[36px]"
                    />
                  </span>
                  Daily Report
                </li>
                <li
                  onClick={() => handleSelectTab("Loco Pilot Report")}
                  className={`${
                    selectedtab === "Loco Pilot Report" ? "selectedCol" : null
                  } cursor-pointer flex items-center border-b border-b-[#030015]`}
                >
                  <span className="w-[40px] mr-[15px]">
                    <img
                      src={locoPilotReport}
                      alt="icon"
                      className=" h-[30px] "
                    />
                  </span>
                  Loco Pilot Report
                </li>
                <li
                  onClick={() => handleSelectTab("Manage Loco Pilot")}
                  className={`${
                    selectedtab === "Manage Loco Pilot" ? "selectedCol" : null
                  }  cursor-pointer flex items-center  border-b border-b-[#030015]`}
                >
                  <span className="w-[40px] mr-[15px]">
                    <img src={locoPilotIcon} alt="icon" className=" h-[30px]" />
                  </span>
                  Manage Loco Pilot
                </li>
                <li
                  onClick={() => handleSelectTab("Breaking Pattern")}
                  className={`${
                    selectedtab === "Breaking Pattern" ? "selectedCol" : null
                  }  cursor-pointer flex items-center  border-b border-b-[#030015]`}
                >
                  <span className="w-[40px] mr-[15px]">
                    <img
                      src={breakPatternIcon}
                      alt="icon"
                      className=" h-[30px]"
                    />
                  </span>
                  Breaking Pattern
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="rightContentCol w-full pl-[300px] z-10">
          <div className="w-full hideMobile">
            <h1 className="text-[22px] text-[#30424c] font-medium text-center pb-3 relative pt-3">
              Control Center
            </h1>
          </div>
          {selectedtab === "Daily Report" ? <Reports /> : null}
          {selectedtab === "Loco Pilot Report" ? <LocoPilotReport /> : null}
          {selectedtab === "Manage Loco Pilot" ? <ManageLocoPilot /> : null}
          {selectedtab === "Breaking Pattern" ? <BreakingPattern /> : null}
        </div>
      </div>
    </div>
  );
};
export default ControlCenterComponent;
