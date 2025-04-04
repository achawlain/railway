import React from "react";
import Plot from "react-plotly.js";
import Loader from "./Loader";

const ChartComponent = ({ chartData }) => {
  if (!chartData) {
    return (
      <div>
        <div className="componentLoader">
          <Loader />
        </div>
      </div>
    );
  }

  return <Plot data={chartData.data} layout={chartData.layout} />;
};

export default ChartComponent;
