import React from "react";
import eamilIcon from "../images/email.webp";
import productIcon from "../images/productIcon.webp";
import locationIcon from "../images/location.webp";
import pdfIcon from "../images/pdfIcon.svg";
import googlePayIcon from "../images/googlePayIcon.png";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="footerBoxMain">
        <div className="footerBox">
          <div className="footerFormBox">
            <div className="emailPhoneInfo">
              <div className="footerInputBox emailCol">
                <p className="footerLocationIcon">
                  <img src={eamilIcon} alt="" width="33" height="25" />
                </p>
                <div>
                  <p className="footerEmailTitle">Mail to Us At</p>
                  <a
                    className="footerEmail"
                    href='mailto:"connect@orryworx.com"'
                  >
                    connect@orryworx.com
                  </a>
                </div>
              </div>
              <div className="footerInputBox emailCol">
                <p className="footerLocationIcon">
                  <img
                    src={productIcon}
                    alt=""
                    height="25"
                    style={{ height: "auto" }}
                  />
                </p>
                <div>
                  <p className="footerEmailTitle">Product of</p>
                  <a
                    className="footerEmail"
                    href="https://orryworx.com/"
                    target="_blank"
                  >
                    www.orryworx.com
                  </a>
                </div>
              </div>
              {/* <div className="footerInputBox phonCol">
              <p className="footerLocationIcon">
                <img
                  title="call icon"
                  src={phoneIcon}
                  alt=""
                  width="51"
                  height="47"
                />
              </p>
              <div>
                <p className="footerPhoneTitle">Phone Number</p>
                <a className="footerPhone" href="tel:91 (991) 110 8696">
                  +91 (991) 110 8696
                </a>
              </div>
            </div> */}
            </div>
            <div className="footerInputBox addressCol">
              <p className="footerLocationIcon">
                <img
                  title="Location icon"
                  src={locationIcon}
                  alt=""
                  width="51"
                  height="51"
                />
              </p>
              <div>
                <p className="footerLocationTitle">Gurugram</p>
                <p className="footerLocation">
                  Plot No. 1038, Sector 40 Gurugram (HR), 122001
                </p>
              </div>
            </div>

            <div className="socialMediaLink">
              {" "}
              <a
                href="/RailPlot.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="reportGenerateBg text-white px-4 py-2 flex flex-row  items-center max-w-[270px]"
              >
                <img
                  title="Location icon"
                  src={pdfIcon}
                  alt=""
                  width="28"
                  className="mr-2"
                />{" "}
                View RailPlot Presentation
              </a>
            </div>
          </div>
          <div className="subFooterBox">
            <p>© 2025 Orryworx | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
