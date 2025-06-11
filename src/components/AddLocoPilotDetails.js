import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const AddLocoPilotPopup = ({ visible, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    cms_id: "",
    designation: "",
    email: "",
    emp_id: "",
    mobile: "",
    name: "",
    nli: "",
    // Default organization ID, can be changed as needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    const formDataObject = new FormData();
  Object.keys(formData).forEach((key) => {
    formDataObject.append(key, formData[key]);
  });
  onSubmit(formDataObject);
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header="Add New Loco Pilot Details"
      modal
      footer={
        <>
        <div className="flex justify-end gap-2 ">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={onClose}
            className="p-button-text"
          />
          <Button
            label="Submit"
            icon="pi pi-check"
            onClick={handleFormSubmit}
            className="p-button-success"
          />
          </div>
        </>
      }
      onHide={onClose}
    >
      <div className="p-fluid">
        {Object.keys(formData).map((key) => (
          <div className="field" key={key}>
            <label htmlFor={key}>{key.replace(/_/g, " ").toUpperCase()}</label>
            <InputText
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
               // Disable org_id field
               // Make org_id read-only
            />
          </div>
        ))}
      </div>
    </Dialog>
  );
};
export default AddLocoPilotPopup;