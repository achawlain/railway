import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import OrgPopup from "../components/OrgPopUp";
import UserPopup from "../components/UserPopUp";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";

function SuperAdmin() {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [orgList, setOrgList] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    org_name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [userFormData, setUserFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    designation: "",
    role: "",
    organisation: ""
  });

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.ORGANISATION_NAME
      );
      setData(response?.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrgList = async () => {
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.ORGANISATION_NAME
      );
      setOrgList(response?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrg = async (id) => {
    try {
      await apiService(
        "delete",
        `${RAILWAY_CONST.API_ENDPOINT.ORGANISATION_DELETE}/${id}`
      );
      setData(prev => prev.filter(org => org.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrg = (id, updatedData) => {
    setData(prev =>
      prev.map(org =>
        org.id === id ? { ...org, ...updatedData } : org
      )
    );
  };

  const handleSubmit = async () => {

    if (!formData.org_name || !formData.email) {
      alert("Required fields missing");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(formData).forEach(key =>
        data.append(key, formData[key])
      );

      await apiService(
        "post",
        RAILWAY_CONST.API_ENDPOINT.CREATE_ORGANISATION,
        data
      );

      fetchOrganizations();
      setShowPopup(false);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async () => {

    if (userFormData.password !== userFormData.confirm_password) {
      alert("Password mismatch");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(userFormData).forEach(key =>
        data.append(key, userFormData[key])
      );

      await apiService(
        "post",
        RAILWAY_CONST.API_ENDPOINT.CREATE_USER,
        data
      );

      setShowUserPopup(false);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4b2a7a] to-[#9b4b90] p-6">

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      <div className="w-full bg-white rounded-2xl shadow-xl p-6 mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-6 gap-4">

          <h1 className="text-[18px] text-[#30424c] font-medium">
            Admin Portal
          </h1>

          <div className="flex flex-wrap gap-4 md:gap-10">
            <button
              onClick={() => setShowUserPopup(true)}
              className="sm:text-[16px] text-[16px] font-medium text-[#30424c] hover:text-[#9b4b90] transition"
            >
              + Add New User
            </button>

            <button
              onClick={() => setShowPopup(true)}
              className="sm:text-[16px] text-[16px] font-medium text-[#30424c] hover:text-[#9b4b90] transition"
            >
              + Add New Organisation
            </button>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {data.map(item => (
            <Card
              key={item.id}
              {...item}
              onDelete={deleteOrg}
              onUpdate={updateOrg}
            />
          ))}
        </div>
      </div>
      
      <OrgPopup
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />

      <UserPopup
        showUserPopup={showUserPopup}
        setShowUserPopup={setShowUserPopup}
        userFormData={userFormData}
        setUserFormData={setUserFormData}
        handleUserSubmit={handleUserSubmit}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        orgList={orgList}
        fetchOrgList={fetchOrgList}
      />
    </div>
  );
}

export default SuperAdmin;