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
import { setDataOnLocalStorage } from "../utils/localStorage";

// Lazy load components
const ReportTable = lazy(() => import("./ReportTable"));
const TableComponent = lazy(() => import("./TableComponent"));
const SpeedGraphComponent = lazy(() => import("./SpeedGraphComponent"));
const DeficiencyRemark = lazy(() => import("./DeficiencyRemark"));
const Loader = lazy(() => import("./Loader"));
const UploadFilePopup = lazy(() => import("./UploadFilePopup"));

const ReportGenerateComponent = () => {
  const contentRef = useRef(null);
  const [haltStation, setHaltStation] = useState({});
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [halteTableData, setHalteTableData] = useState(null);
  const [formData, setFormData] = useState({
    dateofWorking: "",
    trainNo: "",
  });

  const { id } = useParams();
  const location = useLocation();
  const { date, train_id, title, speed_before_1000m, lp_cms_id } =
    location.state || {};
  // const handleFormChange = useCallback((updatedData) => {
  //   setFormData((prev) => {
  //     const newData = { ...prev, ...updatedData };

  //     if (
  //       newData.trainNo !== "" &&
  //       newData.trainNo !== "123456" &&
  //       newData.trainNo.length > 5 &&
  //       newData.dateOfWorking
  //     ) {
  //       setShowUploadBox(true);
  //     } else {
  //       setShowUploadBox(false);
  //     }

  //     return newData;
  //   });
  // }, []);

  const handleFormChange = useCallback((updatedData) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
  }, []);

  const shouldShowUploadBox = useMemo(() => {
    return (
      formData.trainNo !== "" &&
      formData.trainNo !== "NSFTIAFAS" &&
      formData.trainNo.length > 5
    );
  }, [formData.trainNo, formData.dateOfWorking]);

  useEffect(() => {
    setShowUploadBox(shouldShowUploadBox);
  }, [shouldShowUploadBox]);

  const handleDownloadPDF = async () => {
    setLoading(true);
    console.log("loading");
    if (contentRef.current) {
      const input = contentRef.current;
      const downloadButton = document.getElementById("downloadPdfButton");
      if (downloadButton) downloadButton.style.display = "none";
      const backButton = document.getElementById("backButton");
      if (backButton) backButton.style.display = "none";
      const pdfLogo = document.getElementById("pdfLogo");
      if (pdfLogo) pdfLogo.style.display = "flex";
      document.querySelectorAll("input, select").forEach((el) => {
        el.style.border = "0";
      });

      html2canvas(input, { scale: 2, useCORS: true, logging: false }).then(
        (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          let position = 0;
          let remainingHeight = (canvas.height * 210) / canvas.width;

          while (remainingHeight > 0) {
            pdf.addImage(
              imgData,
              "PNG",
              0,
              position,
              210,
              (canvas.height * 210) / canvas.width
            );
            remainingHeight -= 297;
            position -= 297;
            if (remainingHeight > 0) pdf.addPage();
          }

          pdf.save("download.pdf");
          setLoading(false);
          if (downloadButton) downloadButton.style.display = "block";
          if (pdfLogo) pdfLogo.style.display = "none";
          if (backButton) backButton.style.display = "inline-block";
          document.querySelectorAll("input, select").forEach((el) => {
            el.style.border = "1px solid #e5e7eb";
          });
        }
      );
    }
    //  setLoading(false);
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
    if (speed_before_1000m) {
      const url =
        limitedHaltStation && haltStation && haltStation.from && haltStation.to
          ? `${RAILWAY_CONST.API_ENDPOINT.STAT_SPEED_BEFORE_HALT}?id=${id}&from_station=${haltStation.from}&to_station=${haltStation.to}`
          : `${RAILWAY_CONST.API_ENDPOINT.STAT_SPEED_BEFORE_HALT}?id=${id}`;
      try {
        const response = await apiService("get", url);
        console.log("/response", response);
        setHalteTableData(response);
        // setDataOnLocalStorage("reportList", response);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }
  };

  const handleHaltSelectedData = (fromStation, toStation) => {
    setHaltStation({ from: fromStation, to: toStation });
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
        className="w-full bg-[#efefef] p-4 reportGenerateBg pt-8 min-h-screen"
      >
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
            title={title}
            lp_cms_id={lp_cms_id}
          />
        </Suspense>

        {/* {formData.trainNo === "NSFTIAFAS" && formData.dateOfWorking && ( */}
        {formData.trainNo === "NSFTIAFAS" && (
          <>
            {speed_before_1000m ? (
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
            ) : null}

            <div className="max-w-full mx-auto px-2 mb-4">
              <div className="bg-white w-full p-8 pb-16 rounded-[15px]">
                <Suspense
                  fallback={
                    <div className="loader">
                      <Loader />
                    </div>
                  }
                >
                  <SpeedGraphComponent
                    haltStation={haltStation}
                    speed_before_1000m={speed_before_1000m}
                  />
                </Suspense>
              </div>
            </div>
            {/* <div className="max-w-full mx-auto px-2 mb-4">
              <div className="bg-white w-full p-8 pb-16 rounded-[15px]">
                <div className="w-full flex flex-row justify-between">
                  <div className="w-[40%]">
                    <Suspense fallback={<div>Loading analysis...</div>}>
                      <TableComponent
                        data={previousAnalysis.data}
                        colums={previousAnalysis.columns}
                        tableTitle={"Previous Analysis for The LP- 10 Of 20"}
                      />
                    </Suspense>
                  </div>
                  <div className="w-[55%]">
                    <div className="w-full">
                      <Suspense fallback={<div>Loading TSR...</div>}>
                        <TableComponent
                          data={TSRTable.data}
                          colums={TSRTable.columns}
                          tableTitle={"TSR FOR THE DAY "}
                        />
                      </Suspense>
                    </div>
                    <div className="w-full">
                      <Suspense fallback={<div>Loading speed test...</div>}>
                        <TableComponent
                          data={speedTestTable.data}
                          colums={speedTestTable.columns}
                          tableTitle={""}
                        />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="max-w-full mx-auto px-2 mb-4">
              <div className="bg-white w-full p-8 pb-16 rounded-[15px]">
                <Suspense fallback={<div>Loading deficiency remarks...</div>}>
                  <DeficiencyRemark />
                </Suspense>
              </div>
            </div>
          </>
        )}
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
      </div>
    </>
  );
};

export default ReportGenerateComponent;
