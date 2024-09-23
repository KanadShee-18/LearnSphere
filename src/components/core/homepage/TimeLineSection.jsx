import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import TimeLineImage from "../../../assets/Images/TimelineImage.png";
const timeLine = [
    {
        logo: Logo1,
        heading: "Leadership",
        description: "Fully commited to the success company.",
    },
    {
        logo: Logo2,
        heading: "Responsibility",
        description: "Students will always be our top priority.",
    },
    {
        logo: Logo3,
        heading: "Flexibility",
        description: "The ability to switch is an important skills.",
    },
    {
        logo: Logo4,
        heading: "Solve the problem",
        description: "Code your way to a solution.",
    },
];

const TimeLineSection = () => {
    return (
        <div>
            <div className="flex md:flex-row flex-col md:justify-between gap-7 items-center py-20">
                <div className="leftBox flex flex-col gap-9 lg:gap-14 md:w-[45%] w-[90%] text-slate-700 font-inter ">
                    {timeLine.map((el, index) => {
                        return (
                            <div className="flex flex-row gap-8" key={index}>
                                <div className="w-12 h-12 bg-white flex items-center shadow-inner shadow-teal-600 rounded-xl justify-center">
                                    <img src={el.logo} alt="img1" />
                                </div>
                                <div>
                                    <h2 className="font-bold">{el.heading}</h2>
                                    <p className="text-sm font-semibold text-[#008489]">
                                        {el.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="rightBox relative md:w-[50%] w-[90%]">
                    <div className="absolute w-full h-4/5 rounded-2xl bg-gradient-to-br from-[#2be2ae] via-[#34cbb4] to-[#f8f8ff] blur-xl -left-4 -top-4 timelineBlock"></div>

                    <img
                        src={TimeLineImage}
                        alt="LearnSphere"
                        className="object-cover relative timelineImg"
                    />
                    <div className="absolute bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 uppercase text-white flex flex-row w-3/4 h-1/4 justify-around items-center py-10 left-[15%] -bottom-12 shadow-md shadow-teal-600">
                        <div className="w-full h-full flex justify-between p-3 gap-3 items-center ">
                            <div className="flex items-center flex-row w-1/2 gap-x-3 border-r-[1px] border-cyan-500">
                                <p className="text-3xl font-semibold font-inter">
                                    10
                                </p>
                                <p className="text-cyan-400 font-inter md:text-sm text-[12px]">
                                    Years Experience
                                </p>
                            </div>

                            <div className="flex items-center flex-row w-1/2 gap-x-3">
                                <p className="text-3xl font-semibold font-inter">
                                    250
                                </p>
                                <p className="text-cyan-400 font-inter text-[12px] md:text-sm">
                                    Types of Cities
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeLineSection;
