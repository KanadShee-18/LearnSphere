import React from "react";
import { IoIosPeople } from "react-icons/io";
import { IoBookSharp } from "react-icons/io5";

const CourseCard = (props) => {
    const { heading, desc, lessonNum, level, active } = props;

    return (
        <div
            className={`w-[280px] flex font-inter flex-col h-[270px] sm:w-[280px] sm:h-[260px] justify-between  ${
                active
                    ? "bg-gradient-to-bl from-[#acd6c5] via-[#e2e7e5] to-[#bde7d6] activeCard"
                    : "bg-slate-800 shadow-md shadow-slate-200"
            }  hover:cursor-pointer transition-all hover:scale-95 duration-300`}
        >
            <div className="p-4 flex flex-col gap-y-3">
                <p
                    className={`text-[17px] ${
                        active ? "text-slate-900" : "text-slate-200"
                    } font-semibold`}
                >
                    {heading}
                </p>
                <p
                    className={`${
                        active ? "text-slate-500" : "text-slate-500"
                    } text-sm font-poppins font-medium`}
                >
                    {desc}
                </p>
            </div>
            <div
                className={`px-4 py-3 flex border-t-[1px] text-[13px] font-medium border-dashed border-slate-600 flex-row ${
                    active ? "text-blue-200" : "text-slate-400"
                } justify-between`}
            >
                <p className="flex flex-row items-center gap-2">
                    <IoIosPeople className="size-6" />
                    {level}
                </p>
                <p className="flex flex-row items-center gap-2">
                    <IoBookSharp className="size-4" />
                    {lessonNum} Lessons
                </p>
            </div>
        </div>
    );
};

export default CourseCard;
