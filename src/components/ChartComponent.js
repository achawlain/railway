import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Loader from "./Loader";

const ChartComponent = ({ chartData }) => {
  const [chartInfo, setChartInfo] = useState(null);

  useEffect(() => {
    setChartInfo(chartData);
    if (window.innerWidth < 600) {
      let chartWidth = chartData;
      if (chartData && chartData.layout) {
        chartData.layout.width = "100%";
        chartData.layout.height = "auto";
      }
      setChartInfo(chartWidth);
    }
  }, [chartData]);

  if (!chartData) {
    return (
      <div>
        {/* <div className="componentLoader">
          <Loader />
        </div> */}
      </div>
    );
  }
 
  return (
    <Plot
      data={chartData.data}
      layout={chartData.layout}
      config={{
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["zoomIn2d", "zoomOut2d", "resetScale2d"],
      }}
    />
  );
};

export default ChartComponent;
