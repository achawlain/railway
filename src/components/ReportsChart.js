import React, { useState, useEffect } from "react";
import ChartComponent from "./ChartComponent";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";


function ReportsChart() {

    const [loading, setLoading] = useState(false);
    const [chartReportsData, setChartReportData] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const getChartReportData = async (start_date, end_date) => {
        const url = `${RAILWAY_CONST.API_ENDPOINT.MANAGEMENT_SUMMARY}?start_date=${start_date}&end_date=${end_date}`
        try {
            const response = await apiService("get", url);
            setChartReportData(JSON.parse(response.data));
            console.log("Chart data:", JSON.parse(response.data));
        } catch (error) {
            console.error("Error fetching chart data:", error);
        }
    };

    useEffect(() => {
        // Fetch data whenever startDate or endDate changes
        if (startDate && endDate) {
            getChartReportData(startDate, endDate);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        // Calculate today's date
        const today = new Date();

        // Calculate the date 20 days ago
        const twentyDaysAgo = new Date();
        twentyDaysAgo.setDate(today.getDate() - 30);

        // Format dates to YYYY-MM-DD
        const formattedToday = today.toISOString().split("T")[0];
        const formattedTwentyDaysAgo = twentyDaysAgo.toISOString().split("T")[0];

        // Set start and end dates
        setStartDate(formattedTwentyDaysAgo);
        setEndDate(formattedToday);
    }, []);



    return (
        <>
            <div className="w-full bg-[#efefef] p-4 reportGenerateBg pt-8 min-h-screen">
                <div className="bg-white w-full p-8 pt-4 rounded-[15px] min-h-[900px]">
                    <h1 className="text-[22px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
                        Summary
                    </h1>
                    <h2 >
                      <span className="font-semibold text-xl">  Date : </span>
                        <span>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </span>
                       <span className="italic mx-3 font-medium"> To </span> 
                        <span>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </span>
                    </h2>
                    <div style={{ overflowX: "auto", width: "100%" }}>
                        <ChartComponent
                            loading={loading}
                            chartData={chartReportsData}

                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportsChart
