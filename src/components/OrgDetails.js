import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import Plot from "react-plotly.js";
import { DateRange } from "react-date-range";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function OrgDetails() {
  const { id } = useParams();
  const location = useLocation();

  const orgName = location.state?.org_name;

  const [selectedTab, setSelectedTab] = useState("Daily Report");
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [chartData, setChartData] = useState(null);

  const [stats, setStats] = useState({
    activeUsers: 0,
    activeTemplates: 0,
    deletedUsers: 0,
    deletedTemplates: 0,
    totalReports: 0
  });

  const [cachedData, setCachedData] = useState({
    activeUsers: [],
    deletedUsers: [],
    activeTemplates: [],
    deletedTemplates: [],
    totalReports: []
  });

  const [showPicker, setShowPicker] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setDate(today.getDate() - 30);

  const [range, setRange] = useState([
    {
      startDate: lastMonth,
      endDate: today,
      key: "selection"
    }
  ]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchChartData();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, range]);

  const fetchChartData = async () => {
    try {
      const start = range[0].startDate.toISOString().split("T")[0];
      const end = range[0].endDate.toISOString().split("T")[0];

      let url = `${RAILWAY_CONST.API_ENDPOINT.ORGANISATION_DETAILS}/${id}`;
      url += `?start_date=${start}&end_date=${end}`;

      const response = await apiService("get", url);
      const parsed = JSON.parse(response.data);
      setChartData(parsed);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStats = async () => {
    try {
      const [
        activeUsersRes,
        deletedUsersRes,
        activeTemplatesRes,
        deletedTemplatesRes,
      ] = await Promise.all([
        apiService("get", `${RAILWAY_CONST.API_ENDPOINT.USERS}?is_deleted=0`),
        apiService("get", `${RAILWAY_CONST.API_ENDPOINT.USERS}?is_deleted=1`),
        apiService("get", `${RAILWAY_CONST.API_ENDPOINT.TEMPLATE_STATUS}?is_deleted=0`),
        apiService("get", `${RAILWAY_CONST.API_ENDPOINT.TEMPLATE_STATUS}?is_deleted=1`),
      ]);

      const activeUsers = activeUsersRes?.data?.users || [];
      const deletedUsers = deletedUsersRes?.data?.users || [];
      const activeTemplates = activeTemplatesRes?.data?.users || [];
      const deletedTemplates = deletedTemplatesRes?.data?.users || [];

      setCachedData({
        activeUsers,
        deletedUsers,
        activeTemplates,
        deletedTemplates
      });

      setStats({
        activeUsers: activeUsers.length,
        deletedUsers: deletedUsers.length,
        activeTemplates: activeTemplates.length,
        deletedTemplates: deletedTemplates.length,
        totalReports: 0
      });

    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  const formatDate = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      global: { value, matchMode: "contains" },
    });
    setGlobalFilterValue(value);
  };

  const getTableColumns = (data) => {
    if (!data || data.length === 0) return [];
    const keys = Object.keys(data[0]);
    return ["id", ...keys.filter((key) => key !== "id")];
  };

  const handleDeleteUser = (userId) => {
    console.log("Delete user:", userId);
    // Add delete logic here
  };

  const handleDeleteTemplate = (templateId) => {
    console.log("Delete template:", templateId);
    // Add delete logic here
  };

  const handleActivateUser = (userId) => {
    console.log("Activate user:", userId);
    // Add activate logic here
  };

  const handleActivateTemplate = (templateId) => {
    console.log("Activate template:", templateId);
    // Add activate logic here
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() => handleDeleteUser(rowData.id)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
      >
        Deactivate
      </button>
    );
  };

  const actionBodyTemplateForTemplate = (rowData) => {
    return (
      <button
        onClick={() => handleDeleteTemplate(rowData.id)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
      >
        Deactivate
      </button>
    );
  };

  const actionBodyTemplateForDeletedUser = (rowData) => {
    return (
      <button
        onClick={() => handleActivateUser(rowData.id)}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
      >
        Activate
      </button>
    );
  };

  const actionBodyTemplateForDeletedTemplate = (rowData) => {
    return (
      <button
        onClick={() => handleActivateTemplate(rowData.id)}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
      >
        Activate
      </button>
    );
  };

  return (
    <>
      <div className="w-full flex flex-row controlCenterCol">
        {/* Side Navbar */}
        <div className="leftMenuCol w-[300px] bg-[#2c215d] h-[calc(100vh_-_80px)] fixed top-[80px] z-20">
          <div className="leftColInner">
            <div
              className={`hideDesktop showSelectedItem z-30 relative ${
                isShowMenu ? "active" : ""
              }`}
              onClick={() => setIsShowMenu(!isShowMenu)}
            >
              {selectedTab}
            </div>
            {(isShowMenu || windowWidth > 768) && (
              <ul className="bg-[#2c215d]">
                <li
                  onClick={() => setSelectedTab("Daily Report")}
                  className={`${
                    selectedTab === "Daily Report" ? "selectedCol" : ""
                  } cursor-pointer flex items-center border-b border-b-[#030015] text-white px-4 py-4`}
                >
                  Daily Report
                </li>
                <li
                  onClick={() => setSelectedTab("Active Users")}
                  className={`${
                    selectedTab === "Active Users" ? "selectedCol" : ""
                  } cursor-pointer flex items-center border-b border-b-[#030015] text-white px-4 py-4`}
                >
                  Active Users
                </li>
                <li
                  onClick={() => setSelectedTab("Active Templates")}
                  className={`${
                    selectedTab === "Active Templates" ? "selectedCol" : ""
                  } cursor-pointer flex items-center border-b border-b-[#030015] text-white px-4 py-4`}
                >
                  Active Templates
                </li>
                <li
                  onClick={() => setSelectedTab("Deleted Users")}
                  className={`${
                    selectedTab === "Deleted Users" ? "selectedCol" : ""
                  } cursor-pointer flex items-center border-b border-b-[#030015] text-white px-4 py-4`}
                >
                  Deleted Users
                </li>
                <li
                  onClick={() => setSelectedTab("Deleted Templates")}
                  className={`${
                    selectedTab === "Deleted Templates" ? "selectedCol" : ""
                  } cursor-pointer flex items-center border-b border-b-[#030015] text-white px-4 py-4`}
                >
                  Deleted Templates
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="rightContentCol w-full pl-[300px] z-10">
          <div className="min-h-screen bg-white p-3 sm:p-6">
            <div className="w-full bg-white rounded-2xl shadow-xl p-4 sm:p-6 mx-auto">
              <h1 className="text-[22px] text-[#30424c] font-medium text-center pb-3 mb-6">
                {orgName || "Organisation Name"}
              </h1>

              {selectedTab === "Daily Report" && (
                <>
                  <h1 className="sm:text-[18px] rounded-[5px] bg-[#2A235A] text-white flex-row flex justify-between items-center text-[18px] font-medium mb-1 border-b border-[#ccc] relative px-3 py-[6px] locoPilotTitle">
                    <span>Daily Reports</span>
                    <div className="relative z-20 flex flow-row datePickerCol mt-1 text-[14px]">
                      <label className="text-[14px] inline-block min-w-[110px] pr-3 sm:mb-0 mt-1">
                        Date Range :
                      </label>
                      <input
                        readOnly
                        value={`${formatDate(range[0].startDate)} - ${formatDate(range[0].endDate)}`}
                        onClick={() => setShowPicker(!showPicker)}
                        className="border px-1 py-2 rounded-md w-[240px] cursor-pointer inputbox pl-2 -mt-1"
                      />
                      {showPicker && (
                        <div className="absolute z-10 mt-[44px] shadow-lg border right-0 bg-white font-normal">
                          <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setRange([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={range}
                            months={2}
                            direction={window.innerWidth > 600 ? "horizontal" : "vertical"}
                          />
                        </div>
                      )}
                    </div>
                  </h1>

                  <div className="bg-white w-full rounded-[15px] min-h-[900px]">
                    <div style={{ overflowX: "auto", width: "100%" }}>
                      <div className="mt-6 w-full">
                        {chartData && chartData.data && chartData.data.length > 0 ? (
                          <Plot
                            data={chartData.data}
                            layout={{
                              ...chartData.layout,
                              autosize: true,
                              margin: { l: 60, r: 30, t: 40, b: 50 }
                            }}
                            style={{ width: "100%" }}
                            useResizeHandler={true}
                          />
                        ) : (
                          <div className="h-64 flex items-center justify-center">
                            <p>No Data Available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === "Active Users" && (
                <>
                  <h1 className="sm:text-[18px] rounded-[5px] bg-[#2A235A] text-white flex-row flex justify-between items-center text-[18px] font-medium mb-1 border-b border-[#ccc] relative px-3 py-[6px] locoPilotTitle">
                    <span>Active Users ({stats.activeUsers})</span>
                    <div className="relative z-20 flex flow-row datePickerCol mt-1 text-[14px]">
                      <div className="pl-4 -mt-1 searchCol">
                        <InputText
                          value={globalFilterValue}
                          onChange={onGlobalFilterChange}
                          placeholder="Search for any field"
                          className="w-56 h-10 -mb-1 inline-block border border-gray-300 rounded-md pl-2 globleFilter bg-transparent text-white font-normal"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                    </div>
                  </h1>

                  <div className="bg-white w-full rounded-[15px] min-h-[900px]">
                    <div style={{ overflowX: "auto", width: "100%" }}>
                      <DataTable
                        value={cachedData.activeUsers}
                        paginator
                        rows={10}
                        stripedRows
                        sortMode="multiple"
                        filters={filters}
                        filterDisplay="row"
                        emptyMessage="No data found"
                        className="mt-2"
                      >
                        {getTableColumns(cachedData.activeUsers).map((col) => (
                          <Column key={col} field={col} header={col.toUpperCase()} sortable />
                        ))}
                        <Column header="ACTION" body={actionBodyTemplate} style={{ width: '120px' }} />
                      </DataTable>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === "Active Templates" && (
                <>
                  <h1 className="sm:text-[18px] rounded-[5px] bg-[#2A235A] text-white flex-row flex justify-between items-center text-[18px] font-medium mb-1 border-b border-[#ccc] relative px-3 py-[6px] locoPilotTitle">
                    <span>Active Templates ({stats.activeTemplates})</span>
                    <div className="relative z-20 flex flow-row datePickerCol mt-1 text-[14px]">
                      <div className="pl-4 -mt-1 searchCol">
                        <InputText
                          value={globalFilterValue}
                          onChange={onGlobalFilterChange}
                          placeholder="Search for any field"
                          className="w-56 h-10 -mb-1 inline-block border border-gray-300 rounded-md pl-2 globleFilter bg-transparent text-white font-normal"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                    </div>
                  </h1>

                  <div className="bg-white w-full rounded-[15px] min-h-[900px]">
                    <div style={{ overflowX: "auto", width: "100%" }}>
                      <DataTable
                        value={cachedData.activeTemplates}
                        paginator
                        rows={10}
                        stripedRows
                        sortMode="multiple"
                        filters={filters}
                        filterDisplay="row"
                        emptyMessage="No data found"
                        className="mt-2"
                      >
                        {getTableColumns(cachedData.activeTemplates).map((col) => (
                          <Column key={col} field={col} header={col.toUpperCase()} sortable />
                        ))}
                        <Column header="ACTION" body={actionBodyTemplateForTemplate} style={{ width: '120px' }} />
                      </DataTable>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === "Deleted Users" && (
                <>
                  <h1 className="sm:text-[18px] rounded-[5px] bg-[#2A235A] text-white flex-row flex justify-between items-center text-[18px] font-medium mb-1 border-b border-[#ccc] relative px-3 py-[6px] locoPilotTitle">
                    <span>Deleted Users ({stats.deletedUsers})</span>
                    <div className="relative z-20 flex flow-row datePickerCol mt-1 text-[14px]">
                      <div className="pl-4 -mt-1 searchCol">
                        <InputText
                          value={globalFilterValue}
                          onChange={onGlobalFilterChange}
                          placeholder="Search for any field"
                          className="w-56 h-10 -mb-1 inline-block border border-gray-300 rounded-md pl-2 globleFilter bg-transparent text-white font-normal"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                    </div>
                  </h1>

                  <div className="bg-white w-full rounded-[15px] min-h-[900px]">
                    <div style={{ overflowX: "auto", width: "100%" }}>
                      <DataTable
                        value={cachedData.deletedUsers}
                        paginator
                        rows={10}
                        stripedRows
                        sortMode="multiple"
                        filters={filters}
                        filterDisplay="row"
                        emptyMessage="No data found"
                        className="mt-2"
                      >
                        {getTableColumns(cachedData.deletedUsers).map((col) => (
                          <Column key={col} field={col} header={col.toUpperCase()} sortable />
                        ))}
                        <Column header="ACTION" body={actionBodyTemplateForDeletedUser} style={{ width: '120px' }} />
                      </DataTable>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === "Deleted Templates" && (
                <>
                  <h1 className="sm:text-[18px] rounded-[5px] bg-[#2A235A] text-white flex-row flex justify-between items-center text-[18px] font-medium mb-1 border-b border-[#ccc] relative px-3 py-[6px] locoPilotTitle">
                    <span>Deleted Templates ({stats.deletedTemplates})</span>
                    <div className="relative z-20 flex flow-row datePickerCol mt-1 text-[14px]">
                      <div className="pl-4 -mt-1 searchCol">
                        <InputText
                          value={globalFilterValue}
                          onChange={onGlobalFilterChange}
                          placeholder="Search for any field"
                          className="w-56 h-10 -mb-1 inline-block border border-gray-300 rounded-md pl-2 globleFilter bg-transparent text-white font-normal"
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                    </div>
                  </h1>

                  <div className="bg-white w-full rounded-[15px] min-h-[900px]">
                    <div style={{ overflowX: "auto", width: "100%" }}>
                      <DataTable
                        value={cachedData.deletedTemplates}
                        paginator
                        rows={10}
                        stripedRows
                        sortMode="multiple"
                        filters={filters}
                        filterDisplay="row"
                        emptyMessage="No data found"
                        className="mt-2"
                      >
                        {getTableColumns(cachedData.deletedTemplates).map((col) => (
                          <Column key={col} field={col} header={col.toUpperCase()} sortable />
                        ))}
                        <Column header="ACTION" body={actionBodyTemplateForDeletedTemplate} style={{ width: '120px' }} />
                      </DataTable>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrgDetails;
