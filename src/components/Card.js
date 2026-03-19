import React, { useState, useEffect, useRef } from "react";
import deleteIcon from "../images/delete-icon.svg";
import detailIcon from '../images/share.png';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";   // ✅ added
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";

function Card({ id, org_name, email, phone, address, onUpdate, onDelete }) {

  const toastRef = useRef(null); // ✅ added

  const [orgDetails, setOrgDetails] = useState(null);
  const [orgList, setOrgList] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [editForm, setEditForm] = useState({
    org_name: org_name,
    email: email,
    phone: phone,
    address: address
  });

  useEffect(() => {
    setEditForm({
      org_name,
      email,
      phone,
      address
    });
  }, [org_name, email, phone, address]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchOrgDetails = async (id) => {
    try {
      const response = await apiService(
        "get",
        `${RAILWAY_CONST.API_ENDPOINT.ORGANISATION_NAME}${id}`
      );
      setOrgDetails(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {

    const formData = new FormData();

    formData.append("org_name", editForm.org_name);
    formData.append("email", editForm.email);
    formData.append("phone", editForm.phone);
    formData.append("address", editForm.address);

    try {
      const response = await apiService(
        "put",
        `${RAILWAY_CONST.API_ENDPOINT.ORGANISATION_UPDATE}/${id}`,
        formData
      );

      onUpdate(id, editForm);
      setShowEditPopup(false);

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ updated with toast
  const confirmDelete = async () => {
    await onDelete(id);

    toastRef.current.show({
      severity: "success",
      summary: "Deleted",
      detail: `Organisation "${org_name}" deleted`,
      life: 3000,
    });

    setShowDeletePopup(false);
  };

  if (!id && !org_name) return null;

  return (
    <>
      {/* ✅ Toast added */}
      <Toast ref={toastRef} position="top-right" />

      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">

          <div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">

            <p className="text-lg mb-6">
              Are you sure you want to delete this organisation
              <span className="font-semibold"> "{org_name}"</span>?
            </p>

            <div className="flex justify-end gap-4">

              {/* ✅ Cancel with toast */}
              <button
                onClick={() => {
                  setShowDeletePopup(false);

                  toastRef.current.show({
                    severity: "warn",
                    summary: "Cancelled",
                    detail: "Delete action cancelled",
                    life: 2000,
                  });
                }}
                className="px-5 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-[#9b4b90] text-white rounded-md"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      <div className="w-full max-w-[340px] bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#4b2a7a] to-[#9b4b90] text-white px-4 py-2 font-semibold">
          [{id}]
        </div>

        {/* Body */}
        <div className="p-4 text-gray-700 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">Name:</span>
            <span>{org_name}</span>
          </div>

          <div className="flex justify-between mt-2">
            <span className="font-semibold">Email:</span>
            <span>{email}</span>
          </div>

          <div className="flex justify-between mt-2">
            <span className="font-semibold">Phone:</span>
            <span>{phone}</span>
          </div>

          <div className="flex justify-between mt-2">
            <span className="font-semibold">Address:</span>
            <span
              className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]"
              title={address}
            >
              {address}
            </span>
          </div>
        </div>

        <hr className="border-t border-gray-200" />

        {/* Actions */}
        <div className="flex justify-between items-center px-6 py-3 bg-white">

          {/* Delete */}
          <button
            onClick={() => setShowDeletePopup(true)}
            className="flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <img src={deleteIcon} alt="Delete" className="w-5 h-5 mb-1" />
            <span className="text-[11px] text-gray-500 font-medium">Delete</span>
          </button>

          {/* Details */}
          <button
            onClick={() => {
              fetchOrgDetails(id);
            }}
            className="flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <img src={detailIcon} alt="Details" className="w-5 h-5 mb-1" />
            <span className="text-[11px] text-gray-500 font-medium">Details</span>
          </button>

          {/* Edit */}
          <Button
            onClick={() => setShowEditPopup(true)}
            type="button"
            icon="pi pi-pencil"
            label="Edit"
            className="flex flex-col items-center justify-center hover:bg-gray-50 transition-colors text-[11px] text-gray-500"
          />
        </div>

        {/* Edit Popup (same as before) */}
        {showEditPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

              <h2 className="text-lg font-semibold mb-4">Edit Organisation</h2>

              <input
                type="text"
                name="org_name"
                value={editForm.org_name}
                onChange={handleEditChange}
                className="w-full border p-2 mb-3 rounded"
              />

              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                className="w-full border p-2 mb-3 rounded"
              />

              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                className="w-full border p-2 mb-3 rounded"
              />

              <input
                type="text"
                name="address"
                value={editForm.address}
                onChange={handleEditChange}
                className="w-full border p-2 mb-4 rounded"
              />

              <div className="flex justify-end gap-3">

                <button
                  onClick={() => setShowEditPopup(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-[#9b4b90] text-white rounded"
                >
                  Update
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Card;