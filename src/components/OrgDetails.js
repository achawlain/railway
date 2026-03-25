import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import Plot from "react-plotly.js";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function OrgDetails() {
  const { id } = useParams();
  const location = useLocation();

  const orgName = location.state?.org_name;

  const [chartData, setChartData] = useState(null);

  // ✅ Date Range State
  const [showPicker, setShowPicker] = useState(false);

  const today = new Date();

const lastMonth = new Date();
lastMonth.setDate(today.getDate() - 30);

const [range, setRange] = useState([
  {
    startDate: lastMonth,
    endDate: today,
    key: "selection"
  }
]);


  useEffect(() => {
    fetchChartData();
  }, [id, range]);

  const fetchChartData = async () => {
    try {
      const start = range[0].startDate.toISOString().split("T")[0];
      const end = range[0].endDate.toISOString().split("T")[0];

      let url = `${RAILWAY_CONST.API_ENDPOINT.ORGANISATION_DETAILS}/${id}`;
      url += `?start_date=${start}&end_date=${end}`;

      const response = await apiService("get", url);
      console.log(response, "OrgDetails Response");
      const parsed = JSON.parse(response.data);
      console.log(parsed, "Parsed Chart Data");
      setChartData(parsed);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Format dd/mm/yyyy
  const formatDate = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    
     <div className="min-h-screen bg-gradient-to-r from-[#4b2a7a] to-[#9b4b90] p-6 minHeight-150vh" style={{ minHeight: "150vh", height: "auto", display: "block" }}>
    
    <div className="w-full bg-white rounded-2xl shadow-xl p-6 mx-auto min-h-screen" style={{ minHeight: "150vh", height: "auto" }}>

        {/* Org Name */}
        <h1 className="text-2xl font-bold text-center">
          {orgName || "Organisation Name"}
        </h1>

        {/* Divider */}
        <div className="border-b-2 border-gray-300 my-3"></div>

       {/* Header */}
        <div className="flex justify-between items-center bg-[#2A235A] text-white px-4 py-3 rounded-md relative">

        {/* ✅ Left side */}
        <span className="font-medium">Daily Reports</span>

        {/* ✅ Right side (Date Range Box) */}
        <div
            className="flex items-center px-4 py-2 rounded-md cursor-pointer"
            onClick={() => setShowPicker(!showPicker)}
        >
            <span className="mr-2 font-medium">Date Range :</span>

            <span>
            {formatDate(range[0].startDate)} -{" "}
            {formatDate(range[0].endDate)}
            </span>

            <span className="ml-3">📅</span>
        </div>

        {/* Calendar Popup */}
        {showPicker && (
            <div className="absolute top-16 right-4 z-50 shadow-lg">
            <DateRange
                editableDateInputs={true}
                onChange={(item) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
            />
            </div>
        )}

        </div>

        {/* Chart */}
        <div className="mt-6">
          {chartData && chartData.data && chartData.data.length > 0 ? (
            <Plot
              data={chartData.data}
              layout={{
                ...chartData.layout,
                autosize: true
              }}
              style={{ width: "100%", height: "450px" }}
              useResizeHandler={true}
            />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p>No Data Available</p>
            </div>
          )}
        </div>

      </div>
    </div>

  );
}

export default OrgDetails;