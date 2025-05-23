import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import DashboardCardComponent from "./DashboardCardComponent";
import ErrorPopUpComponent from "./ErrorPopUpComponent";
import Loader from "./Loader"; // Import the Loader component

import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme

const DashboardComponent = () => {
  const [reports, setReports] = useState([]);
  const [start_date, setstart_date] = useState(null);
  const [lp_cms_id, setLp_cms_id] = useState("");
  const [end_date, setEnd_date] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true); // State for loader
  const [errorPopupState, setErrorPopupState] = useState({
    isShow: false,
    message: "",
  });
  const [redirect, setRedirect] = useState("");
  useEffect(() => {
    getReports();
  }, []);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [open, setOpen] = useState(false);
  const ref = useRef();

  const getReports = async () => {
    setLoading(true);
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.REPORTS_SLASH
      );
      setReports(
        Array.isArray(response.data) ? response.data : response.reports || []
      );
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
    setLoading(false);
  };

  const handleDeleteItem = (item) => {};
  const goToPdfView = (item) => {};

  const handleFilterData = async () => {
    setLoading(true);
    setOpen(false);
    try {
      const formattedDepartureDate = start_date
        ? format(start_date, "yyyy-MM-dd")
        : null;

      const formattedArivalDate = end_date
        ? format(end_date, "yyyy-MM-dd")
        : null;
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.REPORTS_SLASH,
        {},
        {
          start_date: formattedDepartureDate,
          end_date: formattedArivalDate,
          lp_cms_id: lp_cms_id,
        }
      );

      setReports(
        Array.isArray(response.data) ? response.data : response.reports || []
      );
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    const newStartDate = item.selection.startDate;
    const newEndDate = item.selection.endDate;

    setRange([item.selection]);
    setstart_date(newStartDate);
    setEnd_date(newEndDate);

    if (newStartDate && newEndDate && newStartDate !== newEndDate) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false); // 👈 Close calendar if click is outside
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
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="loader">
            <Loader />
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="w-full bg-[#efefef] sm:p-4 p-2 reportGenerateBg pt-8 min-h-screen">
              <div className="max-w-full mx-auto px-2 mb-4">
                <div className="bg-white w-full sm:p-8 p-4  pt-2 rounded-[15px]">
                  <h1 className="text-[22px] text-[#30424c] font-medium mb-4 border-b border-[#ccc] pb-2 relative pt-2">
                    Reports
                    <div className="absolute sm:top-0 top-[15px] right-0 flex flex-row filterCol z-20">
                      <Link to={RAILWAY_CONST.ROUTE.TEMPLATE}>
                        <span className="right-0 flex flex-row sm:text-[18px] text-[16px] items-center justify-center text-[#30424c] hover:text-[#000] underline">
                          + Analyze New
                        </span>
                      </Link>
                    </div>
                  </h1>
                  <div className="w-full flex justify-end mb-2">
                    <div className=" flex flex-col top-[32px]  filterDropDown  max-w-[1000px] ">
                      <span className="flex flex-row bg-[#f6f6f6] pt-[10px] mb-4 px-4">
                        {/* <div className="flex flex-row w-full mb-2 mr-2">
                          <label className="text-[16px]">Start Date: </label>
                          <DatePicker
                            selected={start_date}
                            onChange={(date) => setstart_date(date)}
                            className="border px-3 py-2 rounded-md w-[90px]"
                            dateFormat="dd-MM-yyyy"
                          />
                        </div>
                        <div className="flex flex-row w-full mb-2  mr-2">
                          <label className="text-[16px]">End Date: </label>
                          <DatePicker
                            selected={end_date}
                            onChange={(date) => setEnd_date(date)}
                            className="border px-3 py-2 rounded-md w-[90px]"
                            dateFormat="dd-MM-yyyy"
                          />
                        </div> */}
                        <div className="relative flex flow-row datePickerCol">
                          <label className="text-[16px] inline-block min-w-[80px]">
                            Date Range :
                          </label>
                          {/* Custom Input Field */}
                          <input
                            readOnly
                            value={`${format(
                              range[0].startDate,
                              "dd/MM/yyyy"
                            )} - ${format(range[0].endDate, "dd/MM/yyyy")}`}
                            onClick={() => setOpen(!open)}
                            className="border px-1 py-2 rounded-md w-[250px] cursor-pointer inputbox"
                          />

                          {/* Conditional Calendar Display */}
                          {open && (
                            <div
                              ref={ref}
                              className="absolute z-10 mt-[44px] shadow-lg border bg-white"
                            >
                              <DateRange
                                onChange={handleSelect}
                                editableDateInputs={true}
                                moveRangeOnFirstSelection={false}
                                ranges={range}
                                months={2} // <-- Shows 2 months
                                direction="horizontal"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row w-full mb-2">
                          <label className="text-[16px] inline-block min-w-[80px]">
                            LP CMS :
                          </label>
                          <input
                            name="lp_cms_id"
                            value={lp_cms_id}
                            type="text"
                            className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 py-1 h-[35px] w-[160px]"
                            onChange={(e) => setLp_cms_id(e.target.value)}
                          />
                        </div>
                        <div className="w-full flex justify-end mb-2">
                          <button
                            onClick={handleFilterData}
                            className="bg-[#9b4b90] h-[32px] text-white px-8 py-1 sm:mt-0 text-[16px] ml-4"
                          >
                            Filter
                          </button>
                          <button
                            onClick={() => {
                              setstart_date(null);
                              setEnd_date(null);
                              setLp_cms_id("");
                              setShowFilter(false); // optionally close the filter box
                              getReports(); // reload full data
                              setOpen(false);
                            }}
                            className="bg-[#2c215d] h-[32px] text-white px-8 py-1 sm:mt-0 text-[16px]  ml-[10px]"
                          >
                            Clear
                          </button>
                        </div>
                      </span>
                    </div>
                  </div>

                  {/* <div className="listTable w-full flex flex-row flex-wrap mb-[50px]"> */}
                  <div className="listTable w-full flex flex-wrap mb-[50px]">
                    {reports.length > 0 ? (
                      reports.map((item) => (
                        <DashboardCardComponent
                          key={item.id}
                          item={item}
                          onDelete={handleDeleteItem}
                          onView={goToPdfView}
                          refreshReports={getReports}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500">No reports available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ErrorPopUpComponent
            isErrorShow={errorPopupState.isShow}
            errorMessage={errorPopupState.message}
            redirect={redirect}
          />
        </>
      )}
    </>
  );
};

export default DashboardComponent;
