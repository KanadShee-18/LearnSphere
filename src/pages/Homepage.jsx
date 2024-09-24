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
        <div>
            {/* Section: 1 */}

            <div className="section1 relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent">
                <Link to={"/signup"}>
                    <div className="mx-auto group mt-16 rounded-full bg-slate-800 font-semibold font-playwrite text-slate-300 shadow-sm shadow-slate-500 transition-all duration-200 hover:scale-95">
                        <div className="flex px-4 rounded-full py-3 flex-row items-center justify-center gap-x-3 transition-all duration-300 group-hover:bg-slate-900 group-active:bg-slate-600">
                            <p className="text-sm font-medium">
                                Become an Instructor
                            </p>{" "}
                            <FaArrowRightLong />
                        </div>
                    </div>
                </Link>

                <div className="font-semibold font-inter text-4xl text-center mt-7 text-green-100">
                    Unlock your potential and drive future success with
                    <HighlightText text={"Coding Skills"} />
                </div>

                <div className="text-center text-richblack-200 font-semibold font-poppins text-sm mt-5">
                    Study at your own speed, from anywhere in the world, with
                    our online coding courses. Have access to a plethora of
                    tools, such as interactive projects, tests, and
                    individualized feedback from instructors.
                </div>

                <div className="flex flex-row gap-7 mt-8 font-poppins">
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

                {/* <div className="relative my-12 mx-auto w-3/4">
                    <div className="absolute inset-0 videoGradient z-0"></div>

                    <div className="videoContainer z-10">
                        <video
                            src={banner1}
                            muted
                            loop
                            autoPlay
                            className="w-full videoFile"
                        ></video>
                    </div>
                </div> */}
                <div className="relative my-24 mx-auto w-3/4">
                    {/* Gradient Background */}
                    <div className="absolute videoGradient z-0"></div>

                    {/* Video Container */}
                    <div className="videoContainer relative z-10">
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
                        backgroundGradient={
                            <div className="codeblock1 absolute"></div>
                        }
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
                        backgroundGradient={
                            <div className="codeblock2 absolute"></div>
                        }
                    />
                </div>
                <ExploreMore />
            </div>

            {/* Section: 2 */}
            <div className="bg-gradient-to-bl sm:mt-32 from-[#c7f5e2] via-[#f0f2f1] to-[#c6f5e2] text-slate-700 section2">
                <div className="homepage_bg sm:h-[330px] h-[250px]">
                    <div className="w-11/12 max-w-maxContent h-full flex items-center justify-center gap-5 mx-auto">
                        <div className="flex flex-row text-white font-inter gap-8">
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
                <div className="mx-auto max-w-maxContent w-11/12 flex flex-col items-center justify-between gap-8 py-20">
                    <div className="flex sm:flex-row flex-col gap-6">
                        <div className="font-poppins text-4xl s3ht">
                            <p className="font-semibold">
                                Get the skills you need for a{" "}
                                <HighlightText text={"job that is in demand"} />
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-5 font-inter font-medium">
                            <p className="text-start text-sm">
                                The modern LearnSphere is the dictates its own
                                terms. Today, to be a competitive specialist
                                requires more than professional skills.
                            </p>
                            <div className="w-[150px]">
                                <CTAButton
                                    active={true}
                                    children={"Learn More"}
                                />
                            </div>
                        </div>
                    </div>
                    <TimeLineSection />
                    <LearningLanguageSection />
                </div>
            </div>
            {/* Section: 3 */}

            <div className="section3 bAT">
                <div className="w-11/12 max-w-maxContent h-full flex flex-col items-center justify-center gap-5 mx-auto">
                    <InstructorSection />
                    {/* Reviews slider */}
                    <p className="text-4xl text-slate-400 font-inter mb-6">
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
