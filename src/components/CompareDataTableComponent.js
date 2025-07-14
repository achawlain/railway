import { useEffect, useState } from "react";
import replace from "../images/replace.svg";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import ErrorPopUpComponent from "./ErrorPopUpComponent";

const CompareDataTableComponent = ({
  columns,
  data,
  onClose,
  compareData,
  cardTemplateData,
}) => {
  const [errorPopupState, setErrorPopupState] = useState({
    isShow: false,
    message: "",
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose(event);
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]); // Dependency array ensures effect runs when onClose changes

  const handleReplaceFile = async () => {
    try {
      const response = await apiService(
        "post",
        `${RAILWAY_CONST.API_ENDPOINT.GPS}/${cardTemplateData.id}${RAILWAY_CONST.API_ENDPOINT.REPLACE}`
      );

      if (response?.status === 200 && response?.message === "ok") {
        onClose();
      } else {
        // ✅ Handle error here if response is not ok
        const errorMessage =
          response?.message ||
          "Unexpected error occurred while replacing file.";
        setErrorPopupState({
          isShow: true,
          message: errorMessage,
        });
      }
    } catch (error) {
      console.log("Error replacing file:", error);
      let errorMessage = "Failed to fetch data. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setErrorPopupState({
        isShow: true,
        message: errorMessage,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white relative">
        <button
          className="absolute sm:top-2 top-[3px] leading-[12px] right-[26px] text-white hover:text-gray-100 z-20 w-[20px] h-[20px] rounded-sm"
          onClick={(e) => {
            onClose(e);
          }}
        >
          ✕
        </button>

        <div className="reportGenerateBg compareTableTitle text-[white] text-center p-2">
          Compare ISD Files
        </div>
        <div className="w-full flex flex-row">
          <div className="w-1/2 p-2 text-center">ISD GPS File</div>
          <div className="w-1/2 p-2 text-center">ISD File</div>
        </div>
        <div>
          <img
            src={replace}
            alt="Replace Icon"
            className="absolute top-72 left-[44.5%] w-8 h-6 cursor-pointer z-20"
            onClick={() => handleReplaceFile()}
          />
        </div>
        <div className="p-4 pt-0">
          <div className="rounded-lg shadow-lg max-w-3/4 w=full max-h-[80vh] overflow-auto relative">
            <div className="flex flex-row text-[14px] text-[#414141]">
              <div className="pr-6">
                <table className="table-auto w-full border-collapse border border-gray-300 responsiveTable">
                  <thead className="hidden sm:table-header-group">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="border border-gray-300 px-4 py-2 text-left bg-gray-100"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    {compareData.map((row, index) => (
                      <tr
                        key={index}
                        className="block sm:table-row border-b sm:border-0 mb-4 sm:mb-0"
                      >
                        {columns.map((column) => (
                          <td
                            key={column}
                            className="block sm:table-cell border border-gray-300 px-4 py-2 relative sm:static text-[#414141]  text-[13px]"
                            data-label={column}
                          >
                            {row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pl-6">
                <table className="table-auto w-full border-collapse border border-gray-300 responsiveTable">
                  <thead className="hidden sm:table-header-group">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          className="border border-gray-300 px-4 py-2 text-left bg-gray-100"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    {data.map((row, index) => (
                      <tr
                        key={index}
                        className="block sm:table-row border-b sm:border-0 mb-4 sm:mb-0 text-[#414141]"
                      >
                        {columns.map((column) => (
                          <td
                            key={column}
                            className="block sm:table-cell border border-gray-300 px-4 py-2 relative sm:static text-[#414141]  text-[13px]"
                            data-label={column}
                          >
                            {row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ErrorPopUpComponent
        isErrorShow={errorPopupState.isShow}
        errorMessage={errorPopupState.message}
        redirect={""}
      />
    </div>
  );
};

export default CompareDataTableComponent;
