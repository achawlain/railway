import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import DashboardCardComponent from "./DashboardCardComponent";
import ErrorPopUpComponent from "./ErrorPopUpComponent";
import Loader from "./Loader"; // Import the Loader component
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DashboardComponent = () => {
  const [reports, setReports] = useState([]);
  const [departure_date, setDeparture_date] = useState(null);
  const [lp_cms_id, setLp_cms_id] = useState("");
  const [arrival_date, setArrival_date] = useState(null);
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

    try {
      const formattedDepartureDate = departure_date
        ? departure_date.toISOString().split("T")[0]
        : null; // e.g., "2025-03-08"
      const formattedArivalDate = arrival_date
        ? arrival_date.toISOString().split("T")[0]
        : null; // e.g., "2025-03-08"
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.REPORTS_SLASH,
        {},
        {
          departure_date: formattedDepartureDate,
          arrival_date: formattedArivalDate,
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
                  <h1 className="text-[22px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
                    Reports
                    <div className="absolute sm:top-0 top-[15px] right-0 flex flex-row filterCol z-20">
                      <span
                        className={`${
                          showFilter ? "text-[#9b4b90] " : "text-[#30424c]"
                        }right-0 cursor-pointer flex flex-row sm:text-[18px] text-[16px] items-center justify-center  hover:text-[#000] mr-8 underline`}
                        onClick={() => setShowFilter(!showFilter)}
                      >
                        + Filter
                      </span>
                      {showFilter && (
                        <div className="absolute flex flex-col top-[32px] w-[300px] sm:right-[116px] right-[26px] bg-[#f6f6f6] shadow-md filterDropDown">
                          <span className="flex flex-col p-4 ">
                            <div className="flex flex-col w-full mb-2">
                              <label className="text-[16px]">Departure</label>
                              <DatePicker
                                selected={departure_date}
                                onChange={(date) => setDeparture_date(date)}
                                className="border px-3 py-2 rounded-md w-[150px]"
                                dateFormat="yyyy-MM-dd"
                              />
                            </div>
                            <div className="flex flex-col w-full mb-2">
                              <label className="text-[16px]">Arrival</label>
                              <DatePicker
                                selected={arrival_date}
                                onChange={(date) => setArrival_date(date)}
                                className="border px-3 py-2 rounded-md w-[150px]"
                                dateFormat="yyyy-MM-dd"
                              />
                            </div>
                            <div className="flex flex-col w-full mb-2">
                              <label className="text-[16px]">LP CMS ID</label>
                              <input
                                name="lp_cms_id"
                                value={lp_cms_id}
                                type="text"
                                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
                                onChange={(e) => setLp_cms_id(e.target.value)}
                              />
                            </div>
                            <div className="w-full flex justify-end mt-4 mb-2">
                              <button
                                onClick={() => {
                                  setDeparture_date(null);
                                  setArrival_date(null);
                                  setLp_cms_id("");
                                  setShowFilter(false); // optionally close the filter box
                                  getReports(); // reload full data
                                }}
                                className="bg-[#2c215d] text-white px-8 py-1 mt-4 sm:mt-0 text-[16px] mr-[10px]"
                              >
                                Clear
                              </button>
                              <button
                                onClick={handleFilterData}
                                className="bg-[#9b4b90] text-white px-8 py-1 mt-4 sm:mt-0 text-[16px] ml-[10px]"
                              >
                                Filter
                              </button>
                            </div>
                          </span>
                        </div>
                      )}
                      <Link to={RAILWAY_CONST.ROUTE.TEMPLATE}>
                        <span className="right-0 flex flex-row sm:text-[18px] text-[16px] items-center justify-center text-[#30424c] hover:text-[#000] underline">
                          + Analyze New
                        </span>
                      </Link>
                    </div>
                  </h1>

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
