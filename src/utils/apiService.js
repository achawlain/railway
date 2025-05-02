import { secureClient } from "../config/axiosClient";

export const apiService = async (method, url, data = {}, params = {}) => {
  try {
    const config = {
      method,
      url,
      ...(method === "get" ? { params } : { data }),
    };

    const response = await secureClient(config);
    return response.data;
  } catch (error) {
    console.error(`${method.toUpperCase()} Error:`, error);
    throw error;
  }
};

export const DataTable = ({ columns, data, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="reportGenerateBg rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-auto relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
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
