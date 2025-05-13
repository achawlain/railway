import React, { useEffect, useState } from "react";
import { apiService, DataTable } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import FileDropzone from "./FileDropzone";
import ShowMessagePopUp from "./ShowMessagePopUp";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { getDataFromLocalStorage } from "../utils/localStorage";

const CreateTemplateComponent = () => {
  const [template, setTemplate] = useState(
    getDataFromLocalStorage("currentTemplate")
  );
  const [currentReprot, setCurrentReprot] = useState(
    getDataFromLocalStorage("currentReport")
  );
  const [formData, setFormData] = useState({
    title: "",
    station_file: null,
    isd_file: null,
    psr_file: null,
    gradient_file: null,
    attacking_speed_file: null,
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
          download: template.id,
        }
      );

      const blob = new Blob([response.data], { type: "text/csv" }); // or whatever the file type is
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

  // useEffect(() => {
  //   if (template) {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       // title: template.title || "",
  //       // station_file: template.station_file || null,
  //       // isd_file: template.isd_file || null,
  //       // psr_file: template.psr_file || null,
  //       // gradient_file: template.gradient_file || null,
  //       // attacking_speed_file: template.attacking_speed_file || null,
  //     }));
  //   }
  // }, [template]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      showPopup("Title is required!", "error");
      return;
    }

    setIsSubmitting(true);

    const submission = new FormData();

    submission.append("report_title", formData.title);

    const fileFields = [
      "station_file",
      "isd_file",
      "psr_file",
      "gradient_file",
      "attacking_speed_file",
    ];

    Object.keys(formData).forEach((key) => {
      if (fileFields.includes(key)) {
        submission.append(key, formData[key]);
      }
    });

    try {
      const response = await apiService(
        "POST",
        RAILWAY_CONST.API_ENDPOINT.TEMPLATE,
        submission
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
            <span
              id="backButton"
              className="absolute left-0 text-white pr-4 top-[5px] underline cursor-pointer px-[10px] border border-[#000] flex"
              onClick={() => navigate(-1)}
            >
              <button className="text-[18px] text-[#000] hover:text-[#000] ">
                Back
              </button>
            </span>
            Create Template
          </h1>

          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 bg-white rounded shadow"
          >
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

            <FileDropzone
              label="Station File"
              file={formData.station_file}
              onDrop={handleFileDrop("station_file")}
              required
            />

            <FileDropzone
              label="ISD File"
              file={formData.isd_file}
              onDrop={handleFileDrop("isd_file")}
            />
            <FileDropzone
              label="PSR File"
              file={formData.psr_file}
              onDrop={handleFileDrop("psr_file")}
            />
            <FileDropzone
              label="Gradient File"
              file={formData.gradient_file}
              onDrop={handleFileDrop("gradient_file")}
            />
            <FileDropzone
              label="Attacking Speed File"
              file={formData.attacking_speed_file}
              onDrop={handleFileDrop("attacking_speed_file")}
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

export default CreateTemplateComponent;
