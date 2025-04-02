import React, { useEffect, useState } from "react";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import { locations } from "../utils/tableData";
import { useLocation, useParams } from "react-router-dom";

const getLocalISOTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Convert offset to milliseconds
  return new Date(now - offset).toISOString().slice(0, 16); // Convert to local ISO string
};

const ReportTable = ({ onFormChange, handleHaltSelectedData }) => {
  // const [locations, setLocations] = useState(locations);
  const [isDatat, setIsData] = useState(false);
  const [formData, setFormData] = useState({
    dateOfAnalysis: getLocalISOTime(),
    analyzedBy: "",
    lp: "",
    designation: "",
    nominatedCLI: "",
    lpCMSID: "",
    maxSpeed: "",
    dateOfWorking: "",
    trainNo: "",
    load: "",
    bmbs: "",
    locoNo: "",
    spm: "",
    averageSpeed: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    runningTime: "",
    totalDistance: "",
    timeWithSpeed: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      await getFormData();
    };
    fetchData();
  }, []);

  const getFormData = async () => {
    try {
      const statResponse = await apiService(
        "get",
        `${RAILWAY_CONST.API_ENDPOINT.STAT}?id=${id}`
      );
      if (statResponse) {
        setFormData((prev) => ({
          ...prev,
          analyzedBy: statResponse.analyzed_by || prev.analyzedBy,
          spm: statResponse.SPM || prev.spm,
          dateOfAnalysis:
            formatDateTimeForInput(statResponse.date_of_analysis) ||
            prev.dateOfAnalysis,
          dateOfWorking: formatDateTimeForInput(statResponse.date_of_working),
          arrivalTime:
            formatTime(statResponse.arrival_time) || prev.arrivalTime,
          departureTime:
            formatTime(statResponse.departure_time) || prev.departureTime,
          averageSpeed: statResponse.avg_speed?.toString() || prev.averageSpeed,
          maxSpeed: statResponse.max_speed?.toString() || prev.maxSpeed,
          runningTime: statResponse.running_time || prev.runningTime,
          totalDistance:
            statResponse.total_distance?.toString() || prev.totalDistance,
          from: statResponse.from || prev.from,
          to: statResponse.to || prev.to,
          trainNo: statResponse.train_num || prev.trainNo,
          load: statResponse.load || prev.load,
          locoNo: statResponse.loco_no || prev.locoNo,
          bmbs: statResponse.bmbs?.toString() || prev.bmbs,
          timeWithSpeed: statResponse.max_speed_5 || prev.timeWithSpeed,
        }));

        await getCrewData();
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const getCrewData = async () => {
    try {
      const crewResponse = await apiService(
        "get",
        "crew_details?crew_id=ASN2685"
      );
      if (crewResponse) {
        setFormData((prev) => ({
          ...prev,
          lp: crewResponse.crew_name,
          designation: crewResponse.designation,
          nominatedCLI: crewResponse.nominated_cli,
          lpCMSID: crewResponse.lp_cms_id,
        }));
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return "";

    const parts = dateString.split(" ");
    if (parts.length !== 2) return "";

    const [day, month, year] = parts[0].split("/").map(Number);
    const [hours, minutes] = parts[1].split(":").map(Number);

    if (
      !day ||
      !month ||
      !year ||
      hours === undefined ||
      minutes === undefined
    ) {
      return "";
    }

    // Convert to ISO format for datetime-local
    const date = new Date(year, month - 1, day, hours, minutes);
    return date.toISOString().slice(0, 16); // Get YYYY-MM-DDTHH:MM
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "some-date") {
      console.warn("Invalid date received:", dateString);
      return ""; // Return empty to avoid crashes
    }

    // If already in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ), return only date
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    // Handle DD/MM/YYYY HH:MM format
    const parts = dateString.split(" ");
    if (parts.length < 1 || parts.length > 2) {
      console.error("Invalid date format:", dateString);
      return "";
    }

    const dateParts = parts[0].split("/");
    if (dateParts.length !== 3) {
      console.error("Invalid date structure:", dateString);
      return "";
    }

    const [day, month, year] = dateParts.map(Number);
    if (!day || !month || !year) {
      console.error("Invalid date values:", dateString);
      return "";
    }

    // Create Date object (months in JS start from 0)
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
      console.error("Invalid date conversion:", dateString);
      return "";
    }

    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hh, mm] = time.split(":");
    return `${hh}:${mm}`;
  };

  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     const response = await fetch("/api/locations");
  //     const data = await response.json();

  //     setLocations(data);
  //   };
  //   fetchLocations();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name == "from" || name == "to") {
      handleHaltSelectedData(
        name == "from" ? value : formData.from,
        name == "to" ? value : formData.to
      );
    }
  };

  // useEffect(() => {
  //   getChartSpeedBeforeHaltData();
  // }, [formData.from, formData.to]);

  // const getChartSpeedBeforeHaltData = async () => {
  //   try {
  //     const response = await apiService(
  //       "get",
  //       `${RAILWAY_CONST.API_ENDPOINT.SPEED_BEFORE_HALT}?from_station=${formData.from}&to_station=${formData.to}`
  //     );
  //     console.log(
  //       "response-------getChartSpeedBeforeHaltData",
  //       JSON.parse(response)
  //     );
  //     //setChartSpeedBeforHaltData(JSON.parse(response)); // No need for JSON.parse if data is already JSON
  //   } catch (error) {
  //     console.error("Error fetching chart data:", error);
  //   }
  // };

  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData, onFormChange]); //run effect when formData changes

  return (
    <div>
      <h3 className="text-center text-xl font-bold mb-8 mt-2">
        CENTRAL RAILWAY, MUMBAI DIVISION
      </h3>

      <form className="grid grid-cols-3 gap-8">
        {/* Row 1 */}
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Date of Analysis
          </label>
          <input
            type="datetime-local"
            name="dateOfAnalysis"
            value={formData.dateOfAnalysis}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Date of Working
          </label>
          <input
            type="datetime-local"
            name="dateOfWorking"
            value={formData.dateOfWorking}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            From
          </label>
          <select
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select From</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Analyzed By
          </label>
          <input
            type="text"
            name="analyzedBy"
            value={formData.analyzedBy}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Train No
          </label>
          <input
            type="text"
            name="trainNo"
            value={formData.trainNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            To
          </label>
          <select
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select To</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            LP
          </label>
          <input
            type="text"
            name="lp"
            value={formData.lp}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Load
          </label>
          <input
            type="text"
            name="load"
            value={formData.load}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Departure Time
          </label>
          <input
            type="time"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            step="1"
            className="w-full border p-2 rounded"
          />
        </div>
        {/* Row 2 */}
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Designation
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            BMBS %
          </label>
          <input
            type="text"
            name="designation"
            value={formData.bmbs}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Arrival Time
          </label>
          <input
            type="time"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            step="1"
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Nominated CLI
          </label>
          <input
            type="text"
            name="nominatedCLI"
            value={formData.nominatedCLI}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Loco No
          </label>
          <input
            type="text"
            name="locoNo"
            value={formData.locoNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Running Time
          </label>
          <input
            type="text"
            name="runningTime"
            value={formData.runningTime}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            LP CMS ID
          </label>
          <input
            type="text"
            name="lpCMSID"
            value={formData.lpCMSID}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            SPM
          </label>
          <input
            type="text"
            name="spm"
            value={formData.spm}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Total Distance (KM)
          </label>
          <input
            type="number"
            name="totalDistance"
            value={formData.totalDistance}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Row 3 */}
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Max Speed
          </label>
          <input
            type="number"
            name="maxSpeed"
            value={formData.maxSpeed}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Row 4 */}

        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Average Speed
          </label>
          <input
            type="text"
            name="averageSpeed"
            value={formData.averageSpeed}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Row 5 - Dropdowns */}

        {/* Row 6 */}

        {/* Last Row */}
        <div className="flex flex-row items-center">
          <label className="block font-semibold w-[260px] text-[#414140] text-[14px]">
            Time with Speed ≥ (Max Speed - 5 Kmph)
          </label>
          <input
            type="text"
            name="timeWithSpeed"
            value={formData.timeWithSpeed}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </form>
    </div>
  );
};

export default ReportTable;
