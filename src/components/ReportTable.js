import React, { useEffect, useState } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import { locations } from "../utils/tableData";
import { Link, useLocation, useParams } from "react-router-dom";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import logo from "../../src/images/railwayLogo.png";

const getLocalISOTime = () => {
  // const now = new Date();
  // const offset = now.getTimezoneOffset() * 60000; // Convert offset to milliseconds
  // return new Date(now - offset).toISOString().slice(0, 16); // Convert to local ISO string

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const ReportTable = ({
  onFormChange,
  handleHaltSelectedData,
  handleDownloadPDF,
  handleformData,
  currentReport,
}) => {
  // const [locations, setLocations] = useState(locations);
  const [isDatat, setIsData] = useState(false);
  const [loading, setLoading] = useState(true); // State for loader
  const [stationList, setStationList] = useState("");
  const [formData, setFormData] = useState({
    dateOfAnalysis: getLocalISOTime(),
    analyzedBy: "",
    lp: "",
    designation: "",
    nominatedCLI: "",
    lpCMSID: "",
    maxSpeed: "",
    dateOfWorking: "",
    trainNo: "",
    load: "",
    bmbs: "",
    locoNo: "",
    spm: "",
    averageSpeed: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    runningTime: "",
    totalDistance: "",
    timeWithSpeed: "",
  });
  let navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await getStationList();
      await getFormData();
    };
    fetchData();
  }, []);

  const getStationList = async () => {
    try {
      const stations = await apiService(
        "get",
        `${RAILWAY_CONST.API_ENDPOINT.REPORTS}/${id}/stations`
      );
      if (stations) {
        setStationList(stations.data);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const getFormData = async () => {
    setFormData((prev) => ({
      ...prev,
      analyzedBy: currentReport.analyzed_by || prev.analyzedBy,
      spm: currentReport.spm || prev.spm,
      dateOfAnalysis: currentReport.date_of_analysis || prev.dateOfAnalysis,
      dateOfWorking: currentReport.date_of_working || prev.dateOfWorking,
      arrivalTime: formatTime(currentReport.arrival_time) || prev.arrivalTime,
      departureTime:
        formatTime(currentReport.departure_time) || prev.departureTime,
      averageSpeed: currentReport.avg_speed?.toString() || prev.averageSpeed,
      maxSpeed: currentReport.max_speed?.toString() || prev.maxSpeed,
      runningTime: currentReport.running_time || prev.runningTime,
      totalDistance:
        currentReport.total_distance?.toString() || prev.totalDistance,
      from: currentReport.stn_from || prev.from,
      to: currentReport.stn_to || prev.to,
      trainNo: currentReport.train_id || prev.trainNo,
      load: currentReport.load || prev.load,
      locoNo: currentReport.loco_no || prev.locoNo,
      bmbs: currentReport.bmbs?.toString() || prev.bmbs,
      timeWithSpeed: currentReport.max_speed_5 || prev.timeWithSpeed,
      lp: currentReport.crew_name || prev.lp,
      designation: currentReport.crew_designation || prev.designation,
      nominatedCLI: currentReport.nominated_cli || prev.nominatedCLI,
      lpCMSID: currentReport.lp_cms_id || prev.lpCMSID,
      psr_violation: currentReport.psr_violation || [],
      tsr_violation: currentReport.tsr_violation || [],
      attacking_speed_violation: currentReport.attacking_speed_violation || [],
    }));
    setLoading(false);
  };

  // useEffect(() => {
  //   handleformData(formData, "allFields");
  // }, [formData]);

  const handleBlur = () => {
    handleformData(formData, "allFields");
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hh, mm] = time.split(":");
    return `${hh}:${mm}`;
  };

  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     const response = await fetch("/api/locations");
  //     const data = await response.json();

  //     setLocations(data);
  //   };
  //   fetchLocations();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name == "from" || name == "to") {
      handleHaltSelectedData(
        name == "from" ? value : formData.from,
        name == "to" ? value : formData.to
      );
    }
  };

  // useEffect(() => {
  //   getChartSpeedBeforeHaltData();
  // }, [formData.from, formData.to]);

  // const getChartSpeedBeforeHaltData = async () => {
  //   try {
  //     const response = await apiService(
  //       "get",
  //       `${RAILWAY_CONST.API_ENDPOINT.SPEED_BEFORE_HALT}?from_station=${formData.from}&to_station=${formData.to}`
  //     );
  //     console.log(
  //       "response-------getChartSpeedBeforeHaltData",
  //       JSON.parse(response)
  //     );
  //     //setChartSpeedBeforHaltData(JSON.parse(response)); // No need for JSON.parse if data is already JSON
  //   } catch (error) {
  //     console.error("Error fetching chart data:", error);
  //   }
  // };

  useEffect(() => {
    onFormChange(formData);
  }, [formData]); //run effect when formData changes

  return (
    <>
      {loading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <div className="max-w-full mx-auto px-2 mb-4 reportTableForm">
          <div className="bg-[#fff] w-full p-8 pb-16 rounded-[15px] relative">
            <div
              id="pdfLogo"
              className="w-full items-center justify-center flex pb-4 hidden border-b border-[#ccc]"
            >
              <div className=" mx-auto flex flex-row justify-between w-full items-center">
                <div className="h-[90px] logoHeader mx-auto">
                  <span className="flex flex-row justify-center items-center">
                    <img
                      className="sm:h-[80px] h-[24px] mt-[5px]"
                      src={logo}
                      alt="Logo"
                    />
                    <span className="text-[24px] ml-2 font-semibold flex flex-col">
                      EASTERN RAILWAY, ASANSOL DIVISION
                      <span className="text-[18px] font-normal">
                        Ministry of Railways, Govt of India.
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3
                id="sectionTitle"
                className="text-center text-xl font-bold mb-8 mt-2 border-b border-[#ccc] relative pt-2 pb-2 mt-4"
              >
                <span
                  id="backButton"
                  className="absolute left-0 underline cursor-pointer top-[15px] text-[#000] hover:text-[#000] font-normal"
                >
                  <button onClick={() => navigate(-1)}>Back</button>
                </span>
                {currentReport.title}
                <button
                  className="bg-[#2c215d] absolute top-1 right-[0] h-[32px] w-[120px] font-normal text-[16px] text-white absolute right-8"
                  onClick={handleDownloadPDF}
                  id="downloadPdfButton"
                >
                  Download PDF
                </button>
              </h3>

              <form className="grid grid-cols-3 gap-8">
                {/* Row 1 start */}
                <div className="colSpaceBottom">
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Date of Analysis
                    </label>
                    <input
                      // type="datetime-local"
                      type="text"
                      name="dateOfAnalysis"
                      value={formData.dateOfAnalysis}
                      onChange={handleChange}
                      className="w-full p-2 border rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Date of Working
                    </label>
                    <input
                      type="text"
                      name="dateOfWorking"
                      value={formData.dateOfWorking}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Departure Time
                    </label>
                    <input
                      type="text"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                      step="1"
                      className="w-full border p-2 rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Arrival Time
                    </label>
                    <input
                      type="text"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={handleChange}
                      step="1"
                      className="w-full border p-2 rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Running Time
                    </label>
                    <input
                      type="text"
                      name="runningTime"
                      value={formData.runningTime}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Analyzed By
                    </label>
                    <input
                      type="text"
                      name="analyzedBy"
                      value={formData.analyzedBy}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      LP CMS ID
                    </label>
                    <input
                      type="text"
                      name="lpCMSID"
                      onBlur={handleBlur}
                      value={formData.lpCMSID}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      LP
                    </label>
                    <input
                      type="text"
                      name="lp"
                      value={formData.lp}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Nominated CLI
                    </label>
                    <input
                      type="text"
                      name="nominatedCLI"
                      value={formData.nominatedCLI}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      SPM
                    </label>
                    <input
                      type="text"
                      name="spm"
                      value={formData.spm}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                </div>
                {/* Row 1 end */}

                {/* Row 2 start */}
                <div className="colSpaceBottom">
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Train No
                    </label>
                    <input
                      type="text"
                      name="trainNo"
                      value={formData.trainNo}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Load
                    </label>
                    <input
                      type="text"
                      name="load"
                      value={formData.load}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      BMBS %
                    </label>
                    <input
                      type="text"
                      name="bmbs"
                      value={formData.bmbs}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Loco No
                    </label>
                    <input
                      type="text"
                      name="locoNo"
                      value={formData.locoNo}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Max Speed
                    </label>
                    <input
                      type="number"
                      name="maxSpeed"
                      value={formData.maxSpeed}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Average Speed
                    </label>
                    <input
                      type="text"
                      name="averageSpeed"
                      value={formData.averageSpeed}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Total Distance (KM)
                    </label>
                    <input
                      type="number"
                      name="totalDistance"
                      value={formData.totalDistance}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      Time with Speed ≥ (Max Speed - 5 Kmph)
                    </label>
                    <input
                      type="text"
                      name="timeWithSpeed"
                      value={formData.timeWithSpeed}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none"
                      readOnly
                    />
                  </div>
                </div>
                {/* Row 2 end */}

                {/* Row 3 start */}
                <div className="colSpaceBottom">
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      From
                    </label>
                    <select
                      name="from"
                      value={formData.from}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none h-[39px] leading-[39px]"
                    >
                      <option value="">Select From</option>
                      {stationList &&
                        stationList.map((loc, i) => (
                          <option key={i} value={loc.station}>
                            {loc.station}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-row items-center">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      To
                    </label>
                    <select
                      name="to"
                      value={formData.to}
                      onChange={handleChange}
                      className="w-full border p-2 rounded focus:outline-none h-[39px] leading-[39px]"
                    >
                      <option value="">Select To</option>
                      {stationList &&
                        stationList.map((loc, i) => (
                          <option key={i} value={loc.station}>
                            {loc.station}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex flex-row ">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      PSR Violation
                    </label>
                    <div className="w-full">
                      {formData.psr_violation?.length > 0 ? (
                        formData.psr_violation.map((violation, index) => (
                          <div key={index} className="flex flex-row gap-4 mb-2">
                            <div className=" p-2 rounded bg-gray-100 w-full text-[14px] grayBg">
                              <h4 className="font-semibold text-[14px] mb-1">
                                {violation.psr_section}
                              </h4>
                              <p>
                                <span className="text-gray-500 text-sm">
                                  <i>{violation.from}</i>
                                </span>
                                <span>
                                  {" "}
                                  <b>To</b>{" "}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  <i>{violation.to}</i>
                                </span>
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-800">NIL</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row ">
                    <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
                      TSR Violation
                    </label>
                    <div className="w-full">
                      {formData.tsr_violation?.length > 0 ? (
                        formData.tsr_violation.map((violation, index) => (
                          <div key={index} className="flex flex-col mb-2">
                            <div className="flex flex-row gap-4 mb-2">
                              <div className=" p-2 rounded bg-gray-100 w-full text-[14px] grayBg">
                                <p className="text-[14px] mb-1">
                                  {violation.tsr_section}
                                </p>
                                <p>
                                  <span className="text-gray-500 text-sm">
                                    <i>{violation.from}</i>
                                  </span>
                                  <span>
                                    {" "}
                                    <b>To</b>{" "}
                                  </span>
                                  <span className="text-gray-500 text-sm">
                                    <i>{violation.to}</i>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-800">NIL</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row ">
                    <label className="block font-semibold w-[260px] text-[#414140] text-sm">
                      Attacking Speed Violation
                    </label>
                    <div className="w-full">
                      {formData.attacking_speed_violation?.length > 0 ? (
                        formData.attacking_speed_violation.map(
                          (violation, index) => (
                            <div key={index} className="flex flex-col mb-2">
                              <div className=" p-2 rounded bg-gray-100 w-full text-[14px] grayBg">
                                <h4 className="font-semibold text-[14px] mb-1">
                                  {violation.violation}
                                </h4>
                                <p className="text-gray-500 text-sm">
                                  {" "}
                                  <i>{violation.time}</i>
                                </p>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-gray-800">NIL</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Row 3 end */}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportTable;
