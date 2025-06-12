import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const UpdateLocoPilotDetails = ({ visible, onClose, pilot, onSubmit }) => {
  const [formData, setFormData] = useState(pilot || {});
  
  useEffect(() => {
    if (pilot) {
      setFormData(pilot);
    }
  }, [pilot]);

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header="Edit Loco Pilot Details"
      modal
      footer={
        <div className="flex justify-end gap-4">
          <Button
           label="Cancel"
           className="p-button-text px-4 py-2 border-black border border-solid outline-none text-center" 
           onClick={onClose} />
          <Button
            label="Update"
            className="p-button-success bg-[#9b4b90] text-white px-4 py-2 rounded text-center"
            onClick={handleSubmit}
          />
        </div>
      }
      onHide={onClose}
    >
      <div className="flex flex-col">
        <label>CMS ID</label>
        <InputText
          name="cms_id"
          value={formData.cms_id || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 w-full"
        />
        <label>Name</label>
        <InputText
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 w-full"
        />
        <label>Designation</label>
        <InputText
          name="designation"
          value={formData.designation || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 w-full"
        />
        <label>Email</label>
        <InputText
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 w-full"
        />
        <label>Emp ID</label>
        <InputText
          name="emp_id"
          value={formData.emp_id || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 w-full"
        />
        <label>Mobile</label>
        <InputText
          name="mobile"
          value={formData.mobile || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 w-full"
        />
        <label>NLI</label>
        <InputText
          name="nli"
          value={formData.nli || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>
    </Dialog>
  );
};

export default UpdateLocoPilotDetails;
