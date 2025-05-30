import React from "react";

  const transformData = (rawData) => {
  return Object.entries(rawData).reduce((acc, [key, value]) => {
    if (key.endsWith('_time')) {
      const baseKey = key.replace('_time', '');
      if (rawData[baseKey] !== undefined) {
        acc[baseKey] = `${rawData[baseKey]} | ${value}`;
      }
    } else if (!key.includes('_time')) {
      acc[key] = value; // Include fields that don't have `_time`
    }
    return acc;
  }, {});
};

const TableComponent = ({ colums = [], data = [], tableTitle }) => {
  const transformedData = (data || []).map(transformData);

  return (
    <div className="overflow-x-auto bg-white pb-8 mt-4">
      <h3 className="text-center text-xl font-bold mb-8 mt-2">{tableTitle}</h3>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {colums &&
              colums.map((col, index) => (
                <th key={index} className="border border-gray-300 p-2">
                  {col.label}
                </th>
              ))}
          </tr>
        </thead>

        <tbody>
          {transformedData.map((item, rowIndex) => (
            <tr key={rowIndex} className="text-center">
              {colums.map((col, colIndex) => (
                <td key={colIndex} className="border border-gray-300 p-2">
                  {item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
