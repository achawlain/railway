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

  const [stats, setStats] = useState({
    activeUsers: 0,
    activeTemplates: 0,
    deletedUsers: 0,
    deletedTemplates: 0
  });

  const [cachedData, setCachedData] = useState({
    activeUsers: [],
    deletedUsers: [],
    activeTemplates: [],
    deletedTemplates: []
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [popupTitle, setPopupTitle] = useState("");

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
    fetchStats();
  }, [id, range]);

  const fetchChartData = async () => {
    try {
      const start = range[0].startDate.toISOString().split("T")[0];
      const end = range[0].endDate.toISOString().split("T")[0];

      let url = `${RAILWAY_CONST.API_ENDPOINT.ORGANISATION_DETAILS}/${id}`;
      url += `?start_date=${start}&end_date=${end}`;

      const response = await apiService("get", url);
      const parsed = JSON.parse(response.data);
      setChartData(parsed);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const [
        activeUsersRes,
        deletedUsersRes,
        activeTemplatesRes,
        deletedTemplatesRes,
      ] = await Promise.all([
        apiService("get", `${RAILWAY_CONST.API_ENDPOINT.USERS}?is_deleted=0`),
        apiService("get", `${RAILWAY_CONST.API_ENDPOINT.USERS}?is_deleted=1`),
        apiService("get", `${RAILWAY_CONST.API_ENDPOINT.TEMPLATE_STATUS}?is_deleted=0`),
        apiService("get", `${RAILWAY_CONST.API_ENDPOINT.TEMPLATE_STATUS}?is_deleted=1`),
      ]);

      const activeUsers = activeUsersRes?.data?.users || [];
      const deletedUsers = deletedUsersRes?.data?.users || [];
      const activeTemplates = activeTemplatesRes?.data?.users || [];
      const deletedTemplates = deletedTemplatesRes?.data?.users || [];

      setCachedData({
        activeUsers,
        deletedUsers,
        activeTemplates,
        deletedTemplates
      });

      setStats({
        activeUsers: activeUsers.length,
        deletedUsers: deletedUsers.length,
        activeTemplates: activeTemplates.length,
        deletedTemplates: deletedTemplates.length,
      });

    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  const handleCardClick = (type, title) => {
    const dataMap = {
      active_users: cachedData.activeUsers,
      deleted_users: cachedData.deletedUsers,
      active_templates: cachedData.activeTemplates,
      deleted_templates: cachedData.deletedTemplates,
    };

    setPopupTitle(title);
    setPopupData(dataMap[type] || []);
    setShowPopup(true);
  };

  // ✅ ID FIRST LOGIC
  const getColumns = () => {
    if (!popupData.length) return [];
    const keys = Object.keys(popupData[0]);
    return ["id", ...keys.filter((key) => key !== "id")];
  };

  const formatDate = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-[#4b2a7a] to-[#9b4b90] p-3 sm:p-6">

        <div className="w-full bg-white rounded-2xl shadow-xl p-4 sm:p-6 mx-auto">

          <h1 className="text-xl sm:text-2xl font-bold text-center">
            {orgName || "Organisation Name"}
          </h1>

          <div className="border-b-2 border-gray-300 my-3"></div>

          <div className="flex flex-col sm:flex-row justify-between items-center bg-[#2A235A] text-white px-4 py-3 rounded-md relative gap-3 sm:gap-0">

            <span className="font-medium text-sm sm:text-base">Daily Reports</span>

            <div
              className="flex items-center px-3 sm:px-4 py-2 rounded-md cursor-pointer text-sm sm:text-base"
              onClick={() => setShowPicker(!showPicker)}
            >
              <span className="mr-2 font-medium">Date Range :</span>

              <span className="text-xs sm:text-sm">
                {formatDate(range[0].startDate)} -{" "}
                {formatDate(range[0].endDate)}
              </span>

              <span className="ml-2 sm:ml-3">📅</span>
            </div>

            {showPicker && (
              <div className="absolute top-16 right-4 z-50 shadow-lg scale-75 sm:scale-100 origin-top-right">
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
          <div className="mt-6 w-full">
            {chartData && chartData.data && chartData.data.length > 0 ? (
              <Plot
                data={chartData.data}
                layout={{
                  ...chartData.layout,
                  autosize: true,
                  margin: { l: 60, r: 30, t: 40, b: 50 }
                }}
                style={{ width: "100%" }}
                useResizeHandler={true}
              />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p>No Data Available</p>
              </div>
            )}
          </div>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">

          {[
            ["active_users", "Active Users", stats.activeUsers],
            ["active_templates", "Active Templates", stats.activeTemplates],
            ["deleted_users", "Deleted Users", stats.deletedUsers],
            ["deleted_templates", "Deleted Templates", stats.deletedTemplates],
          ].map(([type, title, value]) => (
            <div
              key={type}
              onClick={() => handleCardClick(type, title)}
              className="bg-white shadow-lg rounded-2xl px-6 sm:px-8 py-5 sm:py-6 text-center cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <p className="text-base sm:text-lg font-semibold text-gray-700">{title}</p>
              <p className="text-xl sm:text-2xl font-bold text-[#4b2a7a] mt-2">
                {value}
              </p>
            </div>
          ))}

        </div>

        {/* Popup */}
        {showPopup && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            onClick={() => setShowPopup(false)}
          >
            <div
              className="bg-white rounded-xl w-[95vw] sm:w-[600px] max-h-[80vh] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg sm:text-xl font-bold">{popupTitle}</h2>
                <button onClick={() => setShowPopup(false)}>❌</button>
              </div>

              <div className="overflow-y-auto overflow-x-auto p-4 sm:p-6">
                {popupData.length > 0 ? (
                  <table className="w-full text-xs sm:text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-[#2A235A] text-white">
                        {getColumns().map((key) => (
                          <th key={key} className="px-2 sm:px-4 py-2 capitalize whitespace-nowrap">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {popupData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          {getColumns().map((key, i) => (
                            <td key={i} className="px-2 sm:px-4 py-2 border-b text-gray-700">
                              {item[key] ?? "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No Data Found</p>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default OrgDetails;