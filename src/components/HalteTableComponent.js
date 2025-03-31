import React from "react";

const HaltDetailTableComponent = () => {
  const data = [
    {
      haltNo: "1",
      haltTime: "10:30 AM",
      m1000: "13",
      m500: "17",
      m400: "18",
      m300: "16",
      m200: "12",
      m100: "11",
      halt: "0",
      profile: "Abrupt",
    },
    {
      haltNo: "2",
      haltTime: "12:30 AM",
      m1000: "13",
      m500: "17",
      m400: "18",
      m300: "16",
      m200: "12",
      m100: "11",
      halt: "0",
      profile: "Abrupt",
    },
    {
      haltNo: "3",
      haltTime: "12:30 AM",
      m1000: "13",
      m500: "17",
      m400: "18",
      m300: "16",
      m200: "12",
      m100: "11",
      halt: "0",
      profile: "Smooth",
    },
  ];

  return (
    <div className="overflow-x-auto bg-white pb-8 mt-16">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Halt No.</th>
            <th className="border border-gray-300 p-2">Halt Time</th>
            <th className="border border-gray-300 p-2">1000m</th>
            <th className="border border-gray-300 p-2">500m</th>
            <th className="border border-gray-300 p-2">400m</th>
            <th className="border border-gray-300 p-2">300m</th>
            <th className="border border-gray-300 p-2">200m</th>
            <th className="border border-gray-300 p-2">100m</th>
            <th className="border border-gray-300 p-2">Halt</th>
            <th className="border border-gray-300 p-2">Profile</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-300 p-2">{row.haltNo}</td>
              <td className="border border-gray-300 p-2">{row.haltTime}</td>
              <td className="border border-gray-300 p-2">{row.m1000}</td>
              <td className="border border-gray-300 p-2">{row.m500}</td>
              <td className="border border-gray-300 p-2">{row.m400}</td>
              <td className="border border-gray-300 p-2">{row.m300}</td>
              <td className="border border-gray-300 p-2">{row.m200}</td>
              <td className="border border-gray-300 p-2">{row.m100}</td>
              <td className="border border-gray-300 p-2">{row.halt}</td>
              <td className="border border-gray-300 p-2">{row.profile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HaltDetailTableComponent;
