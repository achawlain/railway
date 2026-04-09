import React, { useState, useEffect, useRef, use } from "react";
import ChartComponent from "./ChartComponent";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";
import { format, subDays } from "date-fns";
import { DateRange } from "react-date-range";
import LocoPilotReportTable from "./LocoPilotReportTable";
import Loader from "./Loader"; // Import the Loader component
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function ReportsChart() {
  const toastRef = useRef();
  const [loading, setLoading] = useState(false);
  const [chartReportsData, setChartReportData] = useState(null);
  const [range, setRange] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [open, setOpen] = useState(false);
  const ref = useRef();

  const getChartReportData = async (start_date, end_date) => {
    setLoading(true);
    const url = `${RAILWAY_CONST.API_ENDPOINT.MANAGEMENT_SUMMARY}?start_date=${start_date}&end_date=${end_date}`;
    try {
      const response = await apiService("get", url);
      setChartReportData(JSON.parse(response.data));
    } catch (error) {
      console.error("Error fetching chart data:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch chart data. Please try again later.",
        life: 3000,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch for default date range
    const formattedStartDate = format(range[0].startDate, "yyyy-MM-dd");
    const formattedEndDate = format(range[0].endDate, "yyyy-MM-dd");
    getChartReportData(formattedStartDate, formattedEndDate);
  }, []);

  const handleSelect = (item) => {
    setRange([item.selection]);
    const formattedStartDate = format(item.selection.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(item.selection.endDate, "yyyy-MM-dd");

    if (
      formattedStartDate &&
      formattedEndDate &&
      formattedStartDate !== formattedEndDate
    ) {
      setRange([item.selection]);
      getChartReportData(formattedStartDate, formattedEndDate);
      setOpen(false);
    }
  };

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

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
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
                <span>Daily Reports</span>
                <div className="relative text-[15px] flex flow-row datePickerCol items-center">
                  <label className="text-[16px] inline-block min-w-[110px] pr-3 mb-2 sm:mb-0">
                    Date Range :
                  </label>
                  <input
                    readOnly
                    value={`${format(
                      range[0].startDate,
                      "dd/MM/yyyy"
                    )} - ${format(range[0].endDate, "dd/MM/yyyy")}`}
                    onClick={() => setOpen(!open)}
                    className="border px-1 py-2 rounded-md w-[250px] cursor-pointer inputbox pl-2"
                  />
                  {open && (
                    <div
                      ref={ref}
                      className="absolute z-10 mt-[44px] shadow-lg border right-0 bg-white"
                    >
                      <DateRange
                        editableDateInputs
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                        months={2}
                        direction={
                          window.innerWidth > 600 ? "horizontal" : "vertical"
                        }
                      />
                    </div>
                  )}
                </div>
              </h1>

              <div style={{ overflowX: "auto", width: "100%" }}>
                <ChartComponent
                  loading={loading}
                  chartData={chartReportsData}
                />
              </div>
            </div>
            {/* <div>
              <LocoPilotReportTable />
            </div> */}
          </div>
        </>
      )}
    </>
  );
}

export default ReportsChart;
