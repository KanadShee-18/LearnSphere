import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/homepage/HighlightText";
import CTAButton from "../components/core/homepage/CTAButton";
import banner1 from "../assets/Images/banner1.mp4";
import CodeBlock from "../components/core/homepage/CodeBlock";
import TimeLineSection from "../components/core/homepage/TimeLineSection";
import LearningLanguageSection from "../components/core/homepage/LearningLanguageSection";
import InstructorSection from "../components/core/homepage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/homepage/ExploreMore";

const Homepage = () => {
  return (
    <div className="mt-16">
      {/* Section: 1 */}

      <div className="relative flex flex-col items-center justify-between w-11/12 mx-auto text-white section1 max-w-maxContent">
        <Link to={"/signup"}>
          <div className="mx-auto mt-16 font-semibold transition-all duration-200 rounded-full shadow-sm group bg-slate-800 font-playwrite text-slate-300 shadow-slate-500 hover:scale-95">
            <div className="flex flex-row items-center justify-center px-4 py-3 transition-all duration-300 rounded-full gap-x-3 group-hover:bg-slate-900 group-active:bg-slate-600">
              <p className="text-sm font-medium">Become an Instructor</p>{" "}
              <FaArrowRightLong />
            </div>
          </div>
        </Link>

        <div className="text-4xl font-semibold text-center text-green-100 font-inter mt-7">
          Unlock your potential and drive future success with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className="mt-5 text-sm font-semibold text-center text-richblack-200 font-poppins">
          Study at your own speed, from anywhere in the world, with our online
          coding courses. Have access to a plethora of tools, such as
          interactive projects, tests, and individualized feedback from
          instructors.
        </div>

        <div className="flex flex-row mt-8 gap-7 font-poppins">
          <CTAButton children={"Learn More"} active={true} linkto={"/signup"} />
          <CTAButton
            children={"Book Demo Session"}
            active={false}
            linkto={"/signup"}
          />
        </div>

        {/* <div className="relative w-3/4 mx-auto my-12">
                    <div className="absolute inset-0 z-0 videoGradient"></div>

                    <div className="z-10 videoContainer">
                        <video
                            src={banner1}
                            muted
                            loop
                            autoPlay
                            className="w-full videoFile"
                        ></video>
                    </div>
                </div> */}
        <div className="relative w-3/4 mx-auto my-24">
          {/* Gradient Background */}
          <div className="absolute z-0 videoGradient"></div>

          {/* Video Container */}
          <div className="relative z-10 videoContainer">
            <video
              src={banner1}
              muted
              loop
              autoPlay
              className="w-full videoFile"
            ></video>
          </div>
        </div>

        {/* Code Section: 1 */}
        <div>
          <CodeBlock
            position={"sm:flex-row flex-col"}
            heading={
              <div className="text-4xl font-semibold font-inter">
                Empower your
                <HighlightText text={"coding potential"} />
                &nbsp;with our online courses
              </div>
            }
            subHeading={
              "Our instructors are seasoned professionals with years of coding expertise who are enthusiastic about imparting their knowledge to you through our courses."
            }
            ctaBtn1={{
              btnTxt: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctaBtn2={{
              btnTxt: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeBlock={`<!DOCTYPE html>\n<html>\n<head> <title>LearnCoding</title> <linkrel="stylesheet"href="style.css">\n<head/>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="/one">One</a><a href="/two">Two</a>\n<a href="/three">Three</a>\n</nav>`}
            codeColor={"text-caribbeangreen-50"}
            backgroundGradient={<div className="absolute codeblock1"></div>}
          />
        </div>
        {/* Code Section: 2 */}
        <div>
          <CodeBlock
            position={"sm:flex-row-reverse flex-col"}
            heading={
              <div className="text-4xl font-semibold font-inter">
                Learn & start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subHeading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctaBtn1={{
              btnTxt: "Continue Lesson",
              linkto: "/login",
              active: true,
            }}
            ctaBtn2={{
              btnTxt: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeBlock={`<!DOCTYPE html>\n<html>\n<head> <title>LearnCoding</title> <linkrel="stylesheet"href="style.css">\n<head/>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="/one">One</a><a href="/two">Two</a>\n<a href="/three">Three</a>\n</nav>`}
            codeColor={"text-caribbeangreen-50"}
            backgroundGradient={<div className="absolute codeblock2"></div>}
          />
        </div>
        <ExploreMore />
      </div>

      {/* Section: 2 */}
      <div className="bg-gradient-to-bl sm:mt-32 from-[#c7f5e2] via-[#f0f2f1] to-[#c6f5e2] text-slate-700 section2">
        <div className="homepage_bg sm:h-[330px] h-[250px]">
          <div className="flex items-center justify-center w-11/12 h-full gap-5 mx-auto max-w-maxContent">
            <div className="flex flex-row gap-8 text-white font-inter">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex flex-row items-center gap-3 text-slate-700">
                  Explore Full Catalog
                  <FaArrowRightLong />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between w-11/12 gap-8 py-20 mx-auto max-w-maxContent">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="text-4xl font-poppins s3ht">
              <p className="font-semibold">
                Get the skills you need for a{" "}
                <HighlightText text={"job that is in demand"} />
              </p>
            </div>
            <div className="flex flex-col items-start gap-5 font-medium font-inter">
              <p className="text-sm text-start">
                The modern LearnSphere is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </p>
              <div className="w-[150px]">
                <CTAButton active={true} children={"Learn More"} />
              </div>
            </div>
          </div>
          <TimeLineSection />
          <LearningLanguageSection />
        </div>
      </div>
      {/* Section: 3 */}

      <div className="section3 bAT">
        <div className="flex flex-col items-center justify-center w-11/12 h-full gap-5 mx-auto max-w-maxContent">
          <InstructorSection />
          {/* Reviews slider */}
          <p className="mb-6 text-4xl text-slate-400 font-inter">
            Reviews from other Learners
          </p>
        </div>
      </div>

      {/* Section: 4 - Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
