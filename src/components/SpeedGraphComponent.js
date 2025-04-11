import React, { useEffect, useState } from "react";
import speedGraph from "../../src/images/sppdGraph.png";
import brakingProfile from "../../src/images/brakingProfile.png";
import speedVsTimeChart from "../../src/images/speedVsTimeChart.png";
import ChartComponent from "./ChartComponent";
import { secureClient } from "../config/axiosClient";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";
import Loader from "./Loader";
import { useLocation, useParams } from "react-router-dom";

const SpeedGraphComponent = ({ speed_before_1000m, haltStation }) => {
  const [chartSpeedTimeData, setChartSpeedTimeData] = useState(null);
  const [chartSpeedBeforHaltData, setChartSpeedBeforHaltData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    fetchData(!!haltStation?.from && !!haltStation?.to);
  }, [haltStation]);

  const fetchData = async (limitedHaltStation) => {
    setLoading(true);
    await getChartSpeedTimeData(limitedHaltStation);
    await getChartSpeedBeforeHaltData(limitedHaltStation);
    setLoading(false);
  };

  const getChartSpeedTimeData = async (limitedHaltStation) => {
    const url =
      limitedHaltStation && haltStation?.from && haltStation?.to
        ? `${RAILWAY_CONST.API_ENDPOINT.CHART_SPEED_TIME}?id=${id}&from_station=${haltStation.from}&to_station=${haltStation.to}`
        : `${RAILWAY_CONST.API_ENDPOINT.CHART_SPEED_TIME}?id=${id}`;
    console.log("url", url);
    try {
      const response = await apiService("get", url);
      console.log("haltlimited----------", JSON.parse(response));
      setChartSpeedTimeData(JSON.parse(response));
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const getChartSpeedBeforeHaltData = async (limitedHaltStation) => {
    if (!speed_before_1000m) {
      console.warn("No  API call.");
      return;
    }

    const url =
      limitedHaltStation && haltStation?.from && haltStation?.to
        ? `${RAILWAY_CONST.API_ENDPOINT.SPEED_BEFORE_HALT}?id=${id}&from_station=${haltStation.from}&to_station=${haltStation.to}`
        : `${RAILWAY_CONST.API_ENDPOINT.SPEED_BEFORE_HALT}?id=${id}`;

    try {
      const response = await apiService("get", url);
      console.log(
        "response-------getChartSpeedBeforeHaltData",
        JSON.parse(response)
      );
      setChartSpeedBeforHaltData(JSON.parse(response));
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  return (
    <>
      <div className="bg-white p-8">
        {loading ? (
          <div className="componentLoader">
            <Loader />
          </div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            {speed_before_1000m ? (
              <ChartComponent
                loading={loading}
                chartData={chartSpeedBeforHaltData}
              />
            ) : null}
          </div>
        )}
        <h3 className="text-center text-xl font-bold mb-4 mt-2">
          Speed Vs Time Chart
        </h3>
        {loading ? (
          <div className="componentLoader">
            <Loader />
          </div>
        ) : (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <ChartComponent loading={loading} chartData={chartSpeedTimeData} />
          </div>
        )}
      </div>
    </>
  );
};

export default SpeedGraphComponent;
