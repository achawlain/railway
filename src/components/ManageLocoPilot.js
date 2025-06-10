import React, { useState, useEffect } from "react";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
// import 'primeicons/primeicons.css';



const ManageLocoPilot = () => {
  const [loading, setLoading] = useState(false);
  const [locoPilotDetails, setLocoPilotDetails] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const getLocoPilotDetails = async () => {
    try {
      const response = await apiService(
        "get",
        `${RAILWAY_CONST.API_ENDPOINT.CREW}`
      );
      console.log("Loco Pilot Details:", response.data);
      setLocoPilotDetails(response.data);

    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    // Initial fetch for default date range
    getLocoPilotDetails();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      global: { value, matchMode: "contains" },
    });
    setGlobalFilterValue(value);
  };

  
  return (
    <>
      <div className="w-full bg-[#efefef] p-4  pt-8 min-h-screen">
        <div className="bg-white w-full sm:p-8 p-4 pt-4 rounded-[15px] min-h-[900px]">
          <h1 className="sm:text-[22px] text-[18px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
            Manage Loco Pilot
          </h1>
          {/* <div className="w-full p-4 pt-4 flex justify-end items-center">
            <button className="bg-[#2c215d] text-white px-4 py-2 rounded-md">
              Bulk Upload
            </button>
          </div> */}
          <div className="relative flex flow-row datePickerCol">
            <div className="-mt-1 searchCol">
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Search for any field"
                className="w-56 h-10 -mb-1 inline-block border border-gray-300 rounded-md pl-2 globleFilter"
                style={{ marginLeft: "auto" }}
              />
            </div>
          </div>

          <DataTable
            value={locoPilotDetails}
            paginator
            rows={10}
            stripedRows
            sortMode="multiple"
            dataKey="id" // Ensure this matches your dataset's key
            filters={filters}
            filterDisplay="row"
            loading={loading}
            emptyMessage="No data found"
            globalFilterFields={["name", "cms_id", "designation", "emp_id", "mobile",'email', 'nli']}
            className="mt-10"
            
          >
            <Column field="cms_id" header="LP CMS ID" sortable />
            <Column field="name" header="LP Name"  sortable />
            <Column field="designation" header="Designation"  sortable />
            <Column field="email" header="Email"  sortable />
            <Column field="emp_id" header="Employee ID"  sortable />
            {/* <Column field="id" header="ID" sortable /> */}
            <Column field="mobile" header="Mobile"  sortable />
            <Column field="nli" header="Nomilated CLI"  sortable />
            {/* <Column field="org_id" header="Organization ID" sortable /> */}

            {/* Add or remove columns as needed */}
          </DataTable>
        </div>
      </div>

    </>
  );
};

export default ManageLocoPilot;
