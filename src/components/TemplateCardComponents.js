import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDataFromLocalStorage,
  setDataOnLocalStorage,
} from "../utils/localStorage";

import deleteIcon from "../images/delete-icon.svg";
// import downloadIcon from "../images/downloadIcon.svg";
// import viewIcon from "../images/viewIcon.svg";
import { Link } from "react-router-dom";
import useIt from "../images/useIt.png";
import compare from "../images/compare-icon.svg";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import ShowMessagePopUp from "./ShowMessagePopUp";
import DataTable from "./DataTable";
import CompareDataTableComponent from "./CompareDataTableComponent";
import Loader from "./Loader";
import ErrorPopUpComponent from "./ErrorPopUpComponent";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const TemplateCardComponents = ({
  item,
  onDelete,
  onView,
  templateMap,
  refreshTemplates,
  getTemplateData,
}) => {
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [data, setData] = useState([]);
  const [comparedataISDFile, setCompareDataISDFile] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableVisible, setTableVisible] = useState(false);
  const [isCompareTableVisible, setIsCompareTableVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [direction, setDirection] = useState(item?.direction || 0); // 0 = UP, 1 = DOWN


  const [errorPopupState, setErrorPopupState] = useState({
    isShow: false,
    message: "",
  });

  const currentData =
    direction === 0 ? item : templateMap.get(item.pairing_id) || item;

  const hasToggle =  item.pairing_id !== null;

  const handleClick = () => {
    setDataOnLocalStorage("currentTemplate", item);
    navigate(RAILWAY_CONST.ROUTE.CREATE_REPORT);
  };

  const hangleShowDataonClickEyeIcon = async (dataSource) => {
    setIsLoading(true);

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
      console.log("responseData===", responseData);

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
      console.log("Error replacing file:", error);
      let errorMessage = "Failed to fetch data. Please try again.";
      if (error?.message) {
        errorMessage = error?.message;
      }
      setErrorPopupState({
        isShow: true,
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const CompareISDFile = async (dataSource) => {
    setIsLoading(true);
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

        if (dataSource === "isd_file") {
          setData(responseData);
        } else {
          setCompareDataISDFile(responseData);
        }
        setIsCompareTableVisible(true);
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
          download: "1",
        }
      );

      if (response && response.data && "message" in response.data) {
        setPopup({ show: true, message: response?.data?.message, type: "" });
        setTimeout(() => {
          setPopup({ show: false, message: "", type: "" });
        }, 4000);
      } else {
        const blob = new Blob([response], { type: "text/csv" }); // or whatever the file type is
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

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleDeleteItem = async () => {
    setLoading(true);

    try {
      const response = await apiService(
        "delete",
        `${RAILWAY_CONST.API_ENDPOINT.TEMPLATE}/${item.id}`
      );

      if (response?.data?.deleted) {
        refreshTemplates();
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
    setLoading(false);
  };

  const handleCompareISDFile = async () => {
    await CompareISDFile("isd_gps_file");
    await CompareISDFile("isd_file");
  };

  const handleEdit = () => {
    setDataOnLocalStorage("currentTemplate", item);
    navigate(RAILWAY_CONST.ROUTE.UPDATE_TEMPLATE);
  };

  return (
    <>
      {/* <div className="relative pb-[55px] min-h-[240px] max-w-sm relative docCol w-[24%] mx-[.5%] mb-[20px] bg-[#f1f1f1] rounded-[10px] shadow-md hover:shadow-lg"> */}
      <div className=" dashboardCard pb-[65px] min-h-[240px] max-w-sm relative docCol w-[100%] min-w-[385px] mx-[.5%] mb-[20px] bg-[#f1f1f1] rounded-[10px] shadow-md hover:shadow-lg">
        <div>
          <div>
            <div className="text-[18px] reportGenerateBg bg-[#30424c] rounded-t-[10px] px-4 pt-2 pb-2 font-medium text-[#fff] text-ellipsis overflow-hidden w-[100%] border-b border[#fefefe] truncate flex justify-between">
              [{currentData?.id}] {currentData?.title}

              {/* toggle button */}
              {hasToggle && (
                <div className="flex items-center text-[14px]">
                  <span className="mr-2 text-white font-bold">
                    {direction === 0 ? "UP" : "DOWN"}
                  </span>
                  <label className="relative inline-block w-10 h-5">
                    <input
                      type="checkbox"
                      checked={direction === 1}
                      onChange={() => setDirection((prev) => (prev === 0 ? 1 : 0))}
                      className="opacity-0 w-0 h-0"
                    />
                    <span
                      className="absolute top-0 left-0 right-0 bottom-0 bg-gray-400 rounded-full transition-all duration-300 cursor-pointer"
                    ></span>
                    <span
                      className={`absolute left-1 top-[2px] w-4 h-4 rounded-full shadow transition-transform duration-300 bg-[#9b4b90]`}
                      style={{
                        transform: direction === 1 ? "translateX(20px)" : "translateX(0)",
                      }}
                    ></span>
                  </label>
                </div>
              )}
            </div>

            <div className="px-4">
              <ul>
                {currentData?.attacking_speed_file && (
                  <li className="mt-2 text-[#000] font-bold flex text-[14px]">
                    <span className="mr-1 text-[#414141] font-medium shrink-0 mr-auto">
                      Attacking Speed File:
                    </span>

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
                {currentData?.gradient_file && (
                  <li className="mt-2 text-[#000] font-bold flex text-[14px]">
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
                {currentData?.isd_file && (
                  <li className="mt-2 text-[#000] font-bold flex text-[14px]">
                    <span className="mr-1 text-[#414141] font-medium shrink-0 mr-auto">
                      ISD File:
                    </span>
                    {/* <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.isd_file}
                  </span> */}
                    {currentData?.isd_gps_file && (
                      <span>
                        <img
                          src={compare}
                          alt="compare icon"
                          className="cursor-pointer leading-[13px] w-[19px] mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompareISDFile();
                          }}
                        />
                      </span>
                    )}
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
                {currentData?.psr_file && (
                  <li className="mt-2 text-[#000] font-bold flex text-[14px]">
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
                {currentData?.station_file && (
                  <li className="mt-2 text-[#000] font-bold flex text-[14px]">
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
        <div className="absolute border-t-2 border-t-[#ccc] pt-[5px] w-full bottom-0 pb-2 flex flex-row left-0">
          <div
            className="flex w-[50%] text-[13px] opacity-[.8]  text-[#414141] items-center cursor-pointer flex-col hover:opacity-[1] items-center justify-center text-center leading-[13px]"
            onClick={handleDeleteClick}
          >
            <img
              alt="delete icon"
              src={deleteIcon}
              className="cursor-pointer leading-[13px] w-[19px] mr-[2px] mb-1"
            />
            Delete
          </div>
          <span
            onClick={handleClick}
            // onClick={() => onView(item)}
            className="flex w-[50%] text-[13px] opacity-[.8] text-[#414141] items-center cursor-pointer flex-col hover:opacity-[1] items-center justify-center text-center leading-[13px]"
          >
            <img
              alt="view icon"
              src={useIt}
              className="cursor-pointer leading-[13px] w-[21px] mr-[2px] mb-1"
            />
            Use It
          </span>
          <span
            onClick={handleEdit}
            className="flex w-[50%] text-[13px] opacity-[.8] text-[#414141] items-center cursor-pointer flex-col hover:opacity-[1] items-center justify-center text-center leading-[13px]"
          >
            {/* <Link to={RAILWAY_CONST.ROUTE.UPDATE_TEMPLATE}> */}
            <Button
              // label="Edit"
              icon="pi pi-pencil"
              className="pb-2 !focus:box-shadow-none !focus:outline-none !focus:border-red-400 cursor-pointer leading-[13px] w-[21px] mr-[2px] mb-1"
            />
            {/* </Link> */}
            Edit
          </span>
        </div>
        {popup.show && (
          <ShowMessagePopUp
            message={popup.message}
            type={popup.type}
            onClose={() => setPopup({ show: false, message: "", type: "" })}
          />
        )}

        {isLoading ? (
          <div className="cardLoader">
            <Loader />
          </div>
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

        {isLoading ? (
          <div className="cardLoader">
            <Loader />
          </div>
        ) : data.length > 0 ? (
          <>
            {isCompareTableVisible && (
              <CompareDataTableComponent
                columns={columns}
                data={data}
                cardTemplateData={item}
                compareData={comparedataISDFile}
                onClose={(e) => {
                  if (e?.stopPropagation) e.stopPropagation();
                  setIsCompareTableVisible(false);
                  getTemplateData();
                }}
              />
            )}
          </>
        ) : (
          // <p>No data available.</p>
          ""
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="mb-4">
              Are you sure you want to delete this template{" "}
              <strong>
                "{item.title} (<strong>{item.id}</strong>)"
              </strong>
              ?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 reportGenerateBg text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ErrorPopUpComponent
        isErrorShow={errorPopupState.isShow}
        errorMessage={errorPopupState.message}
        redirect={""}
      />
    </>
  );
};

export default TemplateCardComponents;
