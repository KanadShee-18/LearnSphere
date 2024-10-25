import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import CodeBlock from "../components/core/Homepage/CodeBlock";
import TimeLineSection from "../components/core/Homepage/TimeLineSection";
import LearningLanguageSection from "../components/core/Homepage/LearningLanguageSection";
import InstructorSection from "../components/core/Homepage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/Homepage/ExploreMore";
import CTAButton from "../components/core/Homepage/CTAButton";
import BannerVideo from "../components/core/Homepage/BannerVideo";
import { motion } from "framer-motion";
import ReviewSlider from "../components/common/ReviewSlider";
import HighlightText from "../components/core/Homepage/HighlightText";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#6a78a52e_1px,transparent_1px),linear-gradient(to_bottom,#6a78a52e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-10 h-[50vh]"></div> */}

      <div className="absolute inset-0 z-0">
        <BannerVideo />
      </div>

      {/* Section: 1 */}

      <div className="relative z-30 flex flex-col items-center justify-between w-11/12 mx-auto text-white section1 max-w-maxContent">
        <div className="relative flex flex-col items-center justify-center mt-16 w-full max-w-full mx-auto h-[100vh]">
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            className="mt-8 lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold drop-shadow-2xl text-center text-[#c1edff] font-inter"
          >
            Unlock your potential and drive future success with
            <HighlightText text={"Coding Skills"} />
          </motion.div>
          <Link to={"/signup"}>
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              className="mx-auto mt-14 font-semibold transition-all duration-200 bg-opacity-60 rounded-full shadow-sm group bg-[#223253] font-playwrite text-slate-300 shadow-slate-500 hover:scale-95"
            >
              <div className="flex flex-row items-center justify-center px-4 py-3 transition-all duration-300 rounded-full gap-x-3 group-hover:bg-slate-900 group-active:bg-slate-600">
                <p className="text-sm font-medium text-blue-25">
                  Become an Instructor
                </p>{" "}
                <FaArrowRightLong />
              </div>
            </motion.div>
          </Link>

          <div className="mt-10 text-sm font-medium tracking-wide text-center md:text-base text-blue-25 font-inter">
            Study at your own speed, from anywhere in the world, with our online
            coding courses. Have access to a plethora of tools, such as
            interactive projects, tests, and individualized feedback from
            instructors.
          </div>
          <div className="flex flex-row mt-16 lg:text-3xl md:text-2xl text-xl font-semibold gap-x-5 font-poppins bg-gradient-to-br from-[#2f89ff] via-[#6a78a5] to-[#16dfd5] text-transparent bg-clip-text">
            <p>LEARN</p>.<p>TEACH</p>.<p>EARN</p>
          </div>
          <div className="flex flex-row mt-8 gap-7 font-poppins">
            <CTAButton
              children={"Learn More"}
              active={true}
              linkto={"/signup"}
            />
            <CTAButton
              children={"Book Demo Session"}
              active={false}
              linkto={"/signup"}
            />
          </div>
        </div>

        {/* Code Section: 1 */}
        <div>
          <CodeBlock
            position={"sm:flex-row flex-col"}
            heading={
              <div className="text-2xl font-semibold text-center md:text-start md:text-4xl font-inter">
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
              <div className="text-2xl font-semibold md:text-4xl font-inter">
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
            codeBlock={`<!DOCTYPE html>\n<html>\n<head> <title>CodeMaster</title> <link rel=\"stylesheet\" href=\"main.css\">\n<head/>\n<body>\n<h1><a href=\"/\">Main Title</a></h1>\n<nav><a href=\"/first\">First</a><a href=\"/second\">Second</a>\n<a href=\"/third\">Third</a>\n</nav>`}
            codeColor={"text-caribbeangreen-50"}
            backgroundGradient={<div className="absolute codeblock2"></div>}
          />
        </div>
        <ExploreMore />
      </div>

      {/* Section: 2 */}
      <div className="relative bg-gradient-to-bl z-20 sm:mt-32 from-[#c7f5e2] via-[#f0f2f1] to-[#c6f5e2] text-slate-700 section2">
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
            <div className="text-2xl text-center md:text-4xl md:text-start font-poppins s3ht">
              <p className="font-semibold">
                Get the skills you need for a{" "}
                <HighlightText text={"job that is in demand"} />
              </p>
            </div>
            <div className="flex flex-col items-start gap-5 font-medium font-inter">
              <p className="text-sm text-center md:text-start">
                The modern LearnSphere is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </p>
              <div className="w-full md:w-[150px]">
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
          <div className="mb-6 bg-gradient-to-br from-[#2f89ff] via-[#6a78a5] to-[#16dfd5] text-transparent bg-clip-text md:text-4xl text-center text-3xl font-semibold text-slate-400 font-inter">
            Reviews from other Learners
          </div>
          <>
            <ReviewSlider />
          </>
        </div>
      </div>

      {/* Section: 4 - Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
