import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import Loader from "./Loader";
import { format } from "date-fns";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const DailySummary = () => {
  const [lp_cms_id, setLp_cms_id] = useState("");
  const [trainType, setTrainType] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const ref = useRef();
  const dateInputRef = useRef();

  useEffect(() => {
    fetchDailySummary();
  }, []);

  /* ================= API ================= */
  const fetchDailySummary = async (date = null) => {
    setLoading(true);
    setError(null);
    try {
      const dateToUse = date || selectedDate;
      const formattedDate = format(dateToUse, "yyyy-MM-dd");
      let url = `${RAILWAY_CONST.API_ENDPOINT.MANAGEMENT_DAILY_SUMMARY}?daily_report_date=${formattedDate}`;
      if (lp_cms_id) url += `&lp_cms_id=${lp_cms_id}`;
      if (trainType) url += `&train_type=${trainType}`;

      const response = await apiService("get", url);
      const responseData = response.data || response || [];
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      setError("Failed to fetch daily summary data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleFilter = () => fetchDailySummary(selectedDate);

  const handleClear = () => {
    setLp_cms_id("");
    setTrainType("");
    setGlobalFilterValue("");
    setFilters({
      global: { value: null, matchMode: "contains" },
    });
    const today = new Date();
    setSelectedDate(today);
    fetchDailySummary(today);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      global: { value, matchMode: "contains" },
    });
    setGlobalFilterValue(value);
  };

  const handleDownloadCSV = () => {
    if (!data.length) return;

    // Get all before_halt distance columns
    const beforeHaltColumns = getBeforeHaltColumns();

    // Create flattened data
    const flattenedData = data.map((row) => {
      const flatRow = { ...row };

      // Remove the before_halt_list object
      delete flatRow.before_halt_list;

      // Add each before_halt distance as a separate column
      beforeHaltColumns.forEach((distance) => {
        flatRow[`max_speed_at_${distance}`] = formatBeforeHaltValue(
          row.before_halt_list,
          distance
        );
      });

      return flatRow;
    });

    // Generate CSV
    const headers = Object.keys(flattenedData[0]);
    const rows = [
      headers.join(","),
      ...flattenedData.map((row) =>
        headers.map((h) => `"${row[h] ?? ""}"`).join(",")
      ),
    ];

    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "daily_summary.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /* ================= COLUMN LOGIC ================= */
  const getBeforeHaltColumns = () => {
    const item = data.find((d) => d.before_halt_list);
    if (!item) return [];
    return Object.keys(item.before_halt_list)
      .filter((k) => /^\d+m$/.test(k))
      .sort((a, b) => parseInt(b) - parseInt(a));
  };

  const formatBeforeHaltValue = (list, distance) => {
    if (!list) return "-";
    const val = list[distance];
    const loc = list[`${distance}_at`];
    return val ? (loc ? `${val} [${loc}]` : val) : "-";
  };

  // Template for report_id column with link
  const reportIdTemplate = (rowData) => {
    return (
      <Link
        to={`/reports/${rowData.report_id}`}
        target="_blank"
        className="text-[#9b4b90] underline"
      >
        {rowData.report_id}
      </Link>
    );
  };

  /* ================= SPEED VIOLATION LOGIC ================= */

  const getSpeedLimit = (distance, trainTypeName) => {
    const d = parseInt(distance);

    if (d === 1000) {
      if (
        trainTypeName?.toLowerCase().includes("goods") ||
        trainTypeName?.toLowerCase().includes("light")
      ) {
        return 30;
      }
      return 50; // Passenger / Mail
    }

    if (d === 200) return 15;
    if (d === 100) return 10;

    return null; // no limit
  };

  const isSpeedViolation = (speed, distance, trainTypeName) => {
    const limit = getSpeedLimit(distance, trainTypeName);
    if (limit === null || speed === "-" || speed === undefined) return false;
    return Number(speed) > limit;
  };

  // Template for before_halt columns
  const beforeHaltTemplate = (distance) => (rowData) => {
    const list = rowData.before_halt_list;
    if (!list) return "-";

    const speed = list[distance];
    const loc = list[`${distance}_at`];
    const isViolation = isSpeedViolation(
      speed,
      distance,
      rowData.train_type_name
    );

    return (
      <span
        className={isViolation ? "text-red-600 font-bold" : ""}
      >
        {speed ? (loc ? `${speed} [${loc}]` : speed) : "-"}
      </span>
    );
  };
  const beforeHaltColumns = getBeforeHaltColumns();

  // Get all global filter fields
  const getGlobalFilterFields = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(k => k !== "before_halt_list");
  };

  /* ================= RENDER ================= */
  return (
    <>
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <div className="w-full bg-[#efefef] min-h-screen">
          <div className="bg-white w-full sm:p-8 p-4 rounded-[15px] min-h-[900px] sm:pt-4">
            {/* ================= HEADER ================= */}
            <h1 className="sm:text-[18px] rounded-[5px] font-normal flex justify-between items-center text-[18px] text-[#fff] bg-[#2A235A] mb-1 border-b border-[#ccc] relative px-3 py-2 dailyReportTitle">
              <span>Daily Summary</span>
              <div className="flex items-center gap-4 text-[16px] flex-wrap">
                <div className="flex items-center gap-2">
                  <label>LP CMS :</label>
                  <input
                    value={lp_cms_id}
                    onChange={(e) => setLp_cms_id(e.target.value)}
                    className="h-[35px] px-2 rounded text-black w-[160px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Train Type :</label>
                  <select
                    value={trainType}
                    onChange={(e) => setTrainType(e.target.value)}
                    className="h-[35px] px-2 rounded text-black w-[160px]"
                  >
                    <option value="">All</option>
                    <option value="1">Passenger</option>
                    <option value="2">Mail Express</option>
                    <option value="3">Goods</option>
                    <option value="4">Light Engine [LE]</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label>Date :</label>
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={handleDateChange}
                    className="h-[35px] px-2 rounded text-black"
                  />
                </div>
                <button
                  onClick={handleFilter}
                  className="bg-[#9b4b90] px-6 h-[35px] rounded text-white"
                >
                  Filter
                </button>
                <button
                  onClick={handleClear}
                  className="bg-white px-6 h-[35px] rounded text-[#2A235A] border border-[#2A235A]"
                >
                  Clear
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="border border-white px-6 h-[35px] rounded text-white"
                >
                  Download CSV
                </button>
              </div>
            </h1>

            {/* Search bar */}
            <div className="my-4">
              <InputText
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Search for any field"
                className="w-56 h-[36px] border border-gray-300 rounded-md pl-2"
              />
            </div>

            {/* ================= DATATABLE ================= */}
            <DataTable
              value={data}
              paginator
              rows={10}
              stripedRows
              sortMode="multiple"
              dataKey="report_id"
              filters={filters}
              filterDisplay="row"
              loading={loading}
              emptyMessage="No data found"
              globalFilterFields={getGlobalFilterFields()}
              scrollable
              scrollHeight="600px"
              className="mt-3"
            >
              <Column
                field="report_id"
                header="Report ID"
                sortable
                body={reportIdTemplate}
              />
              <Column
                field="date_of_analysis"
                header="Date Of Analysis"
                sortable
              />
              <Column
                field="date_of_working"
                header="Date Of Working"
                sortable
              />
              <Column field="train_id" header="Train ID" />
              <Column field="train_type_name" header="Train Type" />
              <Column field="analyzed_by" header="Analyzed By" sortable />
              <Column field="lp_cms_id" header="LP CMS ID" sortable />
              <Column field="crew_name" header="Crew Name" sortable />
              <Column
                field="crew_designation"
                header="Crew Designation"
              />
              <Column
                field="nominated_cli"
                header="Nominated CLI"
                sortable
              />
              <Column field="alp_cms_id" header="Alp Cms Id" sortable />
              <Column field="alp_crew_designation" header="Alp Crew Designation" />
              <Column field="alp_crew_name" header="Alp Crew Name" sortable />
              <Column field="alp_nominated_cli" header="Alp Nominated Cli" sortable />
              <Column field="goods" header="Goods" />
              <Column field="spm" header="Spm" />
              <Column field="max_speed" header="Max Speed" />

              {/* Dynamic before_halt columns */}
              {beforeHaltColumns.map((distance) => (
                <Column
                  key={distance}
                  header={`Max Speed At ${distance}`}
                  body={beforeHaltTemplate(distance)}
                />
              ))}
            </DataTable>
          </div>
        </div>
      )}
    </>
  );
};

export default DailySummary;