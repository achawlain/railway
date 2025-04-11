import React from "react";
import deleteIcon from "../images/delete-icon.svg";
import chatIcon from "../images/chatIcon.svg";
import { Link } from "react-router-dom";
const DashboardCardComponent = ({ item, onDelete, onView }) => {
  return (
    <Link
      to={`/reports/${item.id}`}
      state={{ title: item.title, speed_before_1000m: item.speed_before_1000m }}
      className="relative pb-[55px] min-h-[240px] max-w-sm relative docCol w-[24%] mx-[.5%] mb-[20px] bg-[#f1f1f1] rounded-[10px] shadow-md hover:shadow-lg"
    >
      <div>
        <div>
          <div className="text-[18px] reportGenerateBg bg-[#30424c] rounded-t-[10px] px-4 pt-2 pb-2 font-medium text-[#fff] text-ellipsis overflow-hidden w-[100%] border-b border[#fefefe] truncate">
            {item.title}
          </div>
          <div className="px-4">
            <ul>
              <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#414141] font-medium">
                  Analyzed By :
                </span>
                {item?.analyzed_by}
              </li>
              <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#414141] font-medium">
                  Train :{" "}
                </span>
                {item?.train_id}
              </li>
              <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#414141] font-medium">Date : </span>
                {item?.date}
              </li>
            </ul>
          </div>
        </div>
        {/* <div className="absolute border-t-2 border-t-[#ccc] pt-[5px] w-full bottom-0 pb-2 flex flex-row left-0">
        <div
          className="flex w-[50%] text-[13px] opacity-[.8]  text-[#414141] items-center cursor-pointer flex-col hover:opacity-[1] items-center justify-center text-center leading-[13px]"
          onClick={() => onDelete(item)}
        >
          <img
            alt="delete icon"
            src={deleteIcon}
            className="cursor-pointer leading-[13px] w-[19px] mr-[2px] mb-2"
          />
          Delete
        </div>
        <span
          onClick={() => onView(item)}
          className="flex w-[50%] text-[13px] opacity-[.8] text-[#414141] items-center cursor-pointer flex-col hover:opacity-[1] items-center justify-center text-center leading-[13px]"
        >
          <img
            alt="view icon"
            src={chatIcon}
            className="cursor-pointer leading-[13px] w-[21px] mr-[2px] mb-2"
          />
          Chat
        </span>
      </div> */}
      </div>
    </Link>
  );
};

export default DashboardCardComponent;
