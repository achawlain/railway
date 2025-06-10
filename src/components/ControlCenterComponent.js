import React, { useState, useEfffect } from "react";
import Reports from "../pages/Reports";
import LocoPilotReport from "./LocoPilotReport";
import ManageLocoPilot from "./ManageLocoPilot";

const ControlCenterComponent = () => {
  const [selectedtab, setSelectedTab] = useState("Daily Report");
  return (
    <div>
      <div className="w-full flex flex-row">
        <div className="leftMenuCol w-[300px] bg-[#2c215d] h-[calc(100vh_-_90px)] fixed top-[90px]">
          {/* <div className="text-[#fff] border-b-2 border-[#fff] px-4 py-4 text-[22px]">
            Reports
          </div> */}
          <ul>
            <li
              onClick={() => setSelectedTab("Daily Report")}
              className={`${
                selectedtab === "Daily Report" ? "selectedCol" : null
              } cursor-pointer`}
            >
              Daily Report
            </li>
            <li
              onClick={() => setSelectedTab("Loco Pilot Report")}
              className={`${
                selectedtab === "Loco Pilot Report" ? "selectedCol" : null
              }  cursor-pointer`}
            >
              Loco Pilot Report
            </li>
            <li
              onClick={() => setSelectedTab("Manage Loco Pilot")}
              className={`${
                selectedtab === "Manage Loco Pilot" ? "selectedCol" : null
              }  cursor-pointer`}
            >
              Manage Loco Pilot
            </li>
          </ul>
        </div>
        <div className="rightContentCol w-full pl-[300px]">
          <div className="w-full">
            <h1 className="text-[22px] text-[#30424c] font-medium mb-4 text-center pb-2 relative pt-4">
              Control Center
            </h1>
          </div>
          {selectedtab === "Daily Report" ? <Reports /> : null}
          {selectedtab === "Loco Pilot Report" ? <LocoPilotReport /> : null}
          {selectedtab === "Manage Loco Pilot" ? <ManageLocoPilot /> : null}
        </div>
      </div>
    </div>
  );
};
export default ControlCenterComponent;
