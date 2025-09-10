import { useEffect } from "react";

const DataTable = ({ columns, data, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose(event);
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]); // Dependency array ensures effect runs when onClose changes

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className=" rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-auto relative ">
        <div className="bg-white shadow-lg w-full max-h-[80vh] overflow-auto relative rounded-[10px] p-[10px]">
          <button
            className="absolute sm:top-[20px] top-[3px] leading-[12px] right-[26px] text-gray-500 hover:text-gray-800 z-20 bg-gray-100 w-[20px] h-[20px] rounded-sm"
            onClick={(e) => {
              onClose(e);
            }}
          >
            ✕
          </button>
          <div className="w-full max-h-[70vh] overflow-y-auto">
            <table className="table-auto w-full responsiveTable text-[#4B5563] popUpRow">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th
                   className="border-r border-r-[#752f6b] px-4 py-3 text-left text-[14px] font-normal bg-[#9b4b90] text-white"

                  >Id</th>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="border-r border-r-[#752f6b] px-4 py-3 text-left text-[14px] font-normal bg-[#9b4b90] text-white"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-white">

                {data.map((row, index) => (
                  <tr
                    key={index}
                    className="block sm:table-row border-b sm:border-0 mb-4 sm:mb-0"
                  >
                    <td className="block sm:table-cell border border-gray-300 px-4 py-2 relative sm:static text-[#4B5563] text-[13px]" data-label="Id">
                      {index + 1}
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="block sm:table-cell border border-gray-300 px-4 py-2 relative sm:static text-[#4B5563] text-[13px]"
                        data-label={column}
                      >
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
