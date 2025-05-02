import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDataFromLocalStorage,
  setDataOnLocalStorage,
} from "../utils/localStorage";

import { apiService, DataTable } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import ShowMessagePopUp from "./ShowMessagePopUp";
import Loader from "./Loader";

const TemplateCardComponents = ({ item, onDelete, onView }) => {
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableVisible, setTableVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    setDataOnLocalStorage("currentTemplate", item);
    navigate(RAILWAY_CONST.ROUTE.CREATE_REPORT);
  };

  const hangleShowDataonClickEyeIcon = async (dataSource) => {
    setIsLoading(true);
    console.log("template.id", item.id);
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.METADATA,
        {},
        {
          template_id: item.id,
          data_src: dataSource,
        }
      );
      const responseData = response?.data || [];

      if ("message" in responseData) {
        setColumns([]);
        setData([]);
        setPopup({ show: true, message: responseData.message, type: "" });
        setTimeout(() => {
          setPopup({ show: false, message: "", type: "" });
        }, 4000);
      } else {
        setColumns(Object.keys(responseData[0])); // Get column names dynamically
        setData(responseData);
        setTableVisible(true);
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
          template_id: item.id,
          data_src: dataSource,
          download: item.id,
        }
      );

      if (response && response.data && "message" in response.data) {
        setPopup({ show: true, message: response?.data?.message, type: "" });
        setTimeout(() => {
          setPopup({ show: false, message: "", type: "" });
        }, 4000);
      } else {
        const blob = new Blob([response.data], { type: "text/csv" }); // or whatever the file type is
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${dataSource}_${item.id}.csv`; // You can customize filename
        document.body.appendChild(link);
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        link.remove();
      }
    } catch (error) {
      console.error("Error fetching csv data:", error);
      setError("Failed to fetch csv data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer pb-[55px] min-h-[240px] max-w-sm relative docCol w-[24%] mx-[.5%] mb-[20px] bg-[#f1f1f1] rounded-[10px] shadow-md hover:shadow-lg"
    >
      <div>
        <div>
          <div className="text-[18px] reportGenerateBg bg-[#30424c] rounded-t-[10px] px-4 pt-2 pb-2 font-medium text-[#fff] text-ellipsis overflow-hidden w-[100%] border-b border[#fefefe] truncate">
            {item.title}
          </div>
          <div className="px-4">
            <ul>
              {item?.id && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0 mr-auto">
                    Id:
                  </span>
                  <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.id}
                  </span>
                </li>
              )}

              {item?.attacking_speed_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0 mr-auto">
                    Attacking Speed File:
                  </span>
                  {/* <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.attacking_speed_file}
                  </span> */}
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      hangleShowDataonClickEyeIcon("attacking_speed_file");
                    }}
                  >
                    <i className="fa fa-eye"></i>
                  </span>
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110 mt-[2px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile("attacking_speed_file");
                    }}
                  >
                    <i className="fa fa-download"></i>
                  </span>
                </li>
              )}
              {item?.gradient_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0 mr-auto">
                    Gradient File:
                  </span>
                  {/* <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.gradient_file}
                  </span> */}
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      hangleShowDataonClickEyeIcon("gradient_file");
                    }}
                  >
                    <i className="fa fa-eye"></i>
                  </span>
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110 mt-[2px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile("gradient_file");
                    }}
                  >
                    <i className="fa fa-download"></i>
                  </span>
                </li>
              )}
              {item?.isd_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0 mr-auto">
                    ISD File:
                  </span>
                  {/* <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.isd_file}
                  </span> */}
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      hangleShowDataonClickEyeIcon("isd_file");
                    }}
                  >
                    <i className="fa fa-eye"></i>
                  </span>
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110 mt-[2px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile("isd_file");
                    }}
                  >
                    <i className="fa fa-download"></i>
                  </span>
                </li>
              )}
              {item?.psr_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0 mr-auto">
                    PSR File:
                  </span>
                  {/* <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.psr_file}
                  </span> */}
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      hangleShowDataonClickEyeIcon("psr_file");
                    }}
                  >
                    <i className="fa fa-eye"></i>
                  </span>
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110 mt-[2px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile("psr_file");
                    }}
                  >
                    <i className="fa fa-download"></i>
                  </span>
                </li>
              )}
              {item?.station_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0 mr-auto">
                    Station File:
                  </span>
                  {/* <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.station_file}
                  </span> */}
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      hangleShowDataonClickEyeIcon("station_file");
                    }}
                  >
                    <i className="fa fa-eye"></i>
                  </span>
                  <span
                    className="eyeIcon ml-4 cursor-pointer transition-all duration-200 transform hover:scale-110 mt-[2px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadFile("station_file");
                    }}
                  >
                    <i className="fa fa-download"></i>
                  </span>
                </li>
              )}
            </ul>
          </div>
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
              onClose={(e) => {
                e.stopPropagation();
                setTableVisible(false);
              }}
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

export default TemplateCardComponents;
