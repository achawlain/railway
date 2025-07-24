import React, { useState, useEffect, useRef } from "react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-date-range";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { apiService } from "../utils/apiService";
import Loader from "./Loader"; // Optional: Use if needed
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import RAILWAY_CONST from "../utils/RailwayConst";
import { Toast } from "primereact/toast";

export default function BreakingPattern() {
  const toastRef = useRef(null);

  const ref = useRef();
  const [formData, setFormData] = useState({
    station: "",
    distance: "",
    speed: "",
  });
  const [range, setRange] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [breakingPatternReport, setBreakingPatternReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleSumbit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedStartDate = format(range[0].startDate, "yyyy-MM-dd");
    const formattedEndDate = format(range[0].endDate, "yyyy-MM-dd");

    const data = {
      station: formData.station,
      distance: formData.distance,
      speed: formData.speed,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    try {
      const response = await apiService(
        "POST",
        RAILWAY_CONST.API_ENDPOINT.BREAKING_PATTERN,
        data
      );

      if (response.status === 200) {
        setBreakingPatternReport(response.data);
      } else {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail:
            response?.message || "Failed to fetch breaking pattern report",
          life: 3000,
        });
      }
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch breaking pattern report",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    setRange([item.selection]);
    const formattedStartDate = format(item.selection.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(item.selection.endDate, "yyyy-MM-dd");

    if (
      formattedStartDate &&
      formattedEndDate &&
      formattedStartDate !== formattedEndDate
    ) {
      setRange([item.selection]);
      setOpen(false);
    }
  };

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
      <Toast ref={toastRef} position="top-right" />
      <div className="w-full bg-[#efefef]  min-h-screen">
        <div className="bg-white w-full sm:p-8 p-4 pt-4 rounded-[15px] min-h-[900px] sm:pt-4">
          <h1 className="sm:text-[18px] flex-row flex justify-between text-[18px] rounded-[5px] bg-[#2A235A] text-white font-medium mb-4 border-b border-[#ccc] relative px-3 py-3">
            Breaking Pattern
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-between flex-wrap">
            <div className="relative flex flex-col gap-2 datePickerCol mb-9">
              <label className="text-[16px]">Date Range:</label>
              <input
                readOnly
                value={`${format(range[0].startDate, "dd/MM/yyyy")} - ${format(
                  range[0].endDate,
                  "dd/MM/yyyy"
                )}`}
                onClick={() => setOpen(!open)}
                className="border px-1 py-2 rounded-md w-[250px] cursor-pointer inputbox pl-2"
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
                    direction={
                      window.innerWidth > 600 ? "horizontal" : "vertical"
                    }
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px]">Station:</label>
              <input
                type="text"
                value={formData.station}
                onChange={(e) =>
                  setFormData({ ...formData, station: e.target.value })
                }
                className="border px-1 py-2 rounded-md w-[250px]"
                placeholder="Enter Station Name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px]">Distance:</label>
              <input
                type="number"
                value={formData.distance}
                onChange={(e) =>
                  setFormData({ ...formData, distance: e.target.value })
                }
                className="border px-1 py-2 rounded-md w-[250px]"
                placeholder="Enter Distance"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[16px]">Speed:</label>
              <input
                type="number"
                value={formData.speed}
                onChange={(e) =>
                  setFormData({ ...formData, speed: e.target.value })
                }
                className="border px-1 py-2 rounded-md w-[250px]"
                placeholder="Enter Speed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="bg-[#2c215d] text-white px-4 py-2 rounded-md transition-colors mt-[32px]"
                onClick={handleSumbit}
              >
                Submit
              </button>
            </div>
          </div>
          {breakingPatternReport && breakingPatternReport.length > 0 ? (
            <>
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="loader">
                    <Loader />
                  </div>
                </div>
              ) : null}

              <h4 className="text-lg font-semibold mt-8 mb-4 text-center text-[#30424c]">
                Breaking Pattern at {formData.station.toUpperCase()} Station
              </h4>
              <div className="-mt-1 searchCol">
                <InputText
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Search for any field"
                  className="w-56 h-10 border border-gray-300 rounded-md pl-2"
                />
              </div>

              <DataTable
                value={breakingPatternReport}
                paginator
                rows={10}
                stripedRows
                sortMode="multiple"
                dataKey={
                  `report_id` +
                  `speed` +
                  `station` +
                  Math.random().toString(36).substring(7)
                }
                filters={filters}
                filterDisplay="row"
                loading={loading}
                emptyMessage="No data found"
                globalFilterFields={[
                  "station",
                  "distance",
                  "speed",
                  "lp_cms_id",
                  "crew_name",
                  "crew_designation",
                  "report_id",
                  "train_id",
                ]}
                className="mt-3"
              >
                <Column field="report_id" header="Report ID" sortable />
                <Column field="train_id" header="Train ID." sortable />
                <Column field="station" header="Station" sortable />
                <Column field="distance" header="Distance" sortable />
                <Column field="speed" header="Speed (km/h)" sortable />
                <Column field="lp_cms_id" header="LP CMS ID" sortable />
                <Column field="crew_name" header="Crew Name" sortable />
                <Column
                  field="crew_designation"
                  header="Crew Designation"
                  sortable
                />
              </DataTable>
            </>
          ) : (
            <div className="text-center mt-10">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="loader">
                    <Loader />
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
