import React from "react";
import LocoPilotReportTable from "./LocoPilotReportTable";

const LocoPilotReport = () => {
  return (
    <div className="w-full bg-[#efefef] p-4 min-h-screen">
      <div className="bg-white w-full sm:p-8 p-4 rounded-[15px] min-h-[900px] sm:pt-4">
        <LocoPilotReportTable />
      </div>
    </div>
  );
};

export default LocoPilotReport;
