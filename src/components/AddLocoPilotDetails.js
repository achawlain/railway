import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const AddLocoPilotPopup = ({ visible, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    cms_id: "",
    name: "",
    designation: "",
    email: "",
    emp_id: "",
    mobile: "",
    nli: "",
    // Default organization ID, can be changed as needed
  });

   useEffect(() => {
    if (!visible) {
      setFormData({
        name: "",
        designation: "",
        email: "",
        emp_id: "",
        mobile: "",
        nli: "",
      }); // Reset form when popup is closed
    }
  }, [visible]);

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
        <div className="flex justify-end gap-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            onClick={onClose}
            className="p-button-text px-4 py-2 border-black border border-solid outline-none text-center"
          />
          <Button
            label="Submit"
            icon="pi pi-check"
            onClick={handleFormSubmit}
            className="p-button-success bg-[#9b4b90] text-white px-4 py-2 rounded text-center"
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