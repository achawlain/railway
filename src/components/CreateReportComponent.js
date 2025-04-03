import React, { useState, useEffect } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import Loader from "./Loader";
import viewIcon from "../images/view-icon.svg";
import hideIcon from "../images/hide-icon.svg";
const CreateReportComponent = () => {
  const [loading, setLoading] = useState(true);
  const [templateData, setTemplateData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedStation, setSelectedStation] = useState("");
  const [selectedPSR, setSelectedPSR] = useState("");
  const [selectedTSR, setSelectedTSR] = useState("");
  const [isStationListVisible, setIsStationListVisible] = useState(false);
  const [isPSRListVisible, setIsPSRListVisible] = useState(false);
  const [isTSRListVisible, setIsTSRListVisible] = useState(false);

  useEffect(() => {
    getTemplateData();
  }, []);

  const getTemplateData = async () => {
    setLoading(true);
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.TEMPLATE
      );
      setTemplateData(response.templates);
      console.log("res", response.templates);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
    setLoading(false);
  };

  console.log("selectedTemplate", selectedTemplate);

  const handleTemplateChange = (e) => {
    console.log("eee", e.target.value);
    if (e.target.value === "add_new") {
      setSelectedTemplate("Add New");
    } else {
      const template = templateData.find((t) => t.title === e.target.value);
      setSelectedTemplate(template || null);
    }
  };
  const handleStationChage = (e) => {
    setSelectedStation(e.target.value);
    if (e.target.value === "Add New") {
      setSelectedPSR("Add New");
      setSelectedTSR("Add New");
    } else {
      setSelectedPSR("");
      setSelectedTSR("");
    }
  };

  const handlePSRchange = (e) => {
    setSelectedPSR(e.target.value);
    if (e.target.value === "Add New") {
      setSelectedTSR("Add New");
    } else {
      setSelectedTSR("");
    }
  };

  return (
    <div className="w-full bg-[#efefef] p-4 reportGenerateBg pt-8 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-2 mb-4">
        <div className="bg-white w-full p-8 pt-2 rounded-[15px] min-h-[600px]">
          <h1 className="text-[22px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
            Create Report
          </h1>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="loader">
                <Loader />
              </div>
            </div>
          ) : (
            <>
              {/* Select Template */}
              <div className="listTable w-full flex flex-row flex-wrap mb-[50px] items-center">
                <label className="font-medium mr-2 min-w-[200px]">
                  Select Template:
                </label>
                <select
                  className="border p-2 rounded-md w-auto min-w-[300px]"
                  onChange={handleTemplateChange}
                  value={
                    selectedTemplate === "Add New"
                      ? "add_new"
                      : selectedTemplate?.title || ""
                  }
                >
                  <option value="">Select a template</option>

                  {templateData.map((template) => (
                    <option key={template.id} value={template.title}>
                      {`${template.title} - ${template.date}`}
                    </option>
                  ))}
                  <option value="add_new">Add New</option>
                </select>
              </div>

              {/* Select Station */}

              {selectedTemplate !== null && (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <label className="font-medium mr-2 min-w-[200px]">
                      Select Station:
                    </label>
                    {selectedTemplate !== "Add New" && (
                      <select
                        className="border p-2 rounded-md w-auto min-w-[300px]"
                        onChange={handleStationChage}
                        value={selectedStation}
                      >
                        <option value="">Select Station</option>

                        <option value={selectedTemplate?.stations?.title}>
                          {selectedTemplate?.stations?.title}
                        </option>
                        <option value="Add New">Add New</option>
                      </select>
                    )}
                    {selectedStation !== "" &&
                      selectedStation !== "Add New" && (
                        <div className="relative ml-4">
                          <span
                            onClick={() => {
                              setIsStationListVisible(!isStationListVisible);
                            }}
                          >
                            {!isStationListVisible ? (
                              <img
                                alt="View Icon"
                                src={viewIcon}
                                className="w-[27px] ml-2 cursor-pointer"
                              />
                            ) : (
                              <img
                                alt="View Icon"
                                src={hideIcon}
                                className="w-[27px] ml-2 cursor-pointer"
                              />
                            )}
                          </span>
                          {isStationListVisible && (
                            <div className="absolute w-[150px] shadow-md p-2 rounded-sm h-40 overflow-auto  bg-white z-10">
                              <ul>
                                {selectedTemplate?.stations?.station_list?.map(
                                  (station) => (
                                    <li key={station.id} className="mb-1">
                                      {station.id} ({station.distance} km)
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                    {(selectedStation === "Add New" ||
                      selectedTemplate === "Add New") && (
                      <input
                        type="file"
                        className="border p-2 rounded-md w-[300px] ml-2"
                      />
                    )}
                  </div>

                  {/* Select PSR */}
                  {(selectedStation || selectedTemplate === "Add New") && (
                    <div className="flex items-center">
                      <label className="font-medium mr-2 min-w-[200px]">
                        Select PSR:
                      </label>
                      {selectedTemplate !== "Add New" && (
                        <select
                          className="border p-2 rounded-md w-auto min-w-[300px]"
                          onChange={handlePSRchange}
                          value={selectedPSR}
                        >
                          <option value="">Select PSR</option>

                          <option
                            value={selectedTemplate?.stations?.psr?.title}
                          >
                            {selectedTemplate?.stations?.psr?.title}
                          </option>
                          <option value="Add New">Add New</option>
                        </select>
                      )}

                      {selectedPSR !== "" && selectedPSR !== "Add New" && (
                        <div className="relative ml-4">
                          <span
                            onClick={() => {
                              setIsPSRListVisible(!isPSRListVisible);
                            }}
                          >
                            {!isPSRListVisible ? (
                              <img
                                alt="View Icon"
                                src={viewIcon}
                                className="w-[27px] ml-2 cursor-pointer"
                              />
                            ) : (
                              <img
                                alt="View Icon"
                                src={hideIcon}
                                className="w-[27px] ml-2 cursor-pointer"
                              />
                            )}
                          </span>
                          {isPSRListVisible && (
                            <div className="absolute w-[220px] shadow-md p-2 rounded-sm h-40 overflow-auto bg-white z-20">
                              <ul>
                                {selectedTemplate?.stations?.psr?.psr_list?.map(
                                  (psr) => (
                                    <li key={psr.id} className="mb-1">
                                      {psr.id}{" "}
                                      {psr.speed ? `(${psr.speed} km/h)` : ""}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {(selectedPSR === "Add New" ||
                        selectedTemplate === "Add New") && (
                        <input
                          type="file"
                          className="border p-2 rounded-md w-[300px] ml-2"
                        />
                      )}
                    </div>
                  )}

                  {/* Select TSR */}
                  {(selectedPSR || selectedTemplate === "Add New") && (
                    <div className="flex items-center">
                      <label className="font-medium mr-2 min-w-[200px]">
                        Select TSR:
                      </label>
                      {selectedTemplate !== "Add New" && (
                        <select
                          className="border p-2 rounded-md w-auto min-w-[300px]"
                          onChange={(e) => setSelectedTSR(e.target.value)}
                          value={selectedTSR}
                        >
                          <option value="">Select TSR</option>
                          <option
                            value={selectedTemplate?.stations?.tsr?.title}
                          >
                            {selectedTemplate?.stations?.tsr?.title}
                          </option>
                          <option value="Add New">Add New</option>
                        </select>
                      )}

                      {selectedTSR !== "" && selectedTSR !== "Add New" && (
                        <div className="relative ml-4">
                          <span
                            onClick={() => {
                              setIsTSRListVisible(!isTSRListVisible);
                            }}
                          >
                            {!isTSRListVisible ? (
                              <img
                                alt="View Icon"
                                src={viewIcon}
                                className="w-[27px] ml-2 cursor-pointer"
                              />
                            ) : (
                              <img
                                alt="View Icon"
                                src={hideIcon}
                                className="w-[27px] ml-2 cursor-pointer"
                              />
                            )}
                          </span>
                          {isTSRListVisible && (
                            <div className="absolute w-[220px] shadow-md p-2 rounded-sm h-40 overflow-auto bg-white">
                              <ul>
                                {selectedTemplate?.stations?.psr?.psr_list?.map(
                                  (tsr) => (
                                    <li className="mb-1" key={tsr.id}>
                                      {tsr.id}{" "}
                                      {tsr.speed ? `(${tsr.speed} km/h)` : ""}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      {(selectedTSR === "Add New" ||
                        selectedTemplate === "Add New") && (
                        <input
                          type="file"
                          className="border p-2 rounded-md w-[300px] ml-2"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateReportComponent;
