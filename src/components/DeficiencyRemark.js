import React, { useState } from "react";

const DeficiencyRemark = () => {
  const [formData, setFormData] = useState({
    deficiency: "",
    remark: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="w-full mx-auto mt-8 p-6 bg-white ">
      <h2 className="text-xl font-semibold mb-4 text-center ">
        Deficiency and Remark
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Deficiency
          </label>
          <textarea
            type="text"
            name="deficiency"
            value={formData.deficiency}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter deficiency"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Remark</label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter remarks"
            required
          ></textarea>
        </div>
      </form>
    </div>
  );
};

export default DeficiencyRemark;
