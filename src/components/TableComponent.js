import React from "react";

const TableComponent = ({ colums = [], data = [], tableTitle }) => {
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
          {data &&
            data.map((item, rowIndex) => (
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
