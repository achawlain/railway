import React from "react";

const TableComponent = ({ colums, data, tableTitle }) => {
  return (
    <div className="overflow-x-auto bg-white pb-8 mt-4">
      <h3 className="text-center text-xl font-bold mb-8 mt-2">{tableTitle}</h3>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {colums.map((name, index) => (
              <th key={index} className="border border-gray-300 p-2">
                {name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center">
              {Object.values(item).map((key, i) => (
                <td key={i} className="border border-gray-300 p-2">
                  {key}
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
