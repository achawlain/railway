import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../utils/apiService";
import RAILWAY_CONST from "../utils/RailwayConst";
import DashboardCardComponent from "./DashboardCardComponent";
import ErrorPopUpComponent from "./ErrorPopUpComponent";
import Loader from "./Loader"; // Import the Loader component
import TemplateCardComponents from "./TemplateCardComponents";

const TemplateComponent = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true); // State for loader
  const [errorPopupState, setErrorPopupState] = useState({
    isShow: false,
    message: "",
  });
  const [redirect, setRedirect] = useState("");
  useEffect(() => {
    gettemplates();
  }, []);

  const gettemplates = async () => {
    setLoading(true);
    try {
      const response = await apiService(
        "get",
        RAILWAY_CONST.API_ENDPOINT.TEMPLATE
      );
      setTemplates(
        Array.isArray(response.data) ? response.data : response.templates || []
      );
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
    setLoading(false);
  };

  const handleDeleteItem = (item) => {};
  const goToPdfView = (item) => {};

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="loader">
            <Loader />
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="w-full bg-[#efefef] p-4 reportGenerateBg pt-8 min-h-screen">
              <div className="max-w-full mx-auto px-2 mb-4">
                <div className="bg-white w-full p-8 pt-2 rounded-[15px]">
                  <h1 className="text-[22px] text-[#30424c] font-medium mb-8 border-b border-[#ccc] pb-2 relative pt-2">
                    Templates
                    {/* <Link to={RAILWAY_CONST.ROUTE.CREATE_REPORT}>
                      <span className="absolute top-2 right-0 flex flex-row sm:text-[18px] text-[14px] items-center justify-center text-[#30424c] hover:text-[#000]">
                        + Analyz New
                      </span>
                    </Link> */}
                  </h1>

                  <div className="listTable w-full flex flex-row flex-wrap mb-[50px]">
                    {templates.length > 0 ? (
                      templates.map((item) => (
                        <TemplateCardComponents
                          key={item.id}
                          item={item}
                          onDelete={handleDeleteItem}
                          onView={goToPdfView}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500">No templates available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ErrorPopUpComponent
            isErrorShow={errorPopupState.isShow}
            errorMessage={errorPopupState.message}
            redirect={redirect}
          />
        </>
      )}
    </>
  );
};

export default TemplateComponent;
