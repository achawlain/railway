import React from "react";
import deleteIcon from "../images/delete-icon.svg";
import chatIcon from "../images/chatIcon.svg";
import { useNavigate } from "react-router-dom";
import { setDataOnLocalStorage } from "../utils/localStorage";
import RAILWAY_CONST from "../utils/RailwayConst";

const TemplateCardComponents = ({ item, onDelete, onView }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    setDataOnLocalStorage("currentTemplate", item);
    navigate(RAILWAY_CONST.ROUTE.CREATE_REPORT);
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
                  <span className="mr-1 text-[#414141] font-medium shrink-0">
                    Id:
                  </span>
                  <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.id}
                  </span>
                </li>
              )}

              {item?.attacking_speed_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0">
                    Attacking Speed File:
                  </span>
                  <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.attacking_speed_file}
                  </span>
                </li>
              )}
              {item?.gradient_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0">
                    Gradient File:
                  </span>
                  <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.gradient_file}
                  </span>
                </li>
              )}
              {item?.isd_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0">
                    ISD File:
                  </span>
                  <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.isd_file}
                  </span>
                </li>
              )}
              {item?.psr_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0">
                    PSR File:
                  </span>
                  <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.psr_file}
                  </span>
                </li>
              )}
              {item?.station_file && (
                <li className="mt-2 text-[#000] font-bold flex">
                  <span className="mr-1 text-[#414141] font-medium shrink-0">
                    Station File:
                  </span>
                  <span className="truncate overflow-hidden whitespace-nowrap max-w-full">
                    {item.station_file}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCardComponents;
