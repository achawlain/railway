import React, { useEffect, useState } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import FileDropzone from "./FileDropzone";
import ShowMessagePopUp from "./ShowMessagePopUp";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { getDataFromLocalStorage } from "../utils/localStorage";

const CreateReportComponentNew = () => {
  const [template, setTemplate] = useState(
    getDataFromLocalStorage("currentTemplate")
  );
  const [formData, setFormData] = useState({
    title: "",
    lp_cms_id: "",
    train_no: "",
    load: "",
    bmbs: "",
    loco_no: "",
    spm: "",
    station_file: null,
    isd_file: null,
    psr_file: null,
    tsr_file: null,
    gradient_file: null,
    speedo_file: null,
    attacking_speed_file: null,
  });
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const spmOptions = [
    { source_key: "Laxven", source_value: "Laxven" },
    { source_key: "Telpro", source_value: "Telpro" },
    // { source_key: "spm_3", source_value: "Source 3" },
  ];

  // Handle dropdown change
  const handleDropdownChange = (e) => {
    const selectedKey = e.target.value;
    setFormData((prev) => ({ ...prev, spm: selectedKey }));
  };

  

  const handleFileDrop = (name) => (acceptedFiles) => {
    setFormData((pre) => ({
      ...pre,
      [name]: acceptedFiles[0],
    }));
  };

  useEffect(() => {
    console.log("template", template);
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

    if (!formData.title) {
      showPopup("Title is required!", "error");
      return;
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
    submission.append("report_title", formData.title);

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
    console.log("submission", submission);
    try {
      const response = await apiService(
        "POST",
        RAILWAY_CONST.API_ENDPOINT.NEW_REPORT,
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
  useEffect(() => {});

  return (
    <div className="w-full bg-[#efefef] p-4 reportGenerateBg pt-8 min-h-screen">
      {isSubmitting && (
        <div className="loader">
          <Loader />
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-2 mb-4">
        <div className="bg-white w-full p-8 pt-2 rounded-[15px] min-h-[600px] relative ">
          <h1 className="text-[22px] text-[#30424c] font-medium text-center mb-8 border-b border-[#ccc] pb-2 relative pt-2">
            <span className="absolute left-0 text-white pr-4 top-[5px] underline cursor-pointer ">
              <button
                className="text-[18px] text-[#000] hover:text-[#000] "
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </span>
            Create Report
          </h1>

          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 bg-white rounded shadow"
          >
            {/* <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-36 text-right">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                //className="w-full p-2 border rounded"
                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div> */}

            <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-40 text-right">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-40 text-right">
                LP CMS ID
              </label>
              <input
                type="text"
                name="lp_cms_id"
                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
                value={formData.lp_cms_id}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-40 text-right">
                Train No
              </label>
              <input
                type="text"
                name="train_no"
                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
                value={formData.train_no}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-40 text-right">
                Load
              </label>
              <input
                type="text"
                name="load"
                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
                value={formData.load}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-40 text-right">
                BMBS
              </label>
              <input
                type="text"
                name="bmbs"
                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
                value={formData.bmbs}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-40 text-right">
                Loco No
              </label>
              <input
                type="text"
                name="loco_no"
                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
                value={formData.loco_no}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-40 text-right">
                SPM
              </label>
              {/* <input
                type="dropdown"
                name="spm"
                className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
                value={formData.spm}
                onChange={handleInputChange}
              /> */}
         <select
          name="spm"
          value={formData.spm}
          onChange={handleDropdownChange}
          className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300"
        >
          <option value="" disabled>
            Select SPM
          </option>
          {spmOptions.map((option) => (
            <option key={option.source_key} value={option.source_key}>
              {option.source_value}
            </option>
          ))}
        </select>
            </div>

            <FileDropzone
              label="Speedo Data File"
              file={formData.speedo_file}
              onDrop={handleFileDrop("speedo_file")}
              required
            />

            <FileDropzone
              label="TSR File"
              file={formData.tsr_file}
              onDrop={handleFileDrop("tsr_file")}
            />

            {template.station_file && (
              <div className="mb-4 flex items-center">
                <label className="block font-medium mb-1 mr-4 w-40 text-right">
                  Station File
                </label>
                <span className="text-[#777]">{template.station_file}</span>
              </div>
            )}

            {template.isd_file && (
              <div className="mb-4 flex items-center">
                <label className="block font-medium mb-1 mr-4 w-40 text-right">
                  ISD File
                </label>
                <span className="text-[#777]">{template.isd_file}</span>
              </div>
            )}

            {template.psr_file && (
              <div className="mb-4 flex items-center">
                <label className="block font-medium mb-1 mr-4 w-40 text-right">
                  PSR File
                </label>
                <span className="text-[#777]">{template.psr_file}</span>
              </div>
            )}

            {template.gradient_file && (
              <div className="mb-4 flex items-center">
                <label className="block font-medium mb-1 mr-4 w-40 text-right">
                  Gradient File
                </label>
                <span className="text-[#777]">{template.gradient_file}</span>
              </div>
            )}

            {template.attacking_speed_file && (
              <div className="mb-4 flex items-center">
                <label className="block font-medium mb-1 mr-4 w-40 text-right">
                  Attacking Speed File
                </label>
                <span className="text-[#777]">
                  {template.attacking_speed_file}
                </span>
              </div>
            )}

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
    </div>
  );
};

export default CreateReportComponentNew;
