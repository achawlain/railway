import React, { useState, useEffect, useRef } from "react";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";
import { format, subDays } from "date-fns";
import { DateRange } from "react-date-range";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import "primereact/resources/themes/lara-light-cyan/theme.css";
// import LocoPilotReportTable from "./LocoPilotReportTable";

export default function LocoPilotReportTable() {
  const [loading, setLoading] = useState(false);
  const [reportTableData, setReportTableData] = useState([]); // DataTable state
  const [range, setRange] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const getreportDataTable = async (start_date, end_date) => {
    const url = `${RAILWAY_CONST.API_ENDPOINT.MANAGEMENT_lP_SUMMARY}?start_date=${start_date}&end_date=${end_date}`;
    try {
      const response = await apiService("get", url);
      setReportTableData(response.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    // Initial fetch for default date range
    const formattedStartDate = format(range[0].startDate, "yyyy-MM-dd");
    const formattedEndDate = format(range[0].endDate, "yyyy-MM-dd");
    getreportDataTable(formattedStartDate, formattedEndDate);
  }, []);

  const handleSelect = (item) => {
    setRange([item.selection]);
    const formattedStartDate = format(item.selection.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(item.selection.endDate, "yyyy-MM-dd");

    // getChartReportData(formattedStartDate, formattedEndDate);
    if (
      formattedStartDate &&
      formattedEndDate &&
      formattedStartDate !== formattedEndDate
    ) {
      setRange([item.selection]);
      getreportDataTable(formattedStartDate, formattedEndDate);
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

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
      <div className="bg-white w-full sm:p-8 p-4 pt-4 rounded-[15px] min-h-[900px] mt-8">
        <div style={{ overflowX: "auto", width: "100%", marginTop: "20px" }}>
          <h1 className="text-[22px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
            Loco Pilot Report
          </h1>
          <div className="relative flex flow-row datePickerCol">
            <label className="text-[16px] inline-block min-w-[80px] pr-3 mb-2 sm:mb-0">
              Date Range :
            </label>
            <input
              readOnly
              value={`${format(range[0].startDate, "dd/MM/yyyy")} - ${format(
                range[0].endDate,
                "dd/MM/yyyy"
              )}`}
              onClick={() => setOpen(!open)}
              className="border px-1 py-2 rounded-md w-[250px] cursor-pointer inputbox pl-2 -mt-1"
            />
            {open && (
              <div
                ref={ref}
                className="absolute z-10 mt-[44px] shadow-lg border bg-white"
              >
                <DateRange
                  editableDateInputs
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                  months={2}
                  direction="horizontal"
                />
              </div>
            )}

            <div className="pl-8 -mt-1 searchCol">
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Search for any field"
                className="w-56 h-10 -mb-1 inline-block border border-gray-300 rounded-md pl-2 globleFilter"
                style={{ marginLeft: "auto" }}
              />
            </div>
          </div>
          {/* <div className="flex justify-between items-center mb-4">
                        <div></div> 
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Search for any field"
                            className="w-56 h-12 inline-block border border-gray-300 rounded-md pl-2 globleFilter"
                            style={{ marginLeft: "auto", }}
                        />
                    </div> */}
          <DataTable
            value={reportTableData}
            paginator
            rows={10}
            stripedRows
            sortMode="multiple"
            dataKey={reportTableData.id}
            filters={filters}
            filterDisplay="row"
            loading={loading}
            emptyMessage="No data found"
            globalFilterFields={["crew_name", "lp_cms_id"]}
            className="mt-10"
          >
            <Column field="lp_cms_id" header="LP CMS ID" sortable />
            <Column field="crew_name" header="Crew Name" sortable />
            <Column field="psr_err_count" header="PSR Violation" sortable />
            <Column field="tsr_err_count" header="TSR Violation" sortable />
            <Column
              field="attacking_speed_violation_count"
              header="Attacking Speed Violation"
              sortable
            />

            {/* Add more columns based on your data */}
          </DataTable>
        </div>
      </div>
    </>
  );
}
