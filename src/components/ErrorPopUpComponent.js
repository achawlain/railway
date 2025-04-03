import React, { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";

const ErrorPopUpComponent = (props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isMessageShow, setIsMessageShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMessageShow(props.isErrorShow);
    setErrorMessage(props.errorMessage);
    // console.log("errrrror message", props.isMessageShow);
  }, [props]);

  const redirectOrClosePopup = () => {
    if (props.redirect) {
      navigate(props.redirect);
    } else {
      setIsMessageShow(false);
    }
  };

  return (
    <div>
      {isMessageShow && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-[99]">
          <div className="bg-white p-6 rounded shadow-md text-center min-w-[600px]">
            <h2 className="text-xl mb-4">Error</h2>
            <div className="text-red-500 text-sm mt-2 mb-[20px]">
              {errorMessage}
            </div>
            <button
              onClick={() => redirectOrClosePopup()}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorPopUpComponent;
