// UpdateTemplateComponent.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import FileDropzone from "./FileDropzone";
import ShowMessagePopUp from "./ShowMessagePopUp";
import Loader from "./Loader";
import DataTable from "./DataTable";
import { getDataFromLocalStorage } from "../utils/localStorage";

const UpdateTemplateComponent = () => {
  const navigate = useNavigate();
  const template = getDataFromLocalStorage("currentTemplate");

  const [formData, setFormData] = useState({
    title: template?.title || "",
    station_file: null,
    isd_file: null,
    psr_file: null,
    gradient_file: null,
    attacking_speed_file: null,
    direction: Number(template?.direction) ?? "",
    pairing_id: template?.pairing_id || "",
  });

  const [existingFiles, setExistingFiles] = useState({
    station_file: false,
    isd_file: false,
    psr_file: false,
    gradient_file: false,
    attacking_speed_file: false,
  });


  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableVisible, setTableVisible] = useState(false);
  const [unpaireOptions, setUnpaireOptions] = useState([]);


  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "" });
      if (type === "success" && message === "Update successful!") {
        navigate(RAILWAY_CONST.ROUTE.TEMPLATE);
      }
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileDrop = (name) => (acceptedFiles) => {
    setFormData((prev) => ({ ...prev, [name]: acceptedFiles[0] }));
  };

  useEffect(() => {
    const checkFilesExist = async () => {
      const fields = [
        "station_file",
        "isd_file",
        "psr_file",
        "gradient_file",
        "attacking_speed_file",
      ];

      const fileExistStatus = {};

      await Promise.all(
        fields.map(async (field) => {
          try {
            const res = await apiService("get", RAILWAY_CONST.API_ENDPOINT.METADATA, {}, {
              template_id: template.id,
              data_src: field,
            });

            fileExistStatus[field] = Array.isArray(res?.data) && res.data.length > 0;
          } catch (e) {
            fileExistStatus[field] = false;
          }
        })
      );

      setExistingFiles(fileExistStatus);
    };

    checkFilesExist();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return showPopup("Title is required!", "error");

    setIsSubmitting(true);
    const submission = new FormData();
    submission.append("title", formData.title);
    submission.append("direction", parseInt(formData.direction, 10));
    submission.append("pairing_id", formData.pairing_id);

    [
      "station_file",
      "isd_file",
      "psr_file",
      "gradient_file",
      "attacking_speed_file",
    ].forEach((key) => {
      if (formData[key]) {
        submission.append(key, formData[key]);
      }
    });

    try {
      const response = await apiService(
        "PUT",
        `${RAILWAY_CONST.API_ENDPOINT.TEMPLATE}/${template.id}`,
        submission
      );
      if (response.status >= 200 && response.status < 300) {
        showPopup("Update successful!", "success");
      } else {
        showPopup("Update failed.", "error");
      }
    } catch (error) {
      showPopup(error.message || "Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
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
        setColumns(Object.keys(responseData[0]));
        setData(responseData);
        setTableVisible(true);
      } else {
        setColumns([]);
        setData([]);
      }
    } catch (error) {
      showPopup("Failed to fetch data.", "error");
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
        { responseType: "blob" },
        {
          template_id: template.id,
          data_src: dataSource,
          download: "1",
        }
      );
      const blob = new Blob([response], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${dataSource}_${template.id}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showPopup("Download failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUnpaireOptions = async () => {
      try {
        const response = await apiService(
          "get",
          RAILWAY_CONST.API_ENDPOINT.UNPAIRE_LIST,
          {}, // headers or config if needed
          {
            unpaired: "1", // query parameters go here
            pairing_id: template.pairing_id, // assuming pairing_id is part of the template
          }
        );
        console.log("Unpaire List Response:", response);
        if (Array.isArray(response?.data)) {
          setUnpaireOptions(response.data.map((item) => ({ id: item.id, title: item.title })));
        }
      } catch (error) {
        console.error("Error fetching unpaire list:", error);
      }
    };

    fetchUnpaireOptions();
  }, []);

  return (
    <div className="w-full bg-[#efefef] p-4 reportGenerateBg pt-8 min-h-screen">
      {isSubmitting && <div className="loader"><Loader /></div>}
      <div className="max-w-[1300px] mx-auto px-2 mb-4">
        <div className="bg-white w-full sm:p-8 p-2 pt-2 rounded-[15px] min-h-[600px] relative ">
          <h1 className="sm:text-[22px] text-[18px] text-[#30424c] font-medium text-center sm:mb-8 mb-4 border-b border-[#ccc] pb-2 relative pt-2">
            <span
              id="backButton"
              className="absolute left-0 px-[10px] py-[5px] sm:py-[0px] border border-[#000] sm:text-[20px] text-[12px] cursor-pointer sm:top-[10px] top-[10px] text-[#000] hover:text-[#000] font-normal flex items-start "
              onClick={() => navigate(-1)}
            >
              <button className="sm:text-[18px] text-[12px] text-[#000] hover:text-[#000] ">Back</button>
            </span>
            Update {formData?.title} Template
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full mx-auto sm:p-[50px] createTemplateCol p-4 bg-white rounded shadow  flex flex-row flex-wrap text-[14px] justify-between"
          >
            <div className="mb-4 flex items-center">
              <label className="block font-medium mb-1 mr-4 w-[160px]">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="flex-grow titleIput">
                <input
                  type="text"
                  name="title"
                  className="p-2 border rounded cursor-pointer transition-all flex-grow border-gray-300 h-[57px] w-[300px]"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-[48%] mb-6">
              {/* Current Direction */}
              <div className="flex items-center justify-between mb-2">
                <label className="text-left block font-medium mb-1 mr-4 w-40">
                  Current Direction
                </label>
                <div className="text-sm text-gray-600 ml-[160px]">
                  {template?.direction !== undefined && template?.direction !== null ? (
                    <b>{template?.direction === 0 ? "UP" : "DOWN"}</b>
                  ) : (
                    <span className="text-red-500">Not set</span>
                  )}
                </div>
              </div>

              {/* Direction Select */}
              <div className="flex items-center mb-6">
                <label className="text-left block font-medium mb-1 mr-4 w-40">
                  Direction
                </label>
                <select
                  name="direction"
                  value={formData.direction}
                  onChange={handleInputChange}
                  className="p-2 border rounded h-[40px] w-[300px] border-gray-300"
                >
                  <option value="" disabled>Select Direction</option>
                  <option value="0">UP</option>
                  <option value="1">DOWN</option>
                </select>
              </div>
            </div>


            <div className="w-[48%] mb-6">
              {/* Current Pairing ID */}
              <div className="flex items-center justify-between mb-2">
                <label className="text-left block font-medium mb-1 mr-4 w-40">
                  Current Pairing ID
                </label>
                <div className="text-sm text-gray-600 ml-[160px]">
                  {template?.pairing_id ? (
                    <>
                      <b>
                        [{template.pairing_id}]
                        {" "}
                        {
                          unpaireOptions.find((item) => item.id === template.pairing_id)?.title ||
                          "(Title not found)"
                        }
                      </b>
                    </>
                  ) : (
                    <span className="text-red-500">Not set</span>
                  )}
                </div>

              </div>

              {/* Pairing ID Select */}
              <div className="flex items-center mb-6">
                <label className="text-left block font-medium mb-1 mr-4 w-40">
                  Pairing ID
                </label>
                <select
                  name="pairing_id"
                  value={formData.pairing_id}
                  onChange={handleInputChange}
                  className="p-2 border rounded h-[40px] w-[300px] border-gray-300"
                >
                  <option value="">None</option>
                  {unpaireOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.id}] {item.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>



            {["station_file", "isd_file", "psr_file", "gradient_file", "attacking_speed_file"].map(
              (field) => (
                <div className="w-[48%] mb-6" key={field}>
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-left block font-medium mb-1 mr-4 w-40">
                      {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                      {existingFiles[field] && (
                        <>
                          <i
                            className="fa fa-eye cursor-pointer"
                            onClick={() => hangleShowDataonClickEyeIcon(field)}
                          ></i>
                          <i
                            className="fa fa-download cursor-pointer"
                            onClick={() => handleDownloadFile(field)}
                          ></i>
                        </>
                      )}
                    </div>
                  </div>
                  <FileDropzone
                    label={`New ${field.replace(/_/g, " ")}`}
                    file={formData[field]}
                    onDrop={handleFileDrop(field)}
                    align="left"
                  />
                </div>
              )
            )}

            <div className="w-full flex justify-center items-center ">
              <button
                type="submit"
                className="mt-16 mb-8 px-4 reportGenerateBg py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
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
      ) : (
        isTableVisible && data.length > 0 && (
          <DataTable columns={columns} data={data} onClose={() => setTableVisible(false)} />
        )
      )}
    </div>
  );
};

export default UpdateTemplateComponent;