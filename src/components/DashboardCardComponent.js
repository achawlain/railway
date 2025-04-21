import React from "react";
import deleteIcon from "../images/delete-icon.svg";
import chatIcon from "../images/chatIcon.svg";
import { useNavigate } from "react-router-dom";
import { setDataOnLocalStorage } from "../utils/localStorage";

const DashboardCardComponent = ({ item, onDelete, onView }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    setDataOnLocalStorage("currentReport", item);
    navigate(`/reports/${item.id}`, {});
  };
  console.log("item", item);

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
                <span className="mr-1 text-[#414141] font-medium">
                  Date of Working :{" "}
                </span>
                {item?.date_of_working}
              </li>
              <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#414141] font-medium">
                  From:{" "}
                </span>
                {item?.stn_from}                
              </li>
              <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#414141] font-medium">
                  To :{" "}
                </span>
                {item?.stn_to}
              </li>
              <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#414141] font-medium">
                Departure Time :{" "}
                </span>
                {item?.departure_time}
              </li>
              <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#414141] font-medium">
                Arrival Time :{" "}
                </span>
                {item?.arrival_time}                
              </li>
              <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#414141] font-medium">
                Average Speed :{" "}
                </span>
                {item?.avg_speed}                
              </li>
              <li className="mt-2 text-[#000] font-bold">
                <span className="mr-1 text-[#414141] font-medium">
                Total Distance (KM) :{" "}
                </span>
                {item?.total_distance}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCardComponent;
