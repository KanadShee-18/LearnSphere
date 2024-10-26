import React from "react";

import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from "react-type-animation";
import CTAButton from "./CTAButton";

const CodeBlock = ({
  position,
  heading,
  subHeading,
  ctaBtn1,
  ctaBtn2,
  codeBlock,
  backgroundGradient,
  codeColor,
}) => {
  // console.log(ctaBtn1.btnTxt);

  return (
    <div className={`flex ${position} sm:my-20 my-10 justify-between gap-10`}>
      {/* Section: 1 */}
      <div className="flex flex-col justify-between w-full gap-8 text-center md:w-1/2 md:text-start">
        {heading}
        <div className="text-sm font-semibold text-center md:text-start md:text-base text-richblack-200 font-inter">
          {subHeading}
        </div>
        <div className="flex justify-center gap-7 mt-7 sm:justify-start">
          <CTAButton active={ctaBtn1.active} linkto={ctaBtn1.linkto}>
            <div className="flex items-center gap-3 font-poppins">
              {ctaBtn1.btnTxt}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctaBtn2.active} linkto={ctaBtn2.linkto}>
            <div className="flex items-center gap-3 font-popp">
              {ctaBtn2.btnTxt}
            </div>
          </CTAButton>
        </div>
      </div>

      {/* Section: 2 */}
      <div className="flex relative h-fit flex-row text-sm w-full py-2 md:w-[500px] bg-slate-800 bg-opacity-35 rounded-md">
        {/* BG Gradient */}
        {backgroundGradient}

        <div className="text-center flex flex-col w-[10%] text-slate-400 font-inter z-10">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
          <p className="block md:hidden">12</p>
          <p className="block md:hidden">13</p>
        </div>
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} px-2`}
        >
          <TypeAnimation
            sequence={[codeBlock, 1000, ""]}
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
