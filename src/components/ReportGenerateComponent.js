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

  const handleDownloadPDF = () => {
    setLoading(true);
    if (contentRef.current) {
      const input = contentRef.current;
      const downloadButton = document.getElementById("downloadPdfButton");
      if (downloadButton) downloadButton.style.display = "none";

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
        }
      );
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

  useEffect(() => {
    const fetchHaltData = async () => {
      await getHaltTableData();
    };
    fetchHaltData();
  }, []);

  const getHaltTableData = async () => {
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.STAT_SPEED_BEFORE_HALT
      );
      console.log("/response", response);
      setHalteTableData(response);
    } catch (error) {
      console.error("Error fetching chart data:", error);
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
            <Suspense fallback={<Loader />}>
              <Loader />
            </Suspense>
          </div>
        </div>
      )}
      <div
        ref={contentRef}
        className="w-full bg-[#efefef] p-4 reportGenerateBg pt-8 min-h-screen"
      >
        <div className="max-w-full mx-auto px-2 mb-4">
          <div className="bg-white w-full p-8 pb-16 rounded-[15px] relative">
            <button
              className="bg-[#2c215d] h-[32px] w-[120px] text-white absolute right-8"
              onClick={handleDownloadPDF}
              id="downloadPdfButton"
            >
              Download PDF
            </button>
            <Suspense fallback={<div>Loading form...</div>}>
              <ReportTable
                onFormChange={handleFormChange}
                handleHaltSelectedData={handleHaltSelectedData}
              />
            </Suspense>
          </div>
        </div>
        {/* {formData.trainNo === "NSFTIAFAS" && formData.dateOfWorking && ( */}
        {formData.trainNo === "NSFTIAFAS" && (
          <>
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
            <div className="max-w-full mx-auto px-2 mb-4">
              <div className="bg-white w-full p-8 pb-16 rounded-[15px]">
                <Suspense fallback={<div>Loading graph...</div>}>
                  <SpeedGraphComponent haltStation={haltStation} />
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
