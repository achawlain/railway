import React, {
    useState, useEffect, useRef, useMemo, Suspense,
} from "react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-date-range";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { apiService } from "../utils/apiService";
import Loader from "./Loader"; // Optional: Use if needed
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import RAILWAY_CONST from "../utils/RailwayConst";
import { Toast } from "primereact/toast";
import ChartComponent from "./ChartComponent";
import { lazy } from "react";
import {
    // halteTableData,
    halteTableTitle,
    halteTableTitleAfter,
    previousAnalysisData,
    previousAnalysisTitle,
    TSRTableData,
    TSRTableTitle,
    speedTestTableTitle,
    speedTestTableData,
    halteTableData,
} from "../utils/tableData";

const TableComponent = lazy(() => import("./TableComponent"));


export default function HaltReport() {
    const toastRef = useRef(null);

    const ref = useRef();
    const [formData, setFormData] = useState({
        lp_cms_id: "",
        halt_name: "",
        template_id: "",
    });

    const [range, setRange] = useState([
        {
            startDate: subDays(new Date(), 30),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: "contains" },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [open, setOpen] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [haltStations, setHaltStations] = useState([]);
    const [haltTableData, setHaltTableData] = useState(null);
    const [haltChartData, setHaltChartData] = useState(null);

    const getTemplates = async () => {
        try {
            const response = await apiService(
                "get",
                RAILWAY_CONST.API_ENDPOINT.TEMPLATE
            );
            if (response.data) {
                const templateOptions = response.data.map((template) => ({
                    label: template.title,
                    value: template.id,
                }));
                setTemplates(templateOptions);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch templates",
                life: 3000,
            });
        }
    };

    const getHaltStations = async (templateId) => {
        if (!templateId) {
            setHaltStations([]);
            setFormData((prev) => ({ ...prev, halt_name: "" }));
            return;
        }
        try {
            const response = await apiService(
                "get",
                `${RAILWAY_CONST.API_ENDPOINT.HALT_REPORT}${templateId}`
            );
            if (response.data) {
                // console.log("Halt stations:", response.data);
                const stationOptions = response.data.map((station) => ({
                    label: station,
                    value: station,
                }));
                setHaltStations(stationOptions);
            }
        } catch (error) {
            console.error("Error fetching halt stations:", error);
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch halt stations",
                life: 3000,
            });
        }
    };

    useEffect(() => {
        getTemplates();
    }, []);

    const handleSumbit = async (e) => {
        e.preventDefault();

        if (!formData.template_id) {
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please select a template.",
                life: 3000,
            });
            return;
        }

        if (!formData.halt_name) {
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please select a halt station.",
                life: 3000,
            });
            return;
        }

        setLoading(true);
        setHaltTableData(null);
        setHaltChartData(null);

        const formattedStartDate = format(range[0].startDate, "yyyy-MM-dd");
        const formattedEndDate = format(range[0].endDate, "yyyy-MM-dd");

        const data = {
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            lp_cms_id: formData.lp_cms_id,
            halt_name: formData.halt_name,
            template_id: formData.template_id,
        };

        try {
            const haltDataResponse = await apiService("get", RAILWAY_CONST.API_ENDPOINT.HALT_DATA, {}, data);

            let haltFigResponse = { status: 400, data: null };
            if (haltDataResponse.status === 200 && haltDataResponse.data && haltDataResponse.data.length > 0) {
                haltFigResponse = await apiService("get", RAILWAY_CONST.API_ENDPOINT.HALT_FIG, {}, data);
                setHaltTableData(haltDataResponse.data);
                if (haltFigResponse.status === 200) {
                    setHaltChartData(JSON.parse(haltFigResponse.data));
                } else {
                    setHaltChartData(null);
                    toastRef.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: haltFigResponse?.message || "Failed to fetch halt figure",
                        life: 3000,
                    });
                }
            } else {
                setHaltTableData(null);
                setHaltChartData(null);
                // toastRef.current.show({
                //     severity: "error",
                //     summary: "Error",
                //     detail:
                //         haltDataResponse?.message || "Failed to fetch halt data report",
                //     life: 3000,
                // });
            }
        } catch (error) {
            toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch halt report data",
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

    const halteTable = useMemo(
        () => ({
            data: Array.isArray(haltTableData) ? haltTableData : [],
            columns: Array.isArray(halteTableTitle) ? halteTableTitle : []
        }),
        [haltTableData, halteTableTitle]
    );

   
    return (
        <>
            <Toast ref={toastRef} position="top-right" style={{ zIndex: 9999 }} />
            <div className="w-full bg-[#efefef]  min-h-screen">
                <div className="bg-white w-full sm:p-8 p-4 pt-4 rounded-[15px] min-h-[900px] sm:pt-4">
                    <h1 className="sm:text-[18px] flex-row flex justify-between text-[18px] rounded-[5px] bg-[#2A235A] text-white font-medium mb-4 border-b border-[#ccc] relative px-3 py-3">
                        Halt Report
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
                        {/* Templates Dropdown */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[16px]">Templates:</label>
                            <Dropdown
                                value={formData.template_id}
                                options={templates}
                                onChange={(e) => {
                                    setFormData({ ...formData, template_id: e.value });
                                    getHaltStations(e.value);
                                }}
                                placeholder="Select a Template"
                                filter
                                showClear
                                className="border px-1 rounded-md w-[250px]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[16px]">Halt Station:</label>
                            <Dropdown
                                value={formData.halt_name}
                                options={haltStations}
                                onChange={(e) =>
                                    setFormData({ ...formData, halt_name: e.value })
                                }
                                placeholder="Select a Halt Station"
                                filter
                                showClear
                                disabled={!formData.template_id || haltStations.length === 0}
                                className="border px-1 rounded-md w-[250px]"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[16px]">LP CMS:</label>
                            <input
                                type="text"
                                value={formData.lp_cms_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, lp_cms_id: e.target.value })
                                }
                                className="border px-1 py-2 rounded-md w-[250px]"
                                placeholder="Enter LP CMS"
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
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="loader">
                                <Loader />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* {haltTableData && haltTableData.data && ( */}
                            <>
                                {halteTableData && haltChartData && (
                                    <h4 className="text-lg font-semibold mt-8 mb-4 text-center text-[#30424c]">
                                        Halt Report at {formData.halt_name.toUpperCase()} Station
                                    </h4>
                                )}
                                {/* <div className="-mt-1 searchCol">
                                        <InputText
                                            value={globalFilterValue}
                                            onChange={onGlobalFilterChange}
                                            placeholder="Search for any field"
                                            className="w-56 h-10 border border-gray-300 rounded-md pl-2"
                                        />
                                    </div> */}
                                {halteTable?.data && halteTable?.data?.length > 0 ? (
                                    <Suspense fallback={<div>Loading table...</div>}>
                                        <TableComponent
                                            data={halteTable.data}
                                            colums={halteTable.columns} // notice spelling matches the component
                                            tableTitle="Halt Data"
                                        />
                                    </Suspense>
                                ) : (
                                    // <div className="text-center mt-10">
                                    //     <p className="text-gray-500">No halt data available</p>
                                    // </div>
                                    null
                                )}
                            </>

                            {haltChartData && (
                                // console.log("Halt Chart Data:", haltChartData),
                                <div style={{ overflowX: "auto", width: "auto" }}>
                                    <ChartComponent
                                        loading={loading}
                                        chartData={haltChartData}
                                    />
                                </div>
                            )}

                            {!haltTableData && !haltChartData && (
                                <div className="text-center mt-10">
                                    <p className="text-gray-500">No data available</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
