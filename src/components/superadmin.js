import React, { useState, useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import Card from "../components/Card";
import OrgPopup from "../components/OrgPopUp";
import UserPopup from "../components/UserPopUp";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import loader from "./Loader";

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
    <div className="flex flex-col items-center gap-6">

      <AdminHeader
        setShowPopup={setShowPopup}
        setShowUserPopup={setShowUserPopup}
      />

      {loading && (
        <div className="flex justify-center py-10">
          <loader />
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6 p-6">
        {data.map(item => (
          <Card
            key={item.id}
            {...item}
            onDelete={deleteOrg}
            onUpdate={updateOrg}
          />
        ))}
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