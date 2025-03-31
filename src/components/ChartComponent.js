import React from "react";
import Plot from "react-plotly.js";

const ChartComponent = ({ chartData }) => {
  if (!chartData) {
    return <p>Loading...</p>;
  }

  return <Plot data={chartData.data} layout={chartData.layout} />;
};

export default ChartComponent;
