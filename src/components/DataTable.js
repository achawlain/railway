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
      <div className="reportGenerateBg rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-auto relative">
        <button
          className="absolute top-2 right-[26px] text-gray-500 hover:text-gray-800"
          onClick={(e) => {
            onClose(e);
          }}
        >
          ✕
        </button>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="border border-gray-300 px-4 py-2 text-left bg-gray-100"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white">
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column} className="border border-gray-300 px-4 py-2">
                    {row[column]}
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

export default DataTable;
