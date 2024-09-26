import React from "react";

import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import Quote from "../components/core/AboutPage/Quote";
import StatsComponenet from "../components/core/AboutPage/Stats";
import HighlightText from "../components/core/homepage/HighlightText";
// import ReviewSlider from "../components/common/ReviewSlider";
import Footer from "../components/common/Footer";
import Vision from "../components/core/AboutPage/Vision";

const About = () => {
  return (
    <div className="text-white mt-14">
      {/* Section 1 */}
      <section className=" pt-32 pb-48 bg-[#161d29] flex items-center justify-center">
        <div className="relative flex flex-col items-center justify-center gap-y-3 max-w-maxContent">
          <header className="flex flex-col items-center justify-center text-4xl text-slate-200">
            <h1 className="font-semibold">
              Driving Innovation in Online Education for a
            </h1>{" "}
            <HighlightText text={"Brighter Future"} />
            <p className="mt-3 text-sm text-richblack-400 font-medium max-w-[80%] text-center">
              LearnSphere is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>
          <div className="absolute top-[130%] flex mx-auto gap-x-5">
            <img
              src={BannerImage1}
              alt="Banner1"
              className="w-[200px] sm:w-[300px] lg:w-[384px]"
            />
            <img
              src={BannerImage2}
              alt="Banner2"
              className="w-[200px] sm:w-[300px] lg:w-[384px]"
            />
            <img
              src={BannerImage3}
              alt="Banner3"
              className="w-[200px] sm:w-[300px] lg:w-[384px]"
            />
          </div>
        </div>
      </section>
      {/* Section: 2 */}
      <section className="mt-[13%] flex items-center justify-center ">
        <Quote />
      </section>
      {/* Section: 3 */}

      <Vision />
      {/* Section: 4 */}
      <section>
        <StatsComponenet />
      </section>
      {/* Section: 5 */}
      <section className="w-11/12 mx-auto max-w-maxContent">
        <LearningGrid />
      </section>
    </div>
  );
};

export default About;
