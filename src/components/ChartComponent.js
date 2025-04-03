import React from "react";
import Plot from "react-plotly.js";
import Loader from "./Loader";

const ChartComponent = ({ chartData }) => {
  if (!chartData) {
    return (
      <p>
        <div className="componentLoader">
          <Loader />
        </div>
      </p>
    );
  }

  return <Plot data={chartData.data} layout={chartData.layout} />;
};

export default ChartComponent;
