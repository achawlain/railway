import React, { useEffect, useState } from "react";
import speedGraph from "../../src/images/sppdGraph.png";
import brakingProfile from "../../src/images/brakingProfile.png";
import speedVsTimeChart from "../../src/images/speedVsTimeChart.png";
import ChartComponent from "./ChartComponent";
import { secureClient } from "../config/axiosClient";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";
const SpeedGraphComponent = ({ haltStation }) => {
  const [chartSpeedTimeData, setChartSpeedTimeData] = useState(null);
  const [chartSpeedBeforHaltData, setChartSpeedBeforHaltData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await getChartSpeedTimeData(false);
      await getChartSpeedBeforeHaltData();
    };
    fetchData();
  }, []);

  useEffect(() => {
    getChartSpeedTimeData(true);
  }, [haltStation]);

  const getChartSpeedTimeData = async (limitedHaltStation) => {
    const url =
      limitedHaltStation && haltStation && haltStation.from && haltStation.to
        ? `${RAILWAY_CONST.API_ENDPOINT.CHART_SPEED_TIME}?from_station=${haltStation.from}&to_station=${haltStation.to}`
        : RAILWAY_CONST.API_ENDPOINT.CHART_SPEED_TIME;
    try {
      const response = await apiService("get", url);
      console.log("haltlimited----------", JSON.parse(response));
      setChartSpeedTimeData(JSON.parse(response)); // No need for JSON.parse if data is already JSON
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const getChartSpeedBeforeHaltData = async () => {
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.SPEED_BEFORE_HALT
      );
      console.log(
        "response-------getChartSpeedBeforeHaltData",
        JSON.parse(response)
      );
      setChartSpeedBeforHaltData(JSON.parse(response)); // No need for JSON.parse if data is already JSON
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  return (
    <div className="bg-white p-8">
      <h3 className="text-center text-xl font-bold mb-4 mt-2">
        Speed From 1000 m in rear of halts
      </h3>
      <div>
        <ChartComponent chartData={chartSpeedTimeData} />
      </div>
      <h3 className="text-center text-xl font-bold mb-4 mt-8">
        Braking Profile Of Shambhu Prasad
      </h3>
      <div>
        <img
          className="h-auto w-full mt-[5px]"
          src={brakingProfile}
          alt="Logo"
        />
      </div>
      <h3 className="text-center text-xl font-bold mb-4 mt-8">
        Speed Vs Time Chart
      </h3>
      <div>
        <ChartComponent chartData={chartSpeedBeforHaltData} />
      </div>
    </div>
  );
};

export default SpeedGraphComponent;
