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
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import BulkUpload from "./BulkUpload";
// import 'primeicons/primeicons.css';



const ManageLocoPilot = () => {
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
      setShowDialog(false);
      getLocoPilotDetails(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting loco pilot:", error);
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
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value || ''}
        onChange={(e) => options.editorCallback(e.target.value)}
        className="w-full"
      />
    );
  };

  const allowEdit = (rowData) => {
    return rowData.name !== 'Blue Band';
  };

  const onRowEditComplete = async (e) => {
    console.log(e, "e");
    const updatedRow = e.newData; // The updated row data
    console.log("Row edit complete:", updatedRow);
    try {
      // Send updated data to the API
      await apiService("put", `${RAILWAY_CONST.API_ENDPOINT.CREW}`, updatedRow);
      console.log("Updated crew details:", updatedRow);
      // Update local state with the new data
      setLocoPilotDetails((prev) =>
        prev.map((pilot) =>
          pilot.cms_id === updatedRow.cms_id ? updatedRow : pilot

        )
      );
      // getLocoPilotDetails(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating loco pilot:", error);
    }
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
      const response = await apiService("post",
        `${RAILWAY_CONST.API_ENDPOINT.CREW}/upload`,
        formData, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload successful:", response);
      setIsPopupVisible(false); // Close the popup on success
      getLocoPilotDetails(); // Refresh the list after upload
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleAddLocoPilot = async (data) => {
    try {
      const response = await apiService("post", `${RAILWAY_CONST.API_ENDPOINT.CREW}`, data);
      console.log("Loco Pilot added successfully:",data, response.data);
      setLocoPilotDetails((prev) => [...prev, response.data]); // Add the new pilot to the list
      setIsFormVisible(false);
      getLocoPilotDetails(); // Refresh the list after adding
    } catch (error) {
      console.error("Error adding loco pilot:", error);
    }
  };


  
  return (
    <>
      <div className="w-full bg-[#efefef] p-4  pt-8 min-h-screen">
        <div className="bg-white w-full sm:p-8 p-4 pt-4 rounded-[15px] min-h-[900px]">
          <h1 className="sm:text-[22px] text-[18px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
            Manage Loco Pilot
          </h1>
          
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
            <div className="w-full p-4 pt-4 flex justify-end items-center">
              <button className="bg-[#2c215d] text-white px-4 py-2 rounded-md"
                onClick={handleBulkUploadClick}>
                Bulk Upload
              </button>
              <button className="bg-[#2c215d] text-white px-4 py-2 rounded-md ml-2"
                onClick={() => setIsFormVisible(true)}>
                Add New Loco Pilot Details
              </button>
            </div>
          </div>

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
            globalFilterFields={["name", "cms_id", "designation", "emp_id", "mobile", 'email', 'nli']}
            className="mt-10"
            onRowEditComplete={onRowEditComplete}
          >
            <Column field="cms_id" header="LP CMS ID" sortable editor={(options) => textEditor(options)} />
            <Column field="name" header="LP Name" sortable editor={(options) => textEditor(options)} />
            <Column field="designation" header="Designation" sortable editor={(options) => textEditor(options)} />
            <Column field="email" header="Email" sortable editor={(options) => textEditor(options)} />
            <Column field="emp_id" header="Employee ID" sortable editor={(options) => textEditor(options)} />
            {/* <Column field="id" header="ID" sortable /> */}
            <Column field="mobile" header="Mobile" sortable editor={(options) => textEditor(options)} />
            <Column field="nli" header="Nomilated CLI" sortable editor={(options) => textEditor(options)} />
            <Column body={deleteButtonTemplate} style={{ width: "5%" }}/>
            <Column rowEditor={allowEdit} bodyStyle={{ textAlign: 'center' }}></Column>
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
              // icon="pi pi-times"
              onClick={() => setShowDialog(false)}
              className="p-button-text border:focus:none"
            />
            <Button
              label="Yes"
              // icon="pi pi-check"
              onClick={deleteLocoPilot}
              className="p-button-danger"
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
    </>
  );
};

export default ManageLocoPilot;
