import React, { useEffect, useState } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import FileDropzone from "./FileDropzone";
import ShowMessagePopUp from "./ShowMessagePopUp";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const CreateReportComponentNew = () => {
  const [formData, setFormData] = useState({
    title: "",
    station_file: null,
    isd_file: null,
    psr_file: null,
    tsr_file: null,
    gradient_file: null,
    speedo_file: null,
  });
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFileDrop = (name) => (acceptedFiles) => {
    setFormData((pre) => ({
      ...pre,
      [name]: acceptedFiles[0],
    }));
  };

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

    setIsSubmitting(true);

    const submission = new FormData();
    submission.append("report_title", formData.title);
    Object.keys(formData).forEach((key) => {
      if (formData[key] && key !== "title") {
        submission.append(key, formData[key]);
      }
    });

    try {
      const response = await apiService(
        "POST",
        RAILWAY_CONST.API_ENDPOINT.NEW_REPORT,
        submission,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showPopup("Upload successful!", "success");
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
        <div className="bg-white w-full p-8 pt-2 rounded-[15px] min-h-[600px]">
          <h1 className="text-[22px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
            Create Report
          </h1>
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 bg-white rounded shadow"
          >
            <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-32 text-right">
                Title
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
            </div>

            <FileDropzone
              label="Select Station"
              file={formData.station_file}
              onDrop={handleFileDrop("station_file")}
            />
            <FileDropzone
              label="ISD File"
              file={formData.isd_file}
              onDrop={handleFileDrop("isd_file")}
            />
            <FileDropzone
              label="Select PSR"
              file={formData.psr_file}
              onDrop={handleFileDrop("psr_file")}
            />
            <FileDropzone
              label="Select TSR"
              file={formData.tsr_file}
              onDrop={handleFileDrop("tsr_file")}
            />
            <FileDropzone
              label="Select Gradient"
              file={formData.gradient_file}
              onDrop={handleFileDrop("gradient_file")}
            />
            <FileDropzone
              label="Speedo Data"
              file={formData.speedo_file}
              onDrop={handleFileDrop("speedo_file")}
              required
            />

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
