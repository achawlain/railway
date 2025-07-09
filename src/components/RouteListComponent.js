import React, { useEffect, useState } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import ErrorPopUpComponent from "./ErrorPopUpComponent";
import Loader from "./Loader";
import handPointer from "../images/handPointer.png";

const RouteListComponent = () => {
  const [routeList, setRouteList] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [loading, setLoading] = useState(true);
  const [signalData, setSignalData] = useState([]);
  const [tableVisible, setTableVisible] = useState(false);
  const [selectedSignalRow, setselectedSignalRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [clickedIndices, setClickedIndices] = useState([]);

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
      console.log("res", responseData);
      if (responseData.length > 0) {
        setSignalData(responseData);
        setTableVisible(true);
        setSelectedIndex(0);
        setClickedIndices([]);
      } else {
        setErrorPopupState({
          isShow: true,
          message: response?.data?.message,
        });
      }
    } catch (error) {
      console.error("Error fetching csv data:", error);
      // setError("Failed to fetch csv data. Please try again later.");
      setErrorPopupState({
        isShow: true,
        message: error || "Failed to load data. Please try again.",
      });
    } finally {
      setLoading(false);
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

  const handleSignalClick = (rowIndex) => {
    if (rowIndex !== selectedIndex) return;

    setClickedIndices((prev) => [...prev, rowIndex]);

    if (rowIndex + 1 < signalData.length) {
      setSelectedIndex(rowIndex + 1);

      const container = document.getElementById("scroll-container");
      if (container && rowIndex > 1) {
        const rowHeight = 43;
        const scrollTop = (rowIndex - 1) * rowHeight;
        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
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
                          <div className="bg-[#9b4b90] text-white flex flex-row">
                            <div className="border w-[50%] border-gray-300 p-2 text-[14px]">
                              Signal
                            </div>
                            <div className="border  w-[50%] border-gray-300 p-2 text-[14px]">
                              Action
                            </div>
                          </div>
                          <div
                            className="h-[280px] overflow-auto"
                            id="scroll-container"
                          >
                            {signalData.map((item, rowIndex) => {
                              const isActive = rowIndex === selectedIndex;
                              const isClicked =
                                clickedIndices.includes(rowIndex);

                              return (
                                <div
                                  key={rowIndex}
                                  className={`flex flex-row w-full text-center ${
                                    isActive ? "bg-white" : "bg-[#efefef]"
                                  }`}
                                >
                                  <div className="border w-[50%] border-gray-300 p-2 text-[13px] text-left">
                                    {item.signal}
                                  </div>

                                  <div
                                    className={`border w-[50%] border-gray-300 p-2 text-[13px] relative ${
                                      isActive
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed"
                                    }`}
                                    onClick={() => handleSignalClick(rowIndex)}
                                  >
                                    {isActive && (
                                      <span className="absolute left-[10px] top-[10px] pointer-animation">
                                        <img
                                          src={handPointer}
                                          alt="pointer"
                                          className="w-[30px]"
                                        />
                                      </span>
                                    )}

                                    <span
                                      className={`h-[20px] w-[20px] rounded-full inline-block ${
                                        isActive
                                          ? "bg-green-600 blinkn"
                                          : isClicked
                                          ? "bg-orange-500"
                                          : "bg-[#ccc]"
                                      }`}
                                    ></span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="w-full mt-8">
                          <span
                            type="submit"
                            onClick={() => setTableVisible(false)}
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
                        onClick={() => handleShowSingalData("isd_file")}
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
