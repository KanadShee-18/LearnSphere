import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import HighlightText from "../core/homepage/HighlightText";
import CTAButton from "../core/homepage/CTAButton";
import banner1 from "../../assets/Images/banner1.mp4";
import CodeBlock from "../core/homepage/CodeBlock";

const Homepage = () => {
    return (
        <div>
            {/* Section: 1 */}

            <div className="section1 relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent">
                <Link to={"/signup"}>
                    <div className="mx-auto group mt-16 rounded-full bg-slate-800 font-semibold font-playwrite text-slate-300 shadow-sm shadow-slate-500 transition-all duration-200 hover:scale-95">
                        <div className="flex px-4 rounded-full py-3 flex-row items-center justify-center gap-x-3 transition-all duration-300 group-hover:bg-richblack-700 group-active:bg-slate-700">
                            <p className="text-sm">Become an Instructor</p>{" "}
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

                <div className="relative videoContainer my-12 mx-auto w-3/4">
                    <video
                        src={banner1}
                        muted
                        loop
                        autoPlay
                        className="w-full"
                    ></video>
                </div>

                {/* Code Section: 1 */}
                <div>
                    <CodeBlock
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold font-inter">
                                Empower Your
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
                        codeBlock={`<<!DOCTYPE html>\n<html>\n<head><title>LearnCoding</title><linkrel="stylesheet"href="style.css">\n<head/>\n`}
                        codeColor={"text-caribbeangreen-100"}
                    />
                </div>
            </div>

            {/* Section: 2 */}
            {/* Section: 3 */}
            {/* Section: 4 - Footer */}
        </div>
    );
};

export default Homepage;
