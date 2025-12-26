import React from "react";

const DailySummary = () => {
  // Placeholder data for the table
  const placeholderData = [
    {
      id: 1,
      date: "2024-01-15",
      trainNumber: "12345",
      route: "Route A",
      status: "Completed",
      totalTrips: "10",
      onTimeTrips: "8",
      delayedTrips: "2",
    },
    {
      id: 2,
      date: "2024-01-15",
      trainNumber: "12346",
      route: "Route B",
      status: "Completed",
      totalTrips: "12",
      onTimeTrips: "11",
      delayedTrips: "1",
    },
    {
      id: 3,
      date: "2024-01-15",
      trainNumber: "12347",
      route: "Route C",
      status: "In Progress",
      totalTrips: "5",
      onTimeTrips: "4",
      delayedTrips: "1",
    },
  ];

  const columns = [
    { key: "id", label: "ID" },
    { key: "date", label: "Date" },
    { key: "trainNumber", label: "Train Number" },
    { key: "route", label: "Route" },
    { key: "status", label: "Status" },
    { key: "totalTrips", label: "Total Trips" },
    { key: "onTimeTrips", label: "On Time Trips" },
    { key: "delayedTrips", label: "Delayed Trips" },
  ];

  return (
    <div className="p-6">
      <div className="overflow-x-auto bg-white pb-8 mt-4">
        <h3 className="text-center text-xl font-bold mb-8 mt-2">
          Daily Summary [Test Data - Work in progress]
        </h3>
        <div className="popUpRow w-full">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                {columns.map((col, index) => (
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
              {placeholderData.map((item, rowIndex) => (
                <tr key={rowIndex} className="text-center">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 p-2 text-[13px] text-[#4B5563]"
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
    </div>
  );
};

export default DailySummary;

