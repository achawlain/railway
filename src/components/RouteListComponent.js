import React, { useEffect, useState, useRef } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import ErrorPopUpComponent from "./ErrorPopUpComponent";
import Loader from "./Loader";
import handPointer from "../images/handPointer.png";
import {
  getDataFromLocalStorage,
  setDataOnLocalStorage,
} from "../utils/localStorage";
import { Toast } from "primereact/toast";

const RouteListComponent = () => {
  const [routeList, setRouteList] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [loading, setLoading] = useState(true);
  const [signalData, setSignalData] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);
  const [selectedSignalRow, setselectedSignalRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [clickedIndices, setClickedIndices] = useState([]);

  const toastRef = useRef(null);

  const [errorPopupState, setErrorPopupState] = useState({
    isShow: false,
    message: "",
  });
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    getRouteList();
  }, []);

  const getRouteList = async () => {
    setLoading(true);
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.TEMPLATE
      );
      const data = response?.data || response?.templates || [];
      setRouteList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching route list:", error);
      setErrorPopupState({
        isShow: true,
        message: "Failed to load routes. Please try again.",
      });
    }
    setLoading(false);
  };

  const handleStartjouneyData = async (dataSource) => {
    try {
      const response = await apiService(
        "post",
        `${RAILWAY_CONST.API_ENDPOINT.GPS_TEMPLATES}/${selectedRoute.id}`,

        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.id) {
        setDataOnLocalStorage("gpsRouteId", response?.data?.id);

        if (
          window.AndroidBridge &&
          typeof window.AndroidBridge.receiveValueFromWeb === "function"
        ) {
          window.AndroidBridge.receiveValueFromWeb(response?.data?.id);
        }
        handleShowSingalData(dataSource);
      } else {
        let errorMessage = "Failed to fetch data. Please try again.";

        if (response?.data?.message) {
          errorMessage = response.data.message;
        }

        setErrorPopupState({
          isShow: true,
          message: errorMessage, // ✅ Always set a string here!
        });
      }
    } catch (error) {
      let errorMessage = "Failed to fetch data. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setErrorPopupState({
        isShow: true,
        message: errorMessage, // ✅ Always set a string here!
      });
    }
  };

  const handleShowSingalData = async (dataSource) => {
    if (!selectedRoute) return;
    setLoading(true);

    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.METADATA,
        {},
        {
          template_id: selectedRoute.id,
          data_src: dataSource,
        }
      );
      const responseData = response?.data || [];

      if (responseData.length > 0) {
        setSignalData(responseData);
        setTableVisible(true);
        setSelectedIndex(0);
        setClickedIndices([]);
      } else {
        await handleEndjourneyData();
        setErrorPopupState({
          isShow: true,
          message: response?.data?.message,
        });
      }
    } catch (error) {
      await handleEndjourneyData();
      console.error("Error fetching csv data:", error);
      let errorMessage = "Failed to load data. Please try again.";

      // Check if server provided a custom message
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setErrorPopupState({
        isShow: true,
        message: errorMessage, // ✅ Always set a string here!
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndjourneyData = async () => {
    const gpsID = getDataFromLocalStorage("gpsRouteId");
    const data = {
      status: 1,
    };

    try {
      const response = await apiService(
        "put",
        `${RAILWAY_CONST.API_ENDPOINT.GPS}/${gpsID}`,
        data
      );

      if (response?.status === 200) {
        try {
          if (toastRef.current) {
            toastRef.current.show({
              severity: "success",
              summary: "Success",
              detail: "Signal tracker ended successfully",
              life: 3000,
            });
          }
        } catch (toastErr) {
          console.error("Toast error", toastErr);
        }
        setTableVisible(false);
      } else {
        // Logical failure from backend — show the message
        setErrorPopupState({
          isShow: true,
          message: response?.message || "Something went wrong!",
        });
      }
    } catch (error) {
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

  const handleSelectRoute = (e) => {
    const routeId = e.target.value;
    const route = routeList.find((item) => item.id.toString() === routeId);
    setSelectedRoute(route || null);

    setErrorPopupState({
      isShow: false,
      message: "",
    });
  };

  const handleActiveSignalRow = (item) => {
    setselectedSignalRow(item);
  };

  // const handleSignalClick = (rowIndex) => {
  //   if (rowIndex !== selectedIndex) return;

  //   setClickedIndices((prev) => [...prev, rowIndex]);

  //   if (rowIndex + 1 < signalData.length) {
  //     setSelectedIndex(rowIndex + 1);

  //     const container = document.getElementById("scroll-container");
  //     if (rowIndex > 1) {
  //       if (container) {
  //         container.scrollTo({
  //           top: (rowIndex + 1) * 43,
  //           behavior: "smooth",
  //         });
  //       }
  //     }
  //   }
  // };

  const handleSignalClick = (rowIndex, item) => {
    if (rowIndex !== selectedIndex) return;
    console.log("item", item);

    setDataOnLocalStorage("selectedSignal", item.signal);

    if (
      window.AndroidBridge &&
      typeof window.AndroidBridge.receiveValueFromWeb === "function"
    ) {
      window.AndroidBridge.receiveValueFromWeb(item.signal);
    }

    const now = new Date();
    const timestamp = now.toLocaleString(); // You can customize this format

    // Optional: Add timestamp to the item (if needed)
    const updatedSignal = [...signalData];
    updatedSignal[rowIndex].clickedAt = timestamp;
    setSignalData(updatedSignal);

    setClickedIndices((prev) => [...prev, rowIndex]);

    if (rowIndex + 1 < signalData.length) {
      setSelectedIndex(rowIndex + 1);

      const container = document.getElementById("scroll-container");
      if (container && rowIndex > 1) {
        const rowHeight = 53;
        const scrollTop = (rowIndex - 1) * rowHeight;
        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    } else {
      setSelectedIndex(-1);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="loader">
            <Loader />
          </div>
        </div>
      ) : (
        <>
          <Toast ref={toastRef} position="top-right" />
          {tableVisible ? (
            <div className="w-full">
              <div className="w-full bg-[#efefef] sm:p-4 p-2 reportGenerateBg pt-8 min-h-screen dashboardMainCol">
                <div className=" max-w-[1600px] mx-auto px-2 mb-4 mt-2">
                  <div className="bg-white w-full sm:p-8 p-4 rounded-[15px] sm:pt-[16px] min-h-[600px]">
                    <h1 className="text-[18px] text-[#30424c] font-medium mb-[10px] border-b border-[#ccc] pb-2 relative pt-2">
                      Route List
                    </h1>

                    <div className="w-full">
                      <div className="overflow-x-auto bg-white pb-8 mt-4">
                        <h3 className="text-[18px] mb-4 mt-2">
                          {selectedRoute.title}
                        </h3>
                        {/* <table className="min-w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-[#9b4b90] text-white">
                              <th className="border border-gray-300 p-2 text-[14px]">
                                Signal
                              </th>
                              <th className="border border-gray-300 p-2 text-[14px]">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {signalData.map((item, rowIndex) => (
                              <tr key={rowIndex} className="text-center">
                                <td className="border border-gray-300 p-2 text-[13px] text-left">
                                  {item.signal}
                                </td>
                                <td
                                  className="border border-gray-300 p-2 text-[13px] cursor-pointer"
                                  onClick={() => handleActiveSignalRow(item)}
                                >
                                  <span
                                    className={`h-[20px] w-[20px] rounded-full inline-block ${
                                      selectedSignalRow?.signal === item.signal
                                        ? "bg-[green]"
                                        : "bg-[#ccc]"
                                    }`}
                                  ></span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table> */}

                        <div className="w-full">
                          <div className="bg-[#9b4b90] text-white flex flex-row mb-4">
                            <div className=" w-[100%] p-2 text-[16px]">
                              Signal Tracker
                            </div>
                          </div>
                          <div
                            className="h-[320px] overflow-auto"
                            id="scroll-container"
                          >
                            {signalData.map((item, rowIndex) => {
                              const isActive = rowIndex === selectedIndex;
                              const isClicked =
                                clickedIndices.includes(rowIndex);

                              return (
                                <div
                                  key={rowIndex}
                                  className={`flex flex-row w-full text-center singnalRow`}
                                >
                                  <div
                                    className={`w-[50%] text-right px-2 text-[13px] pr-[15px] relative flex justify-end ${
                                      isActive
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed"
                                    }`}
                                    onClick={() =>
                                      handleSignalClick(rowIndex, item)
                                    }
                                  >
                                    <div className="text-[10px] text-gray-500 absolute bottom-3 w-[35px] dateTime absolute left-[10px]">
                                      {item.clickedAt ? item.clickedAt : ""}
                                    </div>
                                    {isActive && (
                                      <span className="absolute left-[60px] top-[14px] pointer-animation">
                                        <img
                                          src={handPointer}
                                          alt="pointer"
                                          className="w-[30px]"
                                        />
                                      </span>
                                    )}

                                    <span className="h-[53px] flex justify-center w-[30px] inline-block relative  items-center pb-1 text-center">
                                      <span
                                        className={`relative z-20 rounded-full inline-block ${
                                          isActive
                                            ? "bg-green-600 blinkn h-[30px] w-[30px]"
                                            : isClicked
                                            ? "bg-orange-500 h-[25px] w-[25px]"
                                            : "bg-[#ccc] h-[25px] w-[25px]"
                                        }`}
                                      ></span>
                                      {/* <span className="absolute bg-[#f1f1f1] inline-blcok h-[100%] z-10 left-[45%] w-[2px]"></span> */}
                                    </span>
                                  </div>
                                  <div
                                    className={`w-[50%] px-2 text-[16px] text-left items-center flex pb-1`}
                                  >
                                    {item.signal}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="w-full mt-8">
                          <span
                            type="submit"
                            onClick={() => handleEndjourneyData()}
                            className="mt-4  px-3 reportGenerateBg py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-[15px] cursor-pointer"
                          >
                            End Journey
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="w-full bg-[#efefef] sm:p-4 p-2 reportGenerateBg pt-8 min-h-screen dashboardMainCol">
                <div className=" max-w-[1600px] mx-auto px-2 mb-4 mt-2">
                  <div className="bg-white w-full sm:p-8 p-4 rounded-[15px] sm:pt-[16px] min-h-[600px]">
                    <h1 className="text-[18px] text-[#30424c] font-medium mb-[10px] border-b border-[#ccc] pb-2 relative pt-2">
                      Route List
                    </h1>

                    <div className="mb-6 w-full">
                      <label
                        className="block text-gray-700 text-[16px] mt-[32px] mb-1"
                        htmlFor="route"
                      >
                        Choose Route:
                      </label>
                      <select
                        id="route"
                        name="route"
                        onChange={handleSelectRoute}
                        className="w-full mb-4 max-w-[400px] text-[16px] border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2"
                      >
                        <option value="">-- Select a Route --</option>
                        {routeList.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <span
                        type="submit"
                        onClick={() => handleStartjouneyData("isd_file")}
                        className="mt-4  px-3 reportGenerateBg py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-[15px] cursor-pointer"
                      >
                        Start Journey
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ErrorPopUpComponent
            isErrorShow={errorPopupState.isShow}
            errorMessage={errorPopupState.message}
            redirect={redirect}
          />
        </>
      )}
    </>
  );
};

export default RouteListComponent;
