import React from "react";

const transformData = (rawData) => {
  return Object.entries(rawData).reduce((acc, [key, value]) => {
    if (key.endsWith("_time")) {
      const baseKey = key.replace("_time", "");
      if (rawData[baseKey] !== undefined) {
        acc[baseKey] = (
          <span>
            <span>{rawData[baseKey]}</span>
            {"  "}
            <br />
            <span
              style={{
                color: "gray", // Color for `value`
                fontStyle: "italic", // Example design for `value`
                fontSize: "13px", // Smaller font size for `value`
              }}
            >
              {value}
            </span>
          </span>
        );
      }
    } else if (key === "halt_name" && rawData["halt_distance"] !== undefined) {
      acc[key] = (
        <span>
          <span>{value}</span>
          {"  "}
          <br />
          <span
            style={{
              color: "gray",
              fontStyle: "italic",
              fontSize: "13px",
            }}
          >
            {rawData["halt_distance"]}
          </span>
        </span>
      );
    } else if (key === "lp_cms_name" && rawData["lp_cms_id"] !== undefined) {
      acc[key] = (
        <span>
          <span>{value}</span>
          {"  "}
          <br />
          <span
            style={{
              color: "gray",
              fontStyle: "italic",
              fontSize: "13px",
            }}
          >
            {rawData["lp_cms_id"]}
          </span>
        </span>
      ) 
    } 
     else if (!key.includes("_time")) {
      acc[key] = rawData[key]; // Include fields that don't have `_time`
    }
    return acc;
  }, {});
};

const TableComponent = ({ colums = [], data = [], tableTitle }) => {
  const transformedData = (data || []).map(transformData);

  return (
    <div className="overflow-x-auto bg-white pb-8 mt-4">
      <h3 className="text-center text-xl font-bold mb-8 mt-2">{tableTitle}</h3>
      <div className="popUpRow w-full">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              {colums &&
                colums.map((col, index) => (
                  <th
                    key={index}
                    className="border-r border-r-[#752f6b] px-4 py-4 text-[14px] font-normal bg-[#9b4b90] text-white text-center"
                  >
                    {col.label}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {transformedData.map((item, rowIndex) => (
              <tr key={rowIndex} className="text-center">
                {colums.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 p-2 text-[13px]"
                  >
                    {item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
