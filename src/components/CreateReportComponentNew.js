import React, { useEffect, useState } from "react";
import FileDropzone from "./FileDropzone";

const CreateReportComponentNew = () => {
  const [formData, setFormData] = useState({
    title: "",
    station_file: null,
    isd_file: null,
    psr_file: null,
    tsr_file: null,
    gradient_file: null,
    speedo_file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileDrop = (name) => (acceptedFiles) => {
    setFormData((pre) => ({
      ...pre,
      [name]: acceptedFiles[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.speedo_file) {
      console.log("Speedo Data is required!");
      return;
    }
    setIsSubmitting(true);

    const submission = new FormData();
    submission.append("title", formData.title);
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        submission.append(key, formData[key]);
      }
    });

    console.log("formData", formData);
  };

  useEffect(() => {});
  return (
    <div className="w-full bg-[#efefef] p-4 reportGenerateBg pt-8 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-2 mb-4">
        <div className="bg-white w-full p-8 pt-2 rounded-[15px] min-h-[600px]">
          <h1 className="text-[22px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
            Create Report
          </h1>
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 bg-white rounded shadow"
          >
            <div className="mb-4">
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <FileDropzone
              label="Select Station"
              file={formData.station_file}
              onDrop={handleFileDrop("station_file")}
            />
            <FileDropzone
              label="ISD File"
              file={formData.isd_file}
              onDrop={handleFileDrop("isd_file")}
            />
            <FileDropzone
              label="Select PSR"
              file={formData.psr_file}
              onDrop={handleFileDrop("psr_file")}
            />
            <FileDropzone
              label="Select TSR"
              file={formData.tsr_file}
              onDrop={handleFileDrop("tsr_file")}
            />
            <FileDropzone
              label="Select Gradient"
              file={formData.gradient_file}
              onDrop={handleFileDrop("gradient_file")}
            />
            <FileDropzone
              label="Speedo Data"
              file={formData.speedo_file}
              onDrop={handleFileDrop("speedo_file")}
              required
            />

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReportComponentNew;
