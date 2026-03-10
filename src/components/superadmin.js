 //http://127.0.0.1:5011/organisation/org_name
 
 import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiService } from "../utils/apiService";

function SuperAdmin() {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

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

  // GET ORGANIZATION CARDS
  const fetchOrganizations = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://127.0.0.1:5011/organisation/org_name");

      setData(response?.data?.data || []);

    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // GET ORGANIZATION LIST FOR DROPDOWN
  const fetchOrgList = async () => {
    try {

      const response = await axios.get("http://127.0.0.1:5011/organisation/org_name");

      setOrgList(response?.data?.data || []);

    } catch (error) {

      console.log("Error fetching organisations:", error);

    }
  };

  // ORGANIZATION INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // USER INPUT CHANGE
  const handleUserChange = (e) => {
    setUserFormData({
      ...userFormData,
      [e.target.name]: e.target.value
    });
  };

  // CREATE ORGANIZATION
  const handleSubmit = async () => {

 if (!formData.org_name) {
    alert("Organization Name is required");
    return;
  }

  if (!formData.email) {
    alert("Email is required");
    return;
  }

    try {

      setLoading(true);

      const data = new FormData();

      data.append("org_name", formData.org_name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("address", formData.address);

      const response = await axios.post(
        "http://127.0.0.1:5011/organisation/create_org",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Created:", response.data);

      fetchOrganizations();

      setFormData({
        org_name: "",
        email: "",
        phone: "",
        address: ""
      });

      setShowPopup(false);

    } catch (error) {

      console.log("Error creating organization:", error);

    } finally {

      setLoading(false);

    }
  };

  // CREATE USER
  const handleUserSubmit = async () => {


      if (!userFormData.username) {
    alert("Username is required");
    return;
  }

  if (!userFormData.name) {
    alert("Name is required");
    return;
  }

  if (!userFormData.email) {
    alert("Email is required");
    return;
  }

  if (!userFormData.password) {
    alert("Password is required");
    return;
  }
    if (userFormData.password !== userFormData.confirm_password) {
      alert("Password and Confirm Password do not match");
      return;
    }

    try {

      setLoading(true);

      const data = new FormData();

      data.append("username", userFormData.username);
      data.append("name", userFormData.name);
      data.append("email", userFormData.email);
      data.append("password", userFormData.password);
      data.append("confirm_password", userFormData.confirm_password);
      data.append("designation", userFormData.designation);
      data.append("role", userFormData.role);
      data.append("organisation", userFormData.organisation);

      const response = await axios.post(
        "http://127.0.0.1:5011/users/create_user",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("User Created:", response.data);

      setUserFormData({
        username: "",
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        designation: "",
        role: "",
        organisation: ""
      });

      setShowUserPopup(false);

    } catch (error) {

      console.log("Error creating user:", error);

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="pt-10 flex flex-col items-center gap-6">

      {/* Buttons */}
      <div className="flex gap-6">

        <button
          onClick={() => setShowUserPopup(true)}
          className="px-4 py-2 bg-[#220441] text-white rounded-lg hover:bg-[#56254f] transition duration-300"
        >
          New User
        </button>

        <button
          onClick={() => setShowPopup(true)}
          className="px-4 py-2 bg-[#9b4b90] text-white rounded-lg hover:bg-[#56254f] transition duration-300"
        >
          New Organization
        </button>

      </div>

      {/* Loader */}
      {loading && <p className="text-lg">Loading...</p>}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8">

  {data?.map((item, index) => {

    if (!item) return null;

    return (
      <Card
        key={item.id || index}
        id={item.id}
        org_name={item.org_name}
      />
    );

  })}

</div>

      {/* ORGANIZATION POPUP */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

          <div className="bg-white p-8 rounded-xl shadow-lg w-96">

            <h2 className="text-xl font-semibold mb-4">
              New Organization
            </h2>

            <input
              type="text"
              name="org_name"
              placeholder="Name"
              value={formData.org_name}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            />

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 mb-4 rounded"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#9b4b90] text-white rounded"
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}

      {/* USER POPUP */}
      {showUserPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

          <div className="bg-white p-8 rounded-xl shadow-lg w-96">

            <h2 className="text-xl font-semibold mb-4">
              New User
            </h2>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={userFormData.username}
              onChange={handleUserChange}
              className="w-full border p-2 mb-3 rounded"
               required
            />

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={userFormData.name}
              onChange={handleUserChange}
              className="w-full border p-2 mb-3 rounded"
               required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userFormData.email}
              onChange={handleUserChange}
              className="w-full border p-2 mb-3 rounded"
               required
            />

          <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={userFormData.password}
                onChange={handleUserChange}
                className="w-full border p-2 pr-10 mb-3 rounded"
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

         <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            placeholder="Confirm Password"
            value={userFormData.confirm_password}
            onChange={handleUserChange}
            className="w-full border p-2 pr-10 mb-3 rounded"
            required
          />

          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2 cursor-pointer"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </span>
        </div>

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={userFormData.designation}
              onChange={handleUserChange}
              className="w-full border p-2 mb-3 rounded"
            />

            <select
              name="role"
              value={userFormData.role}
              onChange={handleUserChange}
              className="w-full border p-2 mb-3 rounded"
            >
              <option value="">Select Role</option>
              <option value="0">SUPER ADMIN</option>
              <option value="1">USER</option>
              <option value="2">DATA COLLECTOR</option>
              <option value="3">ADMIN</option>
            </select>

            <select
              name="organisation"
              value={userFormData.organisation}
              onChange={handleUserChange}
              onClick={fetchOrgList}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="">Select Organization</option>

              {orgList.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.org_name}
                </option>
              ))}

            </select>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowUserPopup(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUserSubmit}
                className="px-4 py-2 bg-[#9b4b90] text-white rounded"
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function Card({ id, org_name }) {

  if (!id && !org_name) return null;

  return (
    <div className="w-full">

      <div className="bg-[#9b4b90] text-white shadow-lg rounded-2xl p-14 border border-gray-200 hover:shadow-2xl transition duration-300">

        <p className="text-lg mb-3">
          <span className="font-semibold">ID:</span> {id}
        </p>

        <p className="text-lg">
          <span className="font-semibold">Name:</span> {org_name}
        </p>

      </div>

    </div>
  );
}

export default SuperAdmin;