import React, { useState } from "react";
import { Link } from "react-router-dom";
import banner from "../../src/images/bannerRailwayN.png";
import sideBanner from "../../src/images/railwaySideBanner.png";
import sideBanner2 from "../../src/images/railwaySideBanner2.png";
import DemoRequestForm from "../components/DemoRequestForm";

const HomeComponent = () => {
  const [showDemoForm, setShowDemoForm] = useState(false);
  return (
    <div>
      <div className="bannerTitle  w-full block max-w-[1080px] mx-auto pt-[250px] p-[50px] pt-[0px] text-white absolute z-[11]">
        <h1 className="text-[56px] pb-[15px] text-[#fff]">
          Powerful Data Analytics for Railways
        </h1>
        <p className="max-w-[675px] text-[17px] mb-[15px]">
          Analyze, improve, and guide loco pilots with real-time insights for
          safer, more efficient railway operations across India.
        </p>
        <div>
          <span
            onClick={() => setShowDemoForm(true)}
            id="getStartedButton"
            className=" cursor-pointer reportGenerateBg rounded-[4px] text-[#fff] sm:text-[16px] text-[14px] sm:px-[15px] px-[12px] py-[8px] sm:py-[15px] inline-block mt-[20px]"
          >
            REQUEST A DEMO
          </span>
        </div>
      </div>
      <div className="w-full">
        <div className="banner">
          <img src={banner} className="w-full" />
        </div>
      </div>
      <div className="w-full">
        <div className="max-w-[1200px] w-full mx-auto my-[80px]">
          <div className="w-full powerfulDataBox">
            {/* <h3 className="text-[34px] font-semibold">
              Powerful Data Analytics for Railways
            </h3> */}
            <div className="w-full flex flex-row">
              <div className="w-[60%] pr-[20px]">
                <ul>
                  <li>
                    <h4 className="text-[24px] text-[#9b4b90]">
                      Speed-Time Graphs
                    </h4>
                    <p>
                      Visualize loco speed trends to monitor operational
                      efficiency and punctuality with precise real-time data
                      tracking.
                    </p>
                  </li>
                  <li>
                    <h4 className="text-[24px] text-[#9b4b90]">
                      Braking Profile Analysis
                    </h4>
                    <p>
                      Analyze braking patterns to enhance safety and optimize
                      braking efficiency, reducing wear and increasing train
                      stability.
                    </p>
                  </li>
                  <li>
                    <h4 className="text-[24px] text-[#9b4b90]">
                      Guideline Violation Detection
                    </h4>
                    <p>
                      Detect overspeed, late braking, and other violations
                      instantly to enforce compliance and prevent accidents.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="w-[40%] pl-[20px]">
                <img src={sideBanner} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full reportGenerateBg">
        <div className="max-w-[1200px] w-full mx-auto my-[80px] py-16">
          <div className="bg-white my-4 p-2 rounded-[10px]">
            <h3 className="text-[30px] text-center py-4 text-[#9b4b90] font-semibold">
              Insightful Speed-Time Curve Comparison
            </h3>
            <div className="w-full">
              <ul className="px-2 flex flex-row justify-between max-w-[980px] mx-auto my-8">
                <li className="flex flex-row mr-2 w-[40%] mb-4">
                  <span className="w-[32px] mr-2">
                    <svg
                      class="colorable-icon w-[32px] h-[32px] mt-2 mr-4"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      data-icon="chart-line-up-down"
                      data-prefix="fal"
                      aria-hidden="true"
                    >
                      <path
                        d="M32 48c0-8.8-7.2-16-16-16S0 39.2 0 48V400c0 44.2 35.8 80 80 80H496c8.8 0 16-7.2 16-16s-7.2-16-16-16H80c-26.5 0-48-21.5-48-48V48zM368 96h57.4L288 233.4l-68.7-68.7c-3-3-7.1-4.7-11.3-4.7s-8.3 1.7-11.3 4.7l-96 96c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L208 198.6l68.7 68.7c6.2 6.2 16.4 6.2 22.6 0L448 118.6V176c0 8.8 7.2 16 16 16s16-7.2 16-16V80c0-8.8-7.2-16-16-16H368c-8.8 0-16 7.2-16 16s7.2 16 16 16zm0 288h96c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16s-16 7.2-16 16v57.4l-68.7-68.7-22.6 22.6L425.4 352H368c-8.8 0-16 7.2-16 16s7.2 16 16 16z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  <div>
                    <h4 className="text-[22px] font-semibold">
                      Before Training
                    </h4>
                    <p>
                      Irregular speed, sharp accelerations and braking reducing
                      efficiency.
                    </p>
                  </div>
                </li>
                <li className="flex flex-row mr-2 w-[40%]  mb-4">
                  <span className="w-[32px] mr-2">
                    <svg
                      class="colorable-icon w-[32px] h-[32px] mt-2 mr-4"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      data-icon="chart-line-up"
                      data-prefix="fal"
                      aria-hidden="true"
                    >
                      <path
                        d="M32 48c0-8.8-7.2-16-16-16S0 39.2 0 48V400c0 44.2 35.8 80 80 80H496c8.8 0 16-7.2 16-16s-7.2-16-16-16H80c-26.5 0-48-21.5-48-48V48zm288 96c0 8.8 7.2 16 16 16h89.4L320 265.4l-84.7-84.7c-6.2-6.2-16.4-6.2-22.6 0l-112 112c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L224 214.6l84.7 84.7c6.2 6.2 16.4 6.2 22.6 0L448 182.6V272c0 8.8 7.2 16 16 16s16-7.2 16-16V144c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  <div>
                    <h4 className="text-[22px] font-semibold">
                      After Training
                    </h4>
                    <p>
                      Smoother driving with optimal speed control enhancing
                      safety and fuel economy.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="max-w-[1200px] w-full mx-auto my-[80px]">
          <div className="w-full powerfulDataBox">
            <div className="w-full flex flex-row">
              <div className="w-[40%] pl-[20px]">
                <img src={sideBanner2} className="w-full" />
              </div>
              <div className="w-[60%] pl-[20px]">
                <h3 className="text-[34px] font-semibold text-[#9b4b90]">
                  Braking Zone Visual Analysis
                </h3>
                <ul>
                  <li>
                    <p>
                      This visual tool identifies critical braking zones,
                      flagging late applications and unnecessary early brakes
                      for targeted pilot training.
                    </p>
                  </li>
                  <li>
                    <p>
                      Reducing braking inconsistencies ensures greater passenger
                      comfort, less mechanical stress, and enhanced safety.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#efefef]">
        <div className="max-w-[1200px] w-full mx-auto py-[80px]">
          <div className="w-full p-2">
            <h3 className="text-center text-[26px] mb-8 font-semibold">
              Driving Pattern Suggestions
            </h3>
            <ul className="flex flex-row justify-bweteen">
              <li className=" bg-white p-4  rounded-[5px]">
                <span>
                  <h4 className="text-[20px] font-semibold">
                    Optimized Speed Control
                  </h4>
                  <p className="text-[#434343]">
                    Encourages steady acceleration to reduce energy consumption.
                  </p>
                </span>
              </li>
              <li className=" bg-white p-4 mx-4 rounded-[5px]">
                <span>
                  <h4 className="text-[20px] font-semibold">Timely Braking</h4>
                  <p className="text-[#434343]">
                    Promotes early and smooth braking for increased safety and
                    efficiency.
                  </p>
                </span>
              </li>
              <li className=" bg-white p-4  rounded-[5px]">
                <span>
                  <h4 className="text-[20px] font-semibold">
                    Compliance Reinforcement
                  </h4>
                  <p className="text-[#434343]">
                    Alerts on any deviations to ensure adherence to safety
                    guidelines.
                  </p>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {showDemoForm && (
        <DemoRequestForm onClose={() => setShowDemoForm(false)} />
      )}
    </div>
  );
};

export default HomeComponent;
