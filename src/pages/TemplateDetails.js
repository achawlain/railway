import React, { useEffect, useState } from "react";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";

export default function TemplateDetails() {
  const [allTables, setAllTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

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
      setData(
        formattedTables.find((t) => t.fileName === "isd_file")?.data || []
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleShowAllFiles();
  }, []);

  // ✅ Sort all signals by ISD (not grouped by section)
  const sortedSignals = [...data]
  // .sort((a, b) => Number(a.isd) - Number(b.isd));

  // ✅ Compute cumulative ISD (distance from start)
  let cumulative = 0;
  const processedSignals = sortedSignals.map((sig) => {
    cumulative += Number(sig.isd) || 0;
    return { ...sig, cumIsd: cumulative };
  });

  const totalDist = processedSignals[processedSignals.length - 1]?.cumIsd || 0;

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
                        className={
                          rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }
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
        <p className="text-center font-semibold p-2">
          Signal Layout Visualization (Full Track)
        </p>
      </div>

      <div className="p-4 border rounded shadow bg-white">
        <h3 className="font-bold mb-4">Full Track</h3>

        <div className="overflow-x-auto">
          <svg
            width={totalDist + 300}
            height="200"
            className="border rounded bg-gray-50"
          >
            {/* Track lines */}
            <line
              x1="80"
              y1="75"
              x2={totalDist + 200}
              y2="75"
              stroke="#555"
              strokeWidth="3"
            />
            <line
              x1="80"
              y1="85"
              x2={totalDist + 200}
              y2="85"
              stroke="#555"
              strokeWidth="3"
            />

            {/* Sleepers */}
            {Array.from({
              length: Math.floor((totalDist + 120) / 20),
            }).map((_, i) => {
              const x = 80 + i * 20;
              return (
                <line
                  key={i}
                  x1={x}
                  y1="70"
                  x2={x}
                  y2="90"
                  stroke="#888"
                  strokeWidth="2"
                />
              );
            })}

            {/* Grid lines every 200m */}
            {Array.from({ length: Math.ceil(totalDist / 200) }).map((_, i) => {
              const x = 80 + i * 200;
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1="40"
                    x2={x}
                    y2="140"
                    stroke="#ccc"
                    strokeDasharray="4"
                  />
                  <text
                    x={x}
                    y="160"
                    fontSize="11"
                    textAnchor="middle"
                    fill="darkgray"
                  >
                    {i * 200}m
                  </text>
                </g>
              );
            })}

            {/* Signals */}
            {processedSignals.map((sig, idx) => {
              const x = 80 + sig.cumIsd;
              const y = 80;
              return (
                <g key={idx} className="group relative cursor-pointer">
                  {/* Signal circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="red"
                    stroke="black"
                    strokeWidth="1"
                  />
                  {/* Hover indicator (move up) */}
                  <circle
                    cx={x}
                    cy={y - 20}
                    r="8"
                    fill="yellow"
                    stroke="black"
                    strokeWidth="1"
                    className="transition-opacity duration-300"
                  />
                  <circle
                    cx={x}
                    cy={y - 40}
                    r="8"
                    fill="green"
                    stroke="black"
                    strokeWidth="1"
                    className="transition-opacity duration-300"
                  />

                  {/* Signal name */}
                  <text
                    x={x}
                    y={y - 55}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#222"
                  >
                    {sig.signal}
                  </text>

                  {/* Distance from previous */}
                  {idx > 0 && (
                    <text
                      x={(x + (80 + processedSignals[idx - 1].cumIsd)) / 2}
                      y={y + 25}
                      textAnchor="middle"
                      fontSize="13"
                      fill="gray"
                    >
                      {(
                        sig.cumIsd - processedSignals[idx - 1].cumIsd
                      ).toFixed(2)}{" "}
                      m
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </>
  );
}
