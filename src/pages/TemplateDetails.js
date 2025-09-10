import React, { useEffect, useState } from "react";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";

export default function TemplateDetails() {
  const [allTables, setAllTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);


  //   if (!data || data.length === 0) return <p>No data available</p>;

  // Group by section (so we can render one track per section)
  console.log(data, "data");
  const sections = data.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  console.log(sections, "sections");

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
      console.log(formattedTables, "formattedTables");
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
          // signals.sort((a, b) => a.isd - b.isd);

          // Total distance = last signal ISD
          let cumulative = 0;
          const processedSignals = signals.map((sig) => {
            cumulative += Number(sig.isd) || 0;
            return { ...sig, cumIsd: cumulative };
          });

          const totalDist = processedSignals[processedSignals.length - 1]?.cumIsd || 0;
          return (
            <div key={section} className="p-4 border rounded shadow bg-white">
              <h3 className="font-bold mb-4">{section}</h3>

              <div className="overflow-x-auto">
                <svg
                  width={totalDist + 300} // width based on distance
                  height="160"
                  className="border rounded bg-gray-50"
                >
                  {/* Track line */}
                  <line
                    x1="80"
                    y1="80"
                    x2={totalDist + 200}
                    y2="80"
                    stroke="#444"
                    strokeWidth="5"
                  />

                  {/* Vertical grid lines every 200m */}
                  {Array.from({ length: Math.ceil(totalDist / 200) }).map((_, i) => {
                    const x = 80 + i * 200;
                    return (
                      <g key={i}>
                        <line
                          x1={x}
                          y1="40"
                          x2={x}
                          y2="120"
                          stroke="#ccc"
                          strokeDasharray="4"
                        />
                        <text
                          x={x}
                          y="135"
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
                        {/* Main red signal circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill="red"
                          stroke="black"
                          strokeWidth="1"
                          className="transition-transform duration-200"
                        />

                        {/* Yellow circle (above red) */}
                        <circle
                          cx={x}
                          cy={y - 20}
                          r="8"
                          fill="yellow"
                          stroke="black"
                          strokeWidth="1"
                          // className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />

                        {/* Green circle (above yellow) */}
                        <circle
                          cx={x}
                          cy={y - 40}
                          r="8"
                          fill="green"
                          stroke="black"
                          strokeWidth="1"
                          // className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />

                        {/* Label above */}
                        <text
                          x={x}
                          y={y - 55}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#222"
                        >
                          {sig.signal}
                        </text>

                        {/* Distance label */}
                        {idx > 0 && (
                          <text
                            x={(x + (80 + processedSignals[idx - 1].cumIsd)) / 2}
                            y={y + 25}
                            textAnchor="middle"
                            fontSize="13"
                            fill="gray"
                          >
                            {(sig.cumIsd - processedSignals[idx - 1].cumIsd).toFixed(2)} m
                          </text>
                        )}
                      </g>

                    );
                  })}

                  {/* Station markers */}
                  {/* Start Station */}
                  <g>
                    <rect
                      x={60}
                      y={65}
                      width="20"
                      height="30"
                      fill="#2563eb"
                      stroke="black"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={70}
                      y={115}
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#2563eb"
                    >
                      {section.split("-")[0]}
                    </text>
                  </g>

                  {/* End Station */}
                  <g>
                    <rect
                      x={totalDist + 180}
                      y={65}
                      width="20"
                      height="30"
                      fill="#16a34a"
                      stroke="black"
                      strokeWidth="1"
                      rx="4"
                    />
                    <text
                      x={totalDist + 190}
                      y={115}
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#16a34a"
                    >
                      {section.split("-")[1]}
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          );
        })}
      </div>


    </>
  );
}
