import React, { useState } from "react";
import deleteIcon from "../images/delete-icon.svg";
import downloadIcon from "../images/downloadIcon.svg";
import viewIcon from "../images/viewIcon.svg";
import { useNavigate } from "react-router-dom";
import {
  getDataFromLocalStorage,
  setDataOnLocalStorage,
} from "../utils/localStorage";
import { baseUrl } from "../config/apiConfig";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";
import rightIcon from "../images/right.png"; // Assuming you have a right icon image

const DashboardCardComponent = ({ item, onDelete, onView, refreshReports }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(getDataFromLocalStorage("userInfo"));
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    setDataOnLocalStorage("currentReport", item);
    navigate(`/reports/${item.id}`, {});
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleDeleteItem = async () => {
    setLoading(true);
    console.log("handleClickDetel");
    try {
      const response = await apiService(
        "delete",
        `${RAILWAY_CONST.API_ENDPOINT.REPORTS}/${item.id}`
      );
      console.log("response", response.data.deleted);
      if (response?.data?.deleted) {
        refreshReports();
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
    setLoading(false);
  };

  return (
    <div className="relative dashboardCard dashboardCardOnlyRes pb-[65px] min-h-[240px] max-w-[24%] docCol w-[100%] mx-[.5%] mb-[15px] bg-[#f1f1f1] rounded-[10px] shadow-md hover:shadow-lg">
      <div>
        <div>
          <div className="sm:text-[32px] text-[30px] leading-[28px] flex justify-between reportGenerateBg bg-[#30424c] rounded-t-[10px] px-4 pt-2 pb-2 font-medium text-[#fff] text-ellipsis overflow-hidden w-[100%] border-b border[#fefefe] truncate">
            <span className="mt-[0px]">{item.id}</span>
            <span className="text-[15px] leading-[15px] text-right">
              {item.title}
              <span className="block text-[11px]">{item.date_of_analysis}</span>
            </span>
          </div>
          <div className="px-4">
            <ul className="dashboardCardUi">
              <li className="mt-2 text-[#211944] font-medium text-[14px]">
                <span className="mr-1 text-[#646262] font-medium">
                  Analyzed By :
                </span>
                <span className="truncate w-[150px] text-right">
                  {item?.analyzed_by}
                </span>
              </li>
              {/* <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#646262] font-medium">
                  Train :{" "}
                </span>
                {item?.train_id}
              </li> */}
              {/* <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#646262] font-medium">
                  Date of Working :{" "}
                </span>
                {item?.date_of_working}
              </li> */}
              <li className="mt-2 text-[#211944] font-medium text-[14px]">
                <span className="mr-1 text-[#646262] font-medium">Route: </span>
                {item?.stn_from} &rarr; {item?.stn_to}
              </li>
              <li className="mt-2 text-[#000] font-bold  text-[14px]">
                <span className="mr-1 text-[#646262] font-medium">
                  LP ID :{" "}
                </span>
                {item?.lp_cms_id}
              </li>
              <li className="mt-2 text-[#211944] font-medium text-[14px]">
                <span className="mr-1 text-[#646262] font-medium">
                  LP Name :{" "}
                </span>
                <span className="truncate w-[150px] text-right">
                  {item?.crew_name}
                </span>
              </li>
              <li className="mt-2 text-[#211944] font-medium text-[14px]">
                <span className="mr-1 text-[#646262] font-medium">
                  Departure Time :{" "}
                </span>
                {item?.departure_time}
              </li>
              <li className="mt-2 text-[#211944] font-medium text-[14px]">
                <span className="mr-1 text-[#646262] font-medium">
                  Arrival Time :{" "}
                </span>
                {item?.arrival_time}
              </li>
              <li className="mt-2 text-[#211944] font-medium text-[14px]">
                <span className="mr-1 text-[#646262] font-medium">
                  Average Speed :{" "}
                </span>
                {item?.avg_speed}
              </li>
              <li className="mt-2 text-[#211944] font-medium text-[14px]">
                <span className="mr-1 text-[#646262] font-medium">
                  Total Distance (KM) :{" "}
                </span>
                {item?.total_distance}
              </li>
              {(item?.psr_violation == null ||
                item?.psr_violation.length === 0) &&
              (item?.tsr_violation == null ||
                item?.tsr_violation.length === 0) &&
              (item?.attacking_speed_violation == null ||
                item?.attacking_speed_violation.length === 0) ? (
                <div className="flex items-center justify-center mt-5">
                  <span className="mr-1 text-[#91518D] font-bold text-[16px]">
                    No Violations
                  </span>
                  <span className="text-[#91518D] font-medium">
                    <img
                      src={rightIcon}
                      alt="right icon"
                      className="w-5 h-auto ml-2"
                    />
                  </span>
                </div>
              ) : (
                <>
                  <li className="mt-2 text-[#211944] font-medium text-[14px]">
                    <span className="mr-1 text-[#646262] font-medium">
                      PSR Violation :
                    </span>
                    <span
                      className={`${
                        item?.psr_violation == null ||
                        item?.psr_violation.length === 0
                          ? "text-black"
                          : "text-[red]"
                      }`}
                    >
                      {item?.psr_violation == null ||
                      item?.psr_violation.length === 0
                        ? "Nil"
                        : item?.psr_violation.length}
                    </span>
                  </li>
                  <li className="mt-2 text-[#211944] font-medium text-[14px]">
                    <span className="mr-1 text-[#646262] font-medium">
                      TSR Violation :
                    </span>
                    <span
                      className={`${
                        item?.tsr_violation == null ||
                        item?.tsr_violation.length === 0
                          ? "text-black"
                          : "text-[red]"
                      }`}
                    >
                      {item?.tsr_violation == null ||
                      item?.tsr_violation.length === 0
                        ? "Nil"
                        : item?.tsr_violation.length}
                    </span>
                  </li>
                  <li className="mt-2 text-[#211944] font-medium text-[14px]">
                    <span className="mr-1 text-[#646262] font-medium">
                      Attacking Speed Violation :
                    </span>
                    <span
                      className={`${
                        item?.attacking_speed_violation == null ||
                        item?.attacking_speed_violation.length === 0
                          ? "text-black"
                          : "text-[red]"
                      }`}
                    >
                      {" "}
                      {item?.attacking_speed_violation == null ||
                      item?.attacking_speed_violation.length === 0
                        ? "Nil"
                        : item?.attacking_speed_violation.length}
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="absolute border-t-2 border-t-[#ccc] sm:pt-[5px] pt-[1px] w-full bottom-0 pb-2 flex flex-row left-0">
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
            src={viewIcon}
            className="cursor-pointer leading-[13px] w-[21px] mr-[2px] mb-1"
          />
          View
        </span>
        <a
          href={`${baseUrl}/${RAILWAY_CONST.API_ENDPOINT.REPORTS}/${
            item.id
          }/download?report_file_type=pdf&from_station=${
            item.stn_from
          }&to_station=${item.stn_to}&jwt=${userInfo.access_token || ""}`}
          // onClick={() => onView(item)}
          className="flex w-[50%] text-[13px] opacity-[.8] text-[#414141] items-center cursor-pointer flex-col hover:opacity-[1] items-center justify-center text-center leading-[13px]"
        >
          <img
            alt="view icon"
            src={downloadIcon}
            className="cursor-pointer leading-[13px] w-[22px] mr-[2px] mb-1"
          />
          Download
        </a>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="mb-4">
              Are you sure you want to delete the report{" "}
              <strong>
                "{item.title} (<strong>{item.id}</strong>)"
              </strong>{" "}
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
    </div>
  );
};

export default DashboardCardComponent;
