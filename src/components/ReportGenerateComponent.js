import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  useMemo,
  Suspense,
} from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation, useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  // halteTableData,
  halteTableTitle,
  previousAnalysisData,
  previousAnalysisTitle,
  TSRTableData,
  TSRTableTitle,
  speedTestTableTitle,
  speedTestTableData,
} from "../utils/tableData";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import {
  getDataFromLocalStorage,
  setDataOnLocalStorage,
} from "../utils/localStorage";
import ShowMessagePopUp from "./ShowMessagePopUp";

// Lazy load components
const ReportTable = lazy(() => import("./ReportTable"));
const TableComponent = lazy(() => import("./TableComponent"));
const SpeedGraphComponent = lazy(() => import("./SpeedGraphComponent"));
const DeficiencyRemark = lazy(() => import("./DeficiencyRemark"));
const Loader = lazy(() => import("./Loader"));
const UploadFilePopup = lazy(() => import("./UploadFilePopup"));

const ReportGenerateComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { deficiency, remark } = location.state || {};
  const [currentReport, setCurrentReport] = useState(
    getDataFromLocalStorage("currentReport")
  );
  const contentRef = useRef(null);
  const [haltStation, setHaltStation] = useState({});
  const [fullFormData, setFullFormData] = useState({
    id: id,
    train_id: "",
    load: "",
    bmbs: "",
    loco_no: "",
    spm: "",
    deficiency: "",
    remark: "",
  });
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [halteTableData, setHalteTableData] = useState(null);
  const [formData, setFormData] = useState({
    dateofWorking: "",
    trainNo: "",
  });
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [error, setError] = useState("");

  const handleFormChange = useCallback((updatedData) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
  }, []);

  // const handleDownloadPDF = async () => {
  //   setLoading(true);
  //   console.log("loading");
  //   if (contentRef.current) {
  //     const input = contentRef.current;
  //     const downloadButton = document.getElementById("downloadPdfButton");
  //     if (downloadButton) downloadButton.style.display = "none";

  //     const boderBottom = document.getElementById("sectionTitle");
  //     if (boderBottom) boderBottom.classList.remove("border-b");

  //     const backButton = document.getElementById("backButton");
  //     if (backButton) backButton.style.display = "none";
  //     const submitButon = document.getElementById("submitButon");
  //     if (submitButon) submitButon.style.display = "none";
  //     const pdfLogo = document.getElementById("pdfLogo");
  //     if (pdfLogo) pdfLogo.style.display = "flex";
  //     document.querySelectorAll("input, select, textarea").forEach((el) => {
  //       el.style.border = "0";
  //       if (el.hasAttribute("readonly")) {
  //         el.style.background = "white";
  //       }
  //     });

  //     html2canvas(input, { scale: 2, useCORS: true, logging: false }).then(
  //       (canvas) => {
  //         const imgData = canvas.toDataURL("image/png");
  //         const pdf = new jsPDF("p", "mm", "a4");

  //         let position = 0;
  //         let remainingHeight = (canvas.height * 210) / canvas.width;

  //         while (remainingHeight > 0) {
  //           pdf.addImage(
  //             imgData,
  //             "PNG",
  //             0,
  //             position,
  //             210,
  //             (canvas.height * 210) / canvas.width
  //           );
  //           remainingHeight -= 297;
  //           position -= 297;
  //           if (remainingHeight > 0) pdf.addPage();
  //         }

  //         pdf.save("download.pdf");
  //         setLoading(false);
  //         if (downloadButton) downloadButton.style.display = "block";
  //         if (pdfLogo) pdfLogo.style.display = "none";
  //         if (backButton) backButton.style.display = "inline-block";
  //         if (submitButon) submitButon.style.display = "inline-block";
  //         if (boderBottom) boderBottom.classList.add("border-b");
  //         document.querySelectorAll("input, select, textarea").forEach((el) => {
  //           el.style.border = "1px solid #e5e7eb";
  //           if (el.hasAttribute("readonly")) {
  //             el.style.background = "#f3f4f6";
  //           }
  //         });
  //       }
  //     );
  //   }
  //   //  setLoading(false);
  // };

  const handleDownloadPDF = async () => {
    setLoading(true);
    const downloadButton = document.getElementById("downloadPdfButton");
    const borderBottom = document.getElementById("sectionTitle");
    const backButton = document.getElementById("backButton");
    const submitButton = document.getElementById("submitButon");
    const pdfLogo = document.getElementById("pdfLogo");
    const grayBgDivs = document.querySelectorAll(".grayBg");

    // Hide/show elements
    if (downloadButton) downloadButton.style.display = "none";
    if (borderBottom) borderBottom.classList.remove("border-b");
    if (backButton) backButton.style.display = "none";
    if (submitButton) submitButton.style.display = "none";
    if (pdfLogo) pdfLogo.style.display = "flex";

    grayBgDivs.forEach((div) => {
      div.classList.remove("bg-gray-100");
    });

    // Store original textareas and replace with divs
    const textareaReplacements = [];
    document.querySelectorAll("textarea").forEach((textarea) => {
      // Store the original textarea reference
      textareaReplacements.push({
        original: textarea,
        parent: textarea.parentNode,
        nextSibling: textarea.nextSibling,
      });

      // Create replacement div
      const div = document.createElement("div");
      div.textContent = textarea.value;
      div.style.whiteSpace = "pre-wrap";
      div.style.padding = "8px";
      div.style.borderRadius = "4px";
      //div.style.border = "1px solid #e5e7eb"; // Match textarea border
      div.style.minHeight = "100px"; // Match typical textarea height
      div.style.width = "100%"; // Match textarea width

      // Replace textarea with div
      textarea.parentNode.replaceChild(div, textarea);
    });

    document.querySelectorAll("input, select, textarea").forEach((el) => {
      el.style.border = "0";
      if (el.hasAttribute("readonly")) {
        el.style.background = "white";
      }
    });

    const pdf = new jsPDF("p", "mm", "a4");

    try {
      const firstPart = document.getElementById("pdf-first-part");
      const speedGraphPart = document.getElementById("pdf-speed-graph");

      if (firstPart) {
        const canvas1 = await html2canvas(firstPart, {
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const imgData1 = canvas1.toDataURL("image/png");

        pdf.addImage(
          imgData1,
          "PNG",
          0,
          0,
          210,
          (canvas1.height * 210) / canvas1.width
        );
      }

      if (speedGraphPart) {
        pdf.addPage();
        const canvas2 = await html2canvas(speedGraphPart, {
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const imgData2 = canvas2.toDataURL("image/png");

        pdf.addImage(
          imgData2,
          "PNG",
          0,
          0,
          210,
          (canvas2.height * 210) / canvas2.width
        );
      }

      pdf.save("download.pdf");
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      // Restore original textareas
      textareaReplacements.forEach(({ original, parent, nextSibling }) => {
        const currentDiv = parent.querySelector("div");
        if (currentDiv) {
          if (nextSibling) {
            parent.insertBefore(original, nextSibling);
          } else {
            parent.appendChild(original);
          }
          parent.removeChild(currentDiv);
        }
      });

      setLoading(false);

      if (downloadButton) downloadButton.style.display = "block";
      if (borderBottom) borderBottom.classList.add("border-b");
      if (backButton) backButton.style.display = "inline-block";
      if (submitButton) submitButton.style.display = "inline-block";
      if (pdfLogo) pdfLogo.style.display = "none";

      grayBgDivs.forEach((div) => {
        div.classList.add("bg-gray-100");
      });

      document.querySelectorAll("input, select, textarea").forEach((el) => {
        el.style.border = "1px solid #e5e7eb";
        if (el.hasAttribute("readonly")) {
          el.style.background = "#f3f4f6";
        }
      });
    }
  };

  const halteTable = useMemo(
    () => ({ data: halteTableData, columns: halteTableTitle }),
    [halteTableData, halteTableTitle]
  );

  const previousAnalysis = useMemo(
    () => ({ data: previousAnalysisData, columns: previousAnalysisTitle }),
    []
  );

  const TSRTable = useMemo(
    () => ({ data: TSRTableData, columns: TSRTableTitle }),
    []
  );

  const speedTestTable = useMemo(
    () => ({ data: speedTestTableData, columns: speedTestTableTitle }),
    []
  );

  // useEffect(() => {
  //   const fetchHaltData = async () => {
  //     await getHaltTableData(false);
  //   };
  //   fetchHaltData();
  // }, []);

  // useEffect(() => {
  //   getHaltTableData(true);
  // }, [haltStation]);

  useEffect(() => {
    getHaltTableData(!!haltStation?.from && !!haltStation?.to);
  }, [haltStation]);

  const getHaltTableData = async (limitedHaltStation) => {
    // if (currentReport?.speed_before_1000m) {

    // }
    const url =
      limitedHaltStation && haltStation && haltStation.from && haltStation.to
        ? `${RAILWAY_CONST.API_ENDPOINT.REPORTS}/${id}${RAILWAY_CONST.API_ENDPOINT.STAT_SPEED_BEFORE_HALT}?from_station=${haltStation.from}&to_station=${haltStation.to}`
        : `${RAILWAY_CONST.API_ENDPOINT.REPORTS}/${id}${RAILWAY_CONST.API_ENDPOINT.STAT_SPEED_BEFORE_HALT}`;
    try {
      const response = await apiService("get", url);
      setHalteTableData(response.data);
      // setDataOnLocalStorage("reportList", response);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const handleHaltSelectedData = (fromStation, toStation) => {
    setHaltStation({ from: fromStation, to: toStation });
  };

  const handleformData = (data, label) => {
    if (label === "allFields") {
      setFullFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        train_id: data.trainNo || prev.train_id,
        load: data.load || prev.load,
        bmbs: data.bmbs || prev.bmbs,
        loco_no: data.locoNo || prev.loco_no,
        spm: data.spm || prev.spm,
        analyzed_by: data.analyzedBy || prev.analyzed_by,
        lp_cms_id: data.lpCMSID || prev.lp_cms_id,
        nominated_cli: data.nominatedCLI || prev.nominated_cli,
        crew_designation: data.designation || prev.crew_designation,
        crew_name: data.lp || prev.crew_name,
      }));
    }
    if (label === "redmarkDeficiency") {
      setFullFormData((prev) => ({
        ...prev,
        deficiency: data.deficiency || prev.deficiency,
        remark: data.remark || prev.remark,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiService(
        "PUT",
        RAILWAY_CONST.API_ENDPOINT.REPORTS,
        fullFormData
      );
      navigate(RAILWAY_CONST.ROUTE.DASHBOARD);
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loaderingView">
          <div className="loaderPdf">
            <div className="loader">
              <Loader />
            </div>
          </div>
        </div>
      )}
      <div
        ref={contentRef}
        className="w-full bg-[#efefef] p-4 reportGenerateBg reportGenerateMain pt-8 min-h-screen"
      >
        <div id="pdf-first-part">
          <Suspense
            fallback={
              <div className="loader">
                <Loader />
              </div>
            }
          >
            <ReportTable
              onFormChange={handleFormChange}
              handleHaltSelectedData={handleHaltSelectedData}
              handleDownloadPDF={handleDownloadPDF}
              handleformData={handleformData}
              currentReport={currentReport}
            />
          </Suspense>

          {/* {currentReport.speed_before_1000m ? (
            <div className="max-w-full mx-auto px-2 mb-4">
              <div className="bg-white w-full p-8 pt-2 rounded-[15px]">
                <Suspense fallback={<div>Loading table...</div>}>
                  <TableComponent
                    data={halteTable.data}
                    colums={halteTable.columns}
                    tableTitle={"Speed From 1000 m in rear of halts"}
                  />
                </Suspense>
              </div>
            </div>
          ) : null} */}
          <div className="max-w-full mx-auto sm:px-2 px-0 mb-4">
            <div className="bg-white w-full sm:p-8 p-4 pt-2 rounded-[15px]">
              <Suspense fallback={<div>Loading table...</div>}>
                <TableComponent
                  data={halteTable.data}
                  colums={halteTable.columns}
                  tableTitle={"Speed From 1000 m in rear of halts"}
                />
              </Suspense>
            </div>
          </div>
        </div>
        <div id="pdf-speed-graph">
          <div className="max-w-full mx-auto px-2 mb-4">
            <div className="bg-white w-full sm:p-8 p-2 sm:pb-16 pb-4 rounded-[15px]">
              <Suspense
                fallback={
                  <div className="loader">
                    <Loader />
                  </div>
                }
              >
                <SpeedGraphComponent
                  haltStation={haltStation}
                  speed_before_1000m={currentReport.speed_before_1000m}
                />
              </Suspense>
            </div>
          </div>

          <div className="max-w-full mx-auto px-2 mb-4">
            <div className="bg-white w-full  sm:p-8 p-2 pb-16 rounded-[15px]">
              <Suspense fallback={<div>Loading deficiency remarks...</div>}>
                <DeficiencyRemark
                  handleformData={handleformData}
                  deficiency={currentReport.deficiency}
                  remark={currentReport.remark}
                />
              </Suspense>
              <div className="w-full justify-center items-center flex">
                <button
                  id="submitButon"
                  className="px-4 reportGenerateBg bg-blue-600 text-white rounded hover:bg-blue-700 py-1 inline-block"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        {showUploadBox && (
          <Suspense
            fallback={
              <Suspense fallback={<Loader />}>
                <Loader />
              </Suspense>
            }
          >
            <UploadFilePopup onClose={() => setShowUploadBox(false)} />
          </Suspense>
        )}
        {popup.show && (
          <ShowMessagePopUp
            message={popup.message}
            type={popup.type}
            onClose={() => setPopup({ show: false, message: "", type: "" })}
          />
        )}
      </div>
    </>
  );
};

export default ReportGenerateComponent;
