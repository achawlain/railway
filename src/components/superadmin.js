import React, { useState, useEffect } from "react";
import axios from "axios";

function SuperAdmin() {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    org_name: "",
    email: "",
    phone: "",
    address: ""
  });

  // GET API
  const fetchOrganizations = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:5011/organisation/org_name"
      );

      // null safety
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

  // input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // POST API
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5011/organisation/create_org",
        formData
      );

      console.log("Created:", response.data);

      // refresh list after create
      fetchOrganizations();

      // reset form
      setFormData({
        org_name: "",
        email: "",
        phone: "",
        address: ""
      });

      // close popup
      setShowPopup(false);

    } catch (error) {
      console.log("Error creating organization:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-10 flex flex-col items-center gap-6">

      {/* Buttons */}

      <div className="flex gap-6">

        <button className="px-4 py-2 bg-[#9b4b90] text-white rounded-lg hover:bg-[#56254f] transition duration-300">
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

      <div className="flex flex-wrap justify-center">

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

      {/* Popup */}

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
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
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

    </div>
  );
}

function Card({ id, org_name }) {

  if (!id && !org_name) return null;

  return (
    <div className="m-5">

      <div className="max-w-sm bg-[#9b4b90] text-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition duration-300">

        <p>
          <span className="font-semibold">ID:</span> {id}
        </p>

        <p>
          <span className="font-semibold">Name:</span> {org_name}
        </p>

      </div>

    </div>
  );
}

export default SuperAdmin;