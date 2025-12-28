import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import Loader from "./Loader";
import { format } from "date-fns";

const DailySummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const dateInputRef = useRef();

  useEffect(() => {
    fetchDailySummary();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const fetchDailySummary = async (date = null) => {
    setLoading(true);
    setError(null);
    try {
      const dateToUse = date || selectedDate;
      const formattedDate = format(dateToUse, "yyyy-MM-dd");
      const url = `${RAILWAY_CONST.API_ENDPOINT.MANAGEMENT_DAILY_SUMMARY}?daily_report_date=${formattedDate}`;
      
      const response = await apiService("get", url);
      
      // Handle different response formats
      const responseData = response.data || response || [];
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error("Error fetching daily summary:", error);
      setError("Failed to fetch daily summary data. Please try again later.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    fetchDailySummary(newDate);
    setOpen(false);
  };

  // Generate columns dynamically from the first data item if available
  // Exclude before_halt_list as it will be added as additional columns
  // Order: report_id, date_of_analysis, date_of_working, train_id, train_type, 
  //        analyzed_by, lp_cms_id, crew_name, crew_designation, nominated_cli, then other columns
  const getColumns = () => {
    if (data.length > 0) {
      const allKeys = Object.keys(data[0]).filter((key) => key !== "before_halt_list");
      
      // Helper function to find key by various possible formats
      const findKey = (possibleNames) => {
        return allKeys.find((key) => 
          possibleNames.some(name => key.toLowerCase() === name.toLowerCase())
        );
      };
      
      // Define the ordered columns to look for
      const orderedColumns = [
        { names: ["report_id", "reportid", "id"], label: null },
        { names: ["date_of_analysis"], label: null },
        { names: ["date_of_working"], label: null },
        { names: ["train_id", "trainid"], label: null },
        { names: ["train_type", "traintype"], label: null },
        { names: ["analyzed_by", "analyzedby"], label: null },
        { names: ["lp_cms_id", "lp_cmsid", "lpcmsid"], label: null },
        { names: ["crew_name", "crewname"], label: null },
        { names: ["crew_designation", "crewdesignation"], label: null },
        { names: ["nominated_cli", "nominatedcli"], label: null },
      ];
      
      // Find all ordered column keys
      const orderedKeys = orderedColumns.map(col => findKey(col.names));
      
      // Get remaining keys (excluding the ones we've already identified)
      const otherKeys = allKeys.filter((key) => !orderedKeys.includes(key));
      
      // Create columns array in the correct order
      const columns = [];
      
      // Add ordered columns
      orderedKeys.forEach((key) => {
        if (key) {
          columns.push({
            key: key,
            label: key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          });
        }
      });
      
      // Add other columns
      otherKeys.forEach((key) => {
        columns.push({
          key: key,
          label: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        });
      });
      
      return columns;
    }
    // Default columns if no data
    return [
      { key: "id", label: "ID" },
      { key: "date", label: "Date" },
      { key: "trainNumber", label: "Train Number" },
      { key: "route", label: "Route" },
      { key: "status", label: "Status" },
    ];
  };

  // Get before_halt_list columns - one column for each distance
  const getBeforeHaltColumns = () => {
    if (data.length === 0) return [];
    
    // Find first item with before_halt_list
    const firstItemWithBeforeHalt = data.find(
      (item) => item.before_halt_list && typeof item.before_halt_list === "object"
    );
    
    if (!firstItemWithBeforeHalt?.before_halt_list) return [];
    
    const beforeHaltData = firstItemWithBeforeHalt.before_halt_list;
    
    // Extract distance keys (e.g., "2000m", "1000m", "200m", "100m")
    const distanceKeys = Object.keys(beforeHaltData)
      .filter((key) => !key.endsWith("_at") && /^\d+m$/.test(key))
      .sort((a, b) => {
        // Sort by numeric value descending
        const numA = parseInt(a.replace("m", ""));
        const numB = parseInt(b.replace("m", ""));
        return numB - numA;
      });
    
    // Create individual columns for each distance
    return distanceKeys.map((dist) => ({
      distance: dist,
      label: `Max Speed At ${dist}`,
    }));
  };

  const columns = getColumns();
  const beforeHaltColumns = getBeforeHaltColumns();

  // Format before_halt_list value for display (single distance)
  const formatBeforeHaltValue = (beforeHaltList, distance) => {
    if (!beforeHaltList || typeof beforeHaltList !== "object") return "-";
    
    const value = beforeHaltList[distance];
    const location = beforeHaltList[`${distance}_at`];
    
    if (value !== null && value !== undefined) {
      return location ? `${value} [${location}]` : String(value);
    }
    return "-";
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="loader">
            <Loader />
          </div>
        </div>
      ) : (
        <>
          <div className="w-full bg-[#efefef] min-h-screen">
            <div className="bg-white w-full sm:p-8 p-4 rounded-[15px] min-h-[900px] sm:pt-4">
              <h1 className="sm:text-[18px] rounded-[5px] font-normal flex-row flex justify-between text-[18px] text-[#fff] bg-[#2A235A] mb-1 border-b border-[#ccc] relative px-3 py-2 dailyReportTitle items-center">
                <span>Daily Summary</span>
                <div 
                  className="relative z-20 flex flow-row datePickerCol mt-1 text-[14px] cursor-pointer"
                  onClick={(e) => {
                    // Only trigger if clicking on the container or label, not the input itself
                    if (e.target !== dateInputRef.current) {
                      e.preventDefault();
                      dateInputRef.current?.click();
                    }
                  }}
                  ref={ref}
                >
                  <label 
                    className="text-[14px] inline-block min-w-[110px] pr-3 sm:mb-0 mt-1 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      dateInputRef.current?.click();
                    }}
                  >
                    Date :
                  </label>
                  <div className="relative">
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={format(selectedDate, "yyyy-MM-dd")}
                      onChange={handleDateChange}
                      className="border px-1 py-2 rounded-md w-[240px] cursor-pointer inputbox pl-2 -mt-1"
                    />
                  </div>
                </div>
              </h1>

              {error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No data available
                </div>
              ) : (
                <div style={{ overflowX: "auto", width: "100%" }}>
                  <div className="popUpRow w-full mt-4">
                    <table className="min-w-full">
                      <thead>
                        {/* Main header row */}
                        <tr className="bg-gray-200">
                          {columns.map((col, index) => (
                            <th
                              key={index}
                              className="border-r border-r-[#752f6b] px-4 py-4 text-[14px] font-normal bg-[#9b4b90] text-white text-center"
                            >
                              {col.label}
                            </th>
                          ))}
                          {beforeHaltColumns.length > 0 && (
                            <th
                              colSpan={beforeHaltColumns.length}
                              className="border-r border-r-[#752f6b] px-4 py-4 text-[14px] font-normal bg-[#9b4b90] text-white text-center"
                            >
                              Max Speed Before Halt
                            </th>
                          )}
                        </tr>
                        {/* Sub-header row for before_halt_list */}
                        {beforeHaltColumns.length > 0 && (
                          <tr className="bg-gray-200">
                            {columns.map((col, index) => (
                              <th
                                key={`sub-${index}`}
                                className="border-r border-r-[#752f6b] px-4 py-3 text-[13px] font-normal bg-[#9b4b90] text-white text-center"
                              ></th>
                            ))}
                            {beforeHaltColumns.map((col, index) => (
                              <th
                                key={`before-halt-${index}`}
                                className="border-r border-r-[#752f6b] px-4 py-3 text-[13px] font-normal bg-[#9b4b90] text-white text-center"
                              >
                                {col.label}
                              </th>
                            ))}
                          </tr>
                        )}
                      </thead>
                      <tbody>
                        {data.map((item, rowIndex) => {
                          // Find report ID from the item
                          const reportIdKey = Object.keys(item).find((key) => 
                            key.toLowerCase() === "report_id" || 
                            key.toLowerCase() === "reportid" ||
                            (key.toLowerCase() === "id" && item[key])
                          );
                          const reportId = reportIdKey ? item[reportIdKey] : null;
                          
                          return (
                            <tr 
                              key={rowIndex} 
                              className="text-center cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => {
                                if (reportId !== null && reportId !== undefined) {
                                  window.open(`/reports/${reportId}`, '_blank');
                                }
                              }}
                            >
                              {columns.map((col, colIndex) => {
                                const isReportId = 
                                  col.key.toLowerCase() === "report_id" || 
                                  col.key.toLowerCase() === "reportid" ||
                                  (col.key.toLowerCase() === "id" && item[col.key]);
                                const cellReportId = item[col.key];
                                
                                return (
                                  <td
                                    key={colIndex}
                                    className="border border-gray-300 p-2 text-[13px] text-[#4B5563]"
                                  >
                                    {isReportId && cellReportId !== null && cellReportId !== undefined ? (
                                      <Link
                                        to={`/reports/${cellReportId}`}
                                        className="text-[#9b4b90] hover:underline cursor-pointer"
                                        target="_blank"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {String(cellReportId)}
                                      </Link>
                                    ) : item[col.key] !== null && item[col.key] !== undefined ? (
                                      String(item[col.key])
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                );
                              })}
                              {beforeHaltColumns.map((col, colIndex) => (
                                <td
                                  key={`before-halt-${colIndex}`}
                                  className="border border-gray-300 p-2 text-[13px] text-[#4B5563]"
                                >
                                  {formatBeforeHaltValue(item.before_halt_list, col.distance)}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DailySummary;

