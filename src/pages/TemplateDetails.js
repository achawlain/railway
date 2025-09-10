import React, { useEffect, useState } from "react";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";

export default function TemplateDetails() {
  const [allTables, setAllTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);


//   if (!data || data.length === 0) return <p>No data available</p>;

  // Group by section (so we can render one track per section)

  console.log("allTables", allTables);
  const sections = data.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const handleShowAllFiles = async () => {
    setIsLoading(true);

    const files = [
      "attacking_speed_file",
      "gradient_file",
      "isd_file",
      "psr_file",
      "station_file",
    ];

    try {
      const responses = await Promise.all(
        files.map((file) =>
          apiService(
            "get",
            RAILWAY_CONST.API_ENDPOINT.METADATA,
            {},
            { template_id: window.location.pathname.split("/").pop(), data_src: file }
            // { template_id: "40", data_src: file }
          ).then((res) => ({
            fileName: file,
            data: res?.data || [],
          }))
        )
      );

      const formattedTables = responses.map((res) => {
        if ("message" in res.data) {
          return {
            fileName: res.fileName,
            columns: [],
            data: [],
            error: res.data.message,
          };
        } else {
          return {
            fileName: res.fileName,
            columns: Object.keys(res.data[0] || {}),
            data: res.data,
            error: null,
          };
        }
      });

      setAllTables(formattedTables);
      console.log(formattedTables,"formattedTables");
        setData(formattedTables.find(t => t.fileName === 'isd_file')?.data || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleShowAllFiles();
  }, []);

  return (
    <>
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Template Details</h2>

      {isLoading && <p className="text-gray-600">Loading tables...</p>}

      {allTables.map((table, index) => (
        <details
          key={index}
          className="border rounded-lg shadow bg-white"
          open={index === 0} // open first by default
        >
          <summary className="cursor-pointer select-none flex justify-between items-center px-4 py-3 reportGenerateBg text-white rounded-t-lg">
            <span className="font-semibold">
              📑 {table.fileName.replace("_file", "").toUpperCase()}
            </span>
            <span className="text-sm text-gray-200">
              {table.data.length} rows
            </span>
          </summary>

          <div className="p-4 overflow-x-auto max-h-[70vh]">
            {table.error ? (
              <p className="text-red-500">{table.error}</p>
            ) : (
              <table className="table-auto w-full text-sm text-gray-700 border">
                <thead className="sticky top-0 bg-[#9b4b90] text-white">
                  <tr>
                    <th className="px-4 py-2 border">Id</th>
                    {table.columns.map((column) => (
                      <th key={column} className="px-4 py-2 border">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.data.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2 border">{rowIndex + 1}</td>
                      {table.columns.map((column) => (
                        <td key={column} className="px-4 py-2 border">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </details>
      ))}
    </div>


    <div className="h-1 bg-gray-300 my-8">
        <hr />
        <p className="text-center font-semibold p-2">Signal Layout Visualization</p>
    </div>

    <div className="space-y-10">
      {Object.entries(sections).map(([section, signals]) => {
        // Sort signals by ISD (distance)
        signals.sort((a, b) => a.isd - b.isd);

        // Total distance = last signal ISD
        const totalDist = signals[signals.length - 1]?.isd || 0;

        return (
          <div key={section} className="p-4 border rounded shadow bg-white">
            <h3 className="font-bold mb-4">{section}</h3>

            <svg
              width="100%"
              height="120"
              viewBox={`0 0 ${totalDist + 200} 120`}
              className="border rounded bg-gray-50"
            >
              {/* Track line */}
              <line
                x1="50"
                y1="60"
                x2={totalDist + 150}
                y2="60"
                stroke="#333"
                strokeWidth="4"
              />

              {/* Signals */}
              {signals.map((sig, idx) => {
                const x = 50 + sig.isd; // place by distance
                const y = 60;

                return (
                  <g key={idx}>
                    {/* Signal post */}
                    <circle cx={x} cy={y} r="6" fill="red" />
                    {/* Label */}
                    <text
                      x={x}
                      y={y - 15}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#111"
                    >
                      {sig.signal}
                    </text>
                    {/* Distance label */}
                    {idx > 0 && (
                      <text
                        x={(x + (50 + signals[idx - 1].isd)) / 2}
                        y={y + 25}
                        textAnchor="middle"
                        fontSize="11"
                        fill="gray"
                      >
                        {(
                          sig.isd - signals[idx - 1].isd
                        ).toFixed(2)}{" "}
                        m
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Stations: first and last signal treated as station */}
              <text x={40} y={100} fontSize="14" fontWeight="bold" fill="#4B5563">
                {signals[0].signal.split(" ")[0]}
              </text>
              <text
                x={totalDist + 140}
                y={100}
                fontSize="14"
                fontWeight="bold"
                textAnchor="end"
                fill="#4B5563"
              >
                {/* {signals[signals.length - 1].signal.split(" ")[0]} */}
                {section.split("-")[1]}
              </text>
            </svg>
          </div>
        );
      })}
    </div>
    </>
  );
}
