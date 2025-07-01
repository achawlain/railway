import React, { useState, useEffect, useRef } from "react";
import RAILWAY_CONST from "../utils/RailwayConst";
import { apiService } from "../utils/apiService";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import deleteIcon from "../images/delete-icon.svg";
import AddLocoPilotPopup from "./AddLocoPilotDetails";
import BulkUpload from "./BulkUpload";
import { Toast } from "primereact/toast";
import UpdateLocoPilotDetails from "./UpdateLocoPilotDetails";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ManageLocoPilot = () => {
  const toastRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [locoPilotDetails, setLocoPilotDetails] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedPilot, setSelectedPilot] = useState(null); // Store selected pilot for deletion
  const [showDialog, setShowDialog] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUpdatePopupVisible, setIsUpdatePopupVisible] = useState(false);

  const getLocoPilotDetails = async () => {
    try {
      const response = await apiService(
        "get",
        `${RAILWAY_CONST.API_ENDPOINT.CREW}`
      );
      // console.log("Loco Pilot Details:", response.data);
      setLocoPilotDetails(response.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch Loco Pilot details",
        life: 3000,
      });
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

  const deleteLocoPilot = async () => {
    if (!selectedPilot) return;
    try {
      await apiService(
        "delete",
        `${RAILWAY_CONST.API_ENDPOINT.CREW}/${selectedPilot.cms_id}`
      );
      console.log("Deleted Loco Pilot:", selectedPilot.cms_id);
      setLocoPilotDetails((prev) =>
        prev.filter((pilot) => pilot.cms_id !== selectedPilot.cms_id)
      );
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Loco Pilot record deleted successfully",
        life: 3000,
      });
      setShowDialog(false);
      getLocoPilotDetails(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting loco pilot:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete Loco Pilot record",
        life: 3000,
      });
    }
  };

  const deleteButtonTemplate = (rowData) => {
    return (
      <button
        onClick={() => {
          setSelectedPilot(rowData);
          setShowDialog(true);
        }}
      >
        <img
          alt="delete icon"
          src={deleteIcon}
          className="cursor-pointer leading-[13px] w-[19px] mr-[2px] mb-1"
        />
      </button>
    );
  };

  const handleBulkUploadClick = () => {
    setIsPopupVisible(true);
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("crew_file", file);

    try {
      const response = await apiService(
        "post",
        `${RAILWAY_CONST.API_ENDPOINT.CREW}/upload`,
        formData,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful:", response);
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "File uploaded successfully",
        life: 3000,
      });
      setIsPopupVisible(false); // Close the popup on success
      getLocoPilotDetails(); // Refresh the list after upload
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to upload file",
        life: 3000,
      });
    }
  };

  const handleAddLocoPilot = async (data) => {
    try {
      const response = await apiService(
        "post",
        `${RAILWAY_CONST.API_ENDPOINT.CREW}`,
        data
      );
      console.log("Loco Pilot added successfully:", data, response.data);
      setLocoPilotDetails((prev) => [...prev, response.data]); // Add the new pilot to the list
      setIsFormVisible(false);
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Loco Pilot details added successfully",
        life: 3000,
      });
      getLocoPilotDetails(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding loco pilot:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to add Loco Pilot details",
        life: 3000,
      });
    }
  };

  const handleEditClick = (pilot) => {
    setSelectedPilot(pilot);
    setIsUpdatePopupVisible(true);
  };

  const handleEditSubmit = async (updatedPilot) => {
    try {
      await apiService(
        "put",
        `${RAILWAY_CONST.API_ENDPOINT.CREW}`,
        updatedPilot
      );
      setLocoPilotDetails((prev) =>
        prev.map((pilot) =>
          pilot.cms_id === updatedPilot.cms_id ? updatedPilot : pilot
        )
      );
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Loco Pilot updated successfully",
        life: 3000,
      });
    } catch (error) {
      console.error("Error updating loco pilot:", error);
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update Loco Pilot",
        life: 3000,
      });
    }
    setIsUpdatePopupVisible(false);
  };

  const editButtonTemplate = (rowData) => {
    return (
      <Button
        // label="Edit"
        icon="pi pi-pencil"
        className="pb-2 !focus:box-shadow-none !focus:outline-none !focus:border-red-400"
        onClick={() => handleEditClick(rowData)}
      />
    );
  };

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <div className="w-full bg-[#efefef] p-4 min-h-screen">
        <div className="bg-white w-full sm:p-8 p-4 pt-4 rounded-[15px] min-h-[900px] sm:pt-4">
          <h1 className="sm:text-[18px] flex-row flex justify-between text-[18px] text-[#30424c] font-medium mb-1 border-b border-[#ccc] pb-2 relative pt-[0px] manageLocoPilotTitle">
            <span>Manage Loco Pilot</span>
            <div className="relative flex flow-row datePickerCol text-[14px] font-normal">
              <div className="-mt-1 searchCol">
                <InputText
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Search for any field"
                  className="w-56 h-10 -mb-1 inline-block border border-gray-300 rounded-md pl-2 globleFilter"
                  style={{ marginLeft: "auto" }}
                />
              </div>
              <div className="w-full p-4 pt-4 flex justify-end items-center pr-0 buttonCol">
                <button
                  className="bg-[#2c215d] text-white px-4 py-2 rounded-md"
                  onClick={handleBulkUploadClick}
                >
                  Bulk Upload
                </button>
                <button
                  className="bg-[#2c215d] text-white px-4 py-2 rounded-md ml-2"
                  onClick={() => setIsFormVisible(true)}
                >
                  Add New Loco Pilot Details
                </button>
              </div>
            </div>
          </h1>

          <DataTable
            value={locoPilotDetails}
            editMode="row"
            paginator
            rows={10}
            stripedRows
            sortMode="multiple"
            dataKey="cms_id" // Ensure this matches your dataset's key
            filters={filters}
            filterDisplay="row"
            loading={loading}
            emptyMessage="No data found"
            globalFilterFields={[
              "name",
              "cms_id",
              "designation",
              "emp_id",
              "mobile",
              "email",
              "nli",
            ]}
            className="mt-10"
          >
            <Column field="cms_id" header="LP CMS ID" sortable />
            <Column field="name" header="LP Name" sortable />
            <Column field="designation" header="Designation" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="emp_id" header="Employee ID" sortable />
            {/* <Column field="id" header="ID" sortable /> */}
            <Column field="mobile" header="Mobile" sortable />
            <Column field="nli" header="Nomilated CLI" sortable />
            <Column
              body={deleteButtonTemplate}
              style={{ width: "4%" }}
              bodyStyle={{ textAlign: "center" }}
            />
            {/* <Column rowEditor={allowEdit} bodyStyle={{ textAlign: 'center' }}></Column> */}
            <Column
              body={editButtonTemplate}
              style={{ width: "4%" }}
              bodyStyle={{ textAlign: "center" }}
            />

            {/* Add or remove columns as needed */}
          </DataTable>
        </div>
      </div>

      <Dialog
        visible={showDialog}
        style={{ width: "450px" }}
        header="Confirm Deletion"
        modal
        footer={
          <>
            <div className="flex justify-end gap-4 ">
              <Button
                label="No"
                onClick={() => setShowDialog(false)}
                className="p-button-text px-4 py-2 border-black border border-solid outline-none text-center"
              />
              <Button
                label="Yes"
                onClick={deleteLocoPilot}
                className="p-button-success bg-[#9b4b90] text-white px-4 py-2 rounded text-center"
              />
            </div>
          </>
        }
        onHide={() => setShowDialog(false)}
      >
        <p>
          Are you sure you want to delete Loco Pilot{" "}
          <b>{selectedPilot?.name}</b>?
        </p>
      </Dialog>

      <BulkUpload
        visible={isPopupVisible}
        onClose={handlePopupClose}
        onUpload={handleFileUpload}
      />

      <AddLocoPilotPopup
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSubmit={handleAddLocoPilot}
      />

      <UpdateLocoPilotDetails
        visible={isUpdatePopupVisible}
        pilot={selectedPilot}
        onClose={() => setIsUpdatePopupVisible(false)}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default ManageLocoPilot;
