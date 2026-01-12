import React, { useEffect, useState } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import FileDropzone from "./FileDropzone";
import sttaionFile from "../images/sttaionFile.png";
import downloadIcon from "../images/downloadIcon.png";
import gradientIcon from "../images/gradient.png";
import attackingSpeed from "../images/attackingSpeed.png";
import PSRicon from "../images/PSRicon.png";
import signalIcon from "../images/signalIcon.png";
import eyeIcon from "../images/eyeIcon.png";
import ShowMessagePopUp from "./ShowMessagePopUp";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { getDataFromLocalStorage } from "../utils/localStorage";
import DataTable from "./DataTable";
import { Calendar } from "primereact/calendar";
const CreateReportComponentNew = () => {
  const [template, setTemplate] = useState(
    getDataFromLocalStorage("currentTemplate")
  );
  const [currentReprot, setCurrentReprot] = useState(
    getDataFromLocalStorage("currentReport")
  );
  const [formData, setFormData] = useState({
    title: "",
    lp_cms_id: "",
    train_no: "",
    load: "",
    bmbs: "",
    loco_no: "",
    spm: "",
    starts_from: "",
    station_file: null,
    isd_file: null,
    psr_file: null,
    tsr_file: null,
    gradient_file: null,
    speedo_file: null,
    attacking_speed_file: null,
    // goods: false,
    train_type: "",
    reported_start_time: null,
  });
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [spmOption, setSpmOption] = useState([]);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableVisible, setTableVisible] = useState(false);
  const [stationList, setStationList] = useState([]);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService(
          "get",
          RAILWAY_CONST.API_ENDPOINT.METADATA,
          {},
          {
            template_id: template.id,
            data_src: "station_file",
          }
        );
        const responseData = response?.data || [];

        if (responseData.length) {
          setStationList(responseData);
        }
      } catch (error) {
        console.error("Error fetching csv data:", error);
        setError("Failed to fetch csv data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchSPMOptions = async () => {
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.SUPPORTED_DATA_SOURCES
      );
      // Transform the data to match spmOption format
      const options = response.sources.map((source) => ({
        source_key: source.source_key,
        source_value: source.source_value,
      }));
      setSpmOption(options);
    } catch (error) {
      console.error("Error fetching SPM options:", error);
      setError("Failed to fetch SPM options. Please try again later.");
    }
  };

  const hangleShowDataonClickEyeIcon = async (dataSource) => {
    setIsLoading(true);
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.METADATA,
        {},
        {
          template_id: template.id,
          data_src: dataSource,
        }
      );
      const responseData = response?.data || [];
      if (responseData.length) {
        setColumns(Object.keys(responseData[0])); // Get column names dynamically
        setData(responseData);
        setTableVisible(true);
      } else {
        setColumns([]);
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching csv data:", error);
      setError("Failed to fetch csv data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFile = async (dataSource) => {
    setIsLoading(true);
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.METADATA,
        {
          responseType: "blob", // Important to get file
        },
        {
          template_id: template.id,
          data_src: dataSource,
          download: "1",
        }
      );

      const blob = new Blob([response], { type: "text/csv" }); // or whatever the file type is
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${dataSource}_${template.id}.csv`; // You can customize filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      console.error("Error fetching csv data:", error);
      setError("Failed to fetch csv data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("spmOption", spmOption);
  // }, [spmOption]);

  // Call fetchSPMOptions when the component mounts
  useEffect(() => {
    fetchSPMOptions();
  }, []);

  // Handle dropdown change
  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileDrop = (name) => (acceptedFiles) => {
    setFormData((pre) => ({
      ...pre,
      [name]: acceptedFiles[0],
    }));
  };

  useEffect(() => {
    if (template) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: template.title || "",
        // station_file: template.station_file || null,
        // isd_file: template.isd_file || null,
        // psr_file: template.psr_file || null,
        // gradient_file: template.gradient_file || null,
        // attacking_speed_file: template.attacking_speed_file || null,
      }));
    }
  }, [template]);

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
      if ((type = "success" && message === "Upload successful!")) {
        setIsSubmitting(false);
        navigate(RAILWAY_CONST.ROUTE.DASHBOARD);
      }
    }, 4000);
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!formData.speedo_file) {
  //       alert("Speedo Data is required!");
  //       return;
  //     }

  //     setIsSubmitting(true); // Start loader
  //     let errorMessage = "Something went wrong. Please try again.";

  //     const submission = new FormData();
  //     submission.append("report_title", formData.title); // Changed to match backend

  //     Object.keys(formData).forEach((key) => {
  //       if (formData[key] && key !== "title") {
  //         submission.append(key, formData[key]);
  //       }
  //     });

  //     try {
  //       const response = await apiService(
  //         "POST",
  //         RAILWAY_CONST.API_ENDPOINT.NEW_REPORT,
  //         submission,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       // You can handle more specific result validation here
  //       console.log("Upload success:", response.data);
  //       alert("Upload successful!");
  //     } catch (error) {
  //       console.error("Upload error:", error);

  //       if (error.response?.data?.error) {
  //         errorMessage = error.response.data.error;
  //       } else if (error.response?.data?.message) {
  //         errorMessage = error.response.data.message;
  //       } else if (error.message) {
  //         errorMessage = error.message;
  //       }

  //       alert(errorMessage);
  //     } finally {
  //       setIsSubmitting(false); // Stop loader
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.speedo_file) {
      showPopup("Speedo Data is required!", "error");
      return;
    }

    if (!formData.spm) {
      showPopup("SPM is required!", "error");
      return;
    }
    
    if (!formData.reported_start_time) {
      showPopup("reported start time is required!", "error");
      return;
    }
    
    if (!formData.title) {
      showPopup("Title is required!", "error");
      return;
    }

    if (!formData.starts_from) {
      showPopup("Starts From is required!", "error");
      return;
    }

    if (!formData.train_type) {
      showPopup("Train Type is required!", "error");
      return
    }

    setIsSubmitting(true);

    const submission = new FormData();
    submission.append("template_id", template.id);
    submission.append("lp_cms_id", formData.lp_cms_id);
    submission.append("train_no", formData.train_no);
    submission.append("load", formData.load);
    submission.append("bmbs", formData.bmbs);
    submission.append("loco_no", formData.loco_no);
    submission.append("spm", formData.spm);
    submission.append("starts_from", formData.starts_from);
    submission.append("report_title", formData.title);
    // submission.append("goods", formData.goods ? "true" : "false");
    submission.append("train_type", formData.train_type);
    submission.append("reported_start_time", formatTime(formData.reported_start_time));


    const fileFields = [
      // "station_file",
      // "isd_file",
      // "psr_file",
      "tsr_file",
      // "gradient_file",
      "speedo_file",
      // "attacking_speed_file",
    ];

    Object.keys(formData).forEach((key) => {
      if (fileFields.includes(key)) {
        submission.append(key, formData[key]);
      }
    });

    try {
      const response = await apiService(
        "POST",
        RAILWAY_CONST.API_ENDPOINT.REPORTS_SLASH,
        submission
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );

      if (response.status === 500 || response.data === null) {
        throw new Error(response.message || "Unexpected error.");
      }

      showPopup("Upload successful!", "success");
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = "Internal Server Error. Please contact support.";
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showPopup(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const formatTime = (date) => {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => { });

  return (
    <div className="w-full bg-[#efefef] p-4 reportGenerateBg pt-8 min-h-screen">
      {isSubmitting && (
        <div className="loader">
          <Loader />
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-2 mb-4">
        <div className="bg-white w-full sm:p-8 p-2 pt-2 rounded-[15px] min-h-[600px] relative ">
          <h1 className="sm:text-[22px] text-[18px] text-[#30424c] font-medium text-center sm:mb-8 mb-4 border-b border-[#ccc] pb-2 relative pt-2">
            <span
              id="backButton"
              className="absolute left-0 px-[10px] py-[5px] sm:py-[0px] border border-[#000] sm:text-[20px] text-[12px] cursor-pointer sm:top-[10px] top-[10px] text-[#000] hover:text-[#000] font-normal flex items-start "
              onClick={() => navigate(-1)}
            >
              <button className="sm:text-[18px] text-[12px] text-[#000] hover:text-[#000] ">
                Back
              </button>
            </span>
            Create Report
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full mx-auto sm:p-6 p-4 bg-white rounded shadow createReportForm flex flex-row flex-wrap text-[14px]"
          >
            {/* <div className="mb-4 flex items-center w-[48%] createFormColFirst">
              <label className="block font-medium mb-1 mr-4 w-36 text-right">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                //className="w-full p-2 border rounded"
                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px]"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div> */}
            <div className="w-full flex-row flex justify-around createFormRow">
              <div className="mb-4 flex items-center w-[48%] createFormColFirst">
                <label className="block font-medium mb-1 mr-4 w-40 ">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px]"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4 flex items-center max-w-[460px] w-[48%] createFormColSecond">
                <label className="block font-medium mb-1 mr-4 w-40 ">
                  LP CMS ID
                </label>
                <input
                  type="text"
                  name="lp_cms_id"
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px]"
                  value={formData.lp_cms_id}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full flex-row flex justify-around createFormRow">
              <div className="mb-4 flex items-center w-[48%] createFormColFirst">
                <label className="block font-medium mb-1 mr-4 w-40 ">
                  Train No
                </label>
                <input
                  type="text"
                  name="train_no"
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px]"
                  value={formData.train_no}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4 flex items-center max-w-[460px] w-[48%] createFormColSecond">
                <label className="block font-medium mb-1 mr-4 w-40 ">
                  Load
                </label>
                <input
                  type="text"
                  name="load"
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px]"
                  value={formData.load}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full flex-row flex justify-around createFormRow">
              <div className="mb-4 flex items-center w-[48%] createFormColFirst">
                <label className="block font-medium mb-1 mr-4 w-40 ">
                  BMBS
                </label>
                <input
                  type="text"
                  name="bmbs"
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px]"
                  value={formData.bmbs}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4 flex items-center max-w-[460px] w-[48%] createFormColSecond">
                <label className="block font-medium mb-1 mr-4 w-40 ">
                  Loco No
                </label>
                <input
                  type="text"
                  name="loco_no"
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px]"
                  value={formData.loco_no}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full flex-row flex justify-around createFormRow">
              <div className="mb-4 flex items-center w-[48%] createFormColFirst">
                <label className="block font-medium mb-1 mr-4 w-40 ">
                  SPM <span className="text-red-500">*</span>
                </label>

                <select
                  name="spm"
                  value={formData.spm}
                  onChange={handleDropdownChange}
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px] h-[39px] "
                >
                  <option value="" disabled>
                    Select SPM
                  </option>
                  {spmOption.map((option) => (
                    <option key={option.source_key} value={option.source_key}>
                      {option.source_value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 flex items-center goodColum max-w-[460px] w-[48%] createFormColSecond">
                {/* <label
                  htmlFor="goods"
                  className="block font-medium mb-1 mr-4 w-40"
                >
                  Goods
                </label>
                <input
                  type="checkbox"
                  id="goods"
                  name="goods"
                  checked={formData.goods}
                  onChange={(e) =>
                    setFormData({ ...formData, goods: e.target.checked })
                  }
                  className="p-2 border rounded w-[20px] cursor-pointer transition-all w-5 h-5 border-gray-300 accent-[#4f46e5]"
                /> */}
                {/* Goods checkbox removed */}
                <label className="block font-medium mb-1 mr-4 w-40">
                  Train Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="train_type"
                  value={formData.train_type}
                  onChange={handleDropdownChange}
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px] h-[39px]"
                >
                  <option value="" disabled>Select Train Type</option>
                  <option value="1">Passenger</option>
                  <option value="2">Mail Express</option>
                  <option value="3">Goods</option>
                  <option value="4">Light Engine [LE]</option>
                </select>

              </div>
            </div>

            <div className="w-full flex-row flex justify-around createFormRow">
              <div className="mb-4 flex items-center w-[48%] createFormColFirst">
                <label className="block font-medium mb-1 mr-4 w-40 ">
                  Starts From <span className="text-red-500">*</span>
                </label>

                <select
                  name="starts_from"
                  value={formData.starts_from}
                  onChange={handleDropdownChange}
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px] h-[39px]"
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
              <div className="flex items-center w-[48%] relative max-w-[460px]"></div>
            </div>

            <div className="w-full flex-row flex justify-around createFormRow">
              <div className="mb-4 flex items-center w-[48%] createFormColFirst">
                {/* time picker */}
                <label className="block font-medium mb-1 mr-4 w-40">Reported Start Time <span className="text-red-500">*</span> </label>
                <Calendar
                  value={formData.reported_start_time instanceof Date ? formData.reported_start_time : null}
                  onChange={(e) => setFormData({ ...formData, reported_start_time: e.value })}
                  timeOnly
                  hourFormat="24"
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 max-w-[300px] w-full"
                />
              </div>
              <div className="flex items-center w-[48%] max-w-[460px]"></div>
            </div>


            <div className="w-full flex-row flex justify-around createFormRow">
              <div className="flex items-center w-[48%] dropzondRow">
                <FileDropzone
                  label="Speedo Data File"
                  file={formData.speedo_file}
                  onDrop={handleFileDrop("speedo_file")}
                  required
                  align="left"
                  widthCol="300px"
                />
              </div>
              <div className="flex items-center w-[48%] max-w-[460px] "></div>
            </div>
            <div className="w-full flex-row flex justify-around createFormRow">
              <div className="flex items-center w-[48%] dropzondRow">
                <FileDropzone
                  align="left"
                  widthCol="300px"
                  label="TSR File"
                  file={formData.tsr_file}
                  onDrop={handleFileDrop("tsr_file")}
                />
              </div>
              <div className="mb-4 flex items-center w-[48%] max-w-[460px] relative viewDownloadSectionMain">
                <div className="w-full absolute top-[-55px] flex flex-row justify-start viewDownloadSection">
                  {template.station_file && (
                    <div className="mb-4 flex items-center w-auto flex-col px-1">
                      <span className="border-2 border-[#9b4b90] rounded-full w-[65px] h-[65px] flex items-center justify-center">
                        <img
                          alt="stationFIle"
                          src={sttaionFile}
                          className="w-[60%]"
                        />
                      </span>
                      <label className="block font-medium mb-1 mt-2 text-center text-[12px]">
                        Station File
                      </label>
                      {/* <span className="text-[#777]">{template.station_file}</span> */}
                      <div className="flex flex-row items-center">
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform flex justify-center"
                          onClick={() =>
                            hangleShowDataonClickEyeIcon("station_file")
                          }
                        >
                          <img
                            src={eyeIcon}
                            alt="eye icon"
                            className="w-[20px]"
                          />
                        </span>
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform mt-[4px] flex justify-center"
                          onClick={() => handleDownloadFile("station_file")}
                        >
                          <img
                            src={downloadIcon}
                            alt="download icon"
                            className="w-[17px]"
                          />
                        </span>
                      </div>
                    </div>
                  )}

                  {template.isd_file && (
                    <div className="mb-4 flex items-center w-auto flex-col text-center px-1">
                      <span className="border-2 border-[#9b4b90] rounded-full w-[65px] h-[65px] flex items-center justify-center">
                        <img
                          alt="stationFIle"
                          src={signalIcon}
                          className="w-[34%]"
                        />
                      </span>
                      <label className="block font-medium mb-1 mt-2 text-center text-[12px]">
                        ISD File
                      </label>
                      {/* <span className="text-[#777]">{template.isd_file}</span> */}
                      <div className="flex flex-row items-center">
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform flex justify-center"
                          onClick={() =>
                            hangleShowDataonClickEyeIcon("isd_file")
                          }
                        >
                          <img
                            src={eyeIcon}
                            alt="eye icon"
                            className="w-[20px]"
                          />
                        </span>
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform mt-[4px] flex justify-center"
                          onClick={() => handleDownloadFile("isd_file")}
                        >
                          <img
                            src={downloadIcon}
                            alt="download icon"
                            className="w-[17px]"
                          />
                        </span>
                      </div>
                    </div>
                  )}

                  {template.psr_file && (
                    <div className="mb-4 flex items-center w-auto flex-col px-1">
                      <span className="border-2 border-[#9b4b90] rounded-full w-[65px] h-[65px] flex items-center justify-center">
                        <img
                          alt="stationFIle"
                          src={PSRicon}
                          className="w-[60%]"
                        />
                      </span>
                      <label className="block font-medium mb-1 mt-2 text-center text-[12px]">
                        PSR File
                      </label>
                      {/* <span className="text-[#777]">{template.psr_file}</span> */}
                      <div className="flex flex-row items-center">
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform flex justify-center"
                          onClick={() =>
                            hangleShowDataonClickEyeIcon("psr_file")
                          }
                        >
                          <img
                            src={eyeIcon}
                            alt="eye icon"
                            className="w-[20px]"
                          />
                        </span>
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform mt-[4px] flex justify-center"
                          onClick={() => handleDownloadFile("psr_file")}
                        >
                          <img
                            src={downloadIcon}
                            alt="download icon"
                            className="w-[17px]"
                          />
                        </span>
                      </div>
                    </div>
                  )}

                  {template.gradient_file && (
                    <div className="mb-4 flex items-center w-auto flex-col px-1">
                      <span className="border-2 border-[#9b4b90] rounded-full w-[65px] h-[65px] flex items-center justify-center">
                        <img
                          alt="stationFIle"
                          src={gradientIcon}
                          className="w-[60%]"
                        />
                      </span>
                      <label className="block font-medium mb-1 mt-2 text-center text-[12px]">
                        Gradient File
                      </label>
                      {/* <span className="text-[#777]">{template.gradient_file}</span> */}
                      <div className="flex flex-row items-center">
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform flex justify-center"
                          onClick={() =>
                            hangleShowDataonClickEyeIcon("gradient_file")
                          }
                        >
                          <img
                            src={eyeIcon}
                            alt="eye icon"
                            className="w-[20px]"
                          />
                        </span>
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform mt-[4px] flex justify-center"
                          onClick={() => handleDownloadFile("gradient_file")}
                        >
                          <img
                            src={downloadIcon}
                            alt="download icon"
                            className="w-[17px]"
                          />
                        </span>
                      </div>
                    </div>
                  )}

                  {formData.train_type === "3" && template.attacking_speed_file && (
                    <div className="mb-4 flex items-center w-auto flex-col px-1">
                      <span className="border-2 border-[#9b4b90] rounded-full w-[65px] h-[65px] flex items-center justify-center">
                        <img
                          alt="stationFIle"
                          src={attackingSpeed}
                          className="w-[70%]"
                        />
                      </span>
                      <label className="block font-medium mb-1 mt-2 text-center text-[12px] w-[120px]">
                        Attacking Speed File
                      </label>
                      {/* <span className="text-[#777]">{template.gradient_file}</span> */}
                      <div className="flex flex-row items-center">
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform flex justify-center"
                          onClick={() =>
                            hangleShowDataonClickEyeIcon("attacking_speed_file")
                          }
                        >
                          <img
                            src={eyeIcon}
                            alt="eye icon"
                            className="w-[20px]"
                          />
                        </span>
                        <span
                          className="eyeIcon mx-2 w-[24px] cursor-pointer transition-all duration-200 transform mt-[4px] flex justify-center"
                          onClick={() =>
                            handleDownloadFile("attacking_speed_file")
                          }
                        >
                          <img
                            src={downloadIcon}
                            alt="download icon"
                            className="w-[17px]"
                          />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center items-center ">
              <button
                type="submit"
                className="mt-4 px-4 reportGenerateBg py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Uploading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {popup.show && (
        <ShowMessagePopUp
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ show: false, message: "", type: "" })}
        />
      )}

      {isLoading ? (
        <Loader />
      ) : data.length > 0 ? (
        <>
          {isTableVisible && (
            <DataTable
              columns={columns}
              data={data}
              onClose={() => setTableVisible(false)}
            />
          )}
        </>
      ) : (
        // <p>No data available.</p>
        ""
      )}
    </div>
  );
};

export default CreateReportComponentNew;
