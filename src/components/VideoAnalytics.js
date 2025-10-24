import React, { useState, useRef } from "react";

export default function VideoAnalytics() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState([]);
  const videoRef = useRef(null);

  // handle upload
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
    setClips([]);
  };

  // mock API call to detect drowsiness
  const analyzeVideo = async () => {
    if (!videoFile) return;
    setLoading(true);

    // Replace with your real API call:
    // const formData = new FormData();
    // formData.append("video", videoFile);
    // const res = await fetch("/api/drowsiness", { method: "POST", body: formData });
    // const data = await res.json();
    // setClips(data.clips);

    setTimeout(() => {
      // Mock data: start & end in seconds
      setClips([
        { start: 12, end: 20 },
        { start: 45, end: 55 },
        { start: 90, end: 98 },
      ]);
      setLoading(false);
    }, 2000);
  };

  const playClip = (start) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = start;
    videoRef.current.play();
  };

  return (
    <div className="w-full bg-[#efefef] min-h-screen p-4">
      <div className="bg-white w-full sm:p-8 p-4 rounded-[15px] min-h-[900px]">
        <h1 className="sm:text-[18px] flex justify-between text-[18px] rounded-[5px] bg-[#2A235A] text-white font-medium mb-4 px-3 py-3">
          Video Analytics
        </h1>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center mb-6">
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="mb-4"
          />
          {videoFile && (
            <button
              onClick={analyzeVideo}
              className="bg-[#2A235A] text-white px-4 py-2 rounded-md hover:bg-[#433A7A]"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Drowsiness"}
            </button>
          )}
        </div>

        {/* Video Preview */}
        {videoURL && (
          <div className="mb-6">
            <video
              ref={videoRef}
              src={videoURL}
              controls
              className="w-full rounded-md shadow-md"
            />
          </div>
        )}

        {/* Detected Clips */}
        {clips.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Detected Drowsiness Clips</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {clips.map((clip, idx) => (
                <button
                  key={idx}
                  onClick={() => playClip(clip.start)}
                  className="bg-gray-100 hover:bg-gray-200 border rounded-lg p-3 text-left shadow-sm"
                >
                  <p className="font-medium">Clip {idx + 1}</p>
                  <p className="text-sm text-gray-600">
                    {clip.start}s – {clip.end}s
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
