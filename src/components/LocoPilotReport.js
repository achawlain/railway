import React from "react";
import LocoPilotReportTable from "./LocoPilotReportTable";

const LocoPilotReport = () => {
  return (
    <div className="w-full bg-[#efefef] p-4  pt-8 min-h-screen">
      <div className="bg-white w-full sm:p-8 p-4 pt-4 rounded-[15px] min-h-[900px]">
        <h1 className="sm:text-[22px] text-[18px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
          Loco Pilot Report
        </h1>
          <LocoPilotReportTable />
      </div>
    </div>
  );
};

export default LocoPilotReport;
