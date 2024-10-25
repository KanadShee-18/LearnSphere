import React from "react";
import HighlightText from "./HighlightText";
import kyp_img from "../../../assets/Images/Know_your_progress.png";
import cwo_img from "../../../assets/Images/Compare_with_others.png";
import pyl_img from "../../../assets/Images/Plan_your_lessons.png";
import CTAButton from "./CTAButton";

const LearningLanguageSection = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col gap-5">
        <div className="text-2xl font-semibold text-center heading lg:text-4xl md:text-3xl font-inter text-slate-700">
          Your Swiss Knife for{" "}
          <HighlightText text={" learning any language."} />
        </div>
        <div className="w-3/4 mx-auto text-sm font-semibold text-center sm:text-base text-slate-500 font-poppins">
          Using spin making learning multiple languages easy with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className="flex flex-col items-center justify-center mt-5 md:flex-row">
          <img
            className="object-contain md:-mr-36 w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px]  cursor-pointer"
            src={kyp_img}
            alt="kyp_img"
          />
          <img
            className="object-contain w-[280px] -mt-24 md:mt-0 sm:w-[330px] md:w-[380px] lg:w-[440px] cursor-pointer "
            src={cwo_img}
            alt="cwo_img"
          />
          <img
            className="object-contain -mt-28 md:mt-0 md:-ml-40 w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] cursor-pointer "
            src={pyl_img}
            alt="pyl_img"
          />
        </div>

        <div className="lmBtn my-8 w-[140px] mx-auto">
          <CTAButton active={true} linkto={"/signup"} children={"Learn More"} />
        </div>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
