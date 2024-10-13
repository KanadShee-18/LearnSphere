import React from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";

const CourseSubSectionAccordian = ({ subSec }) => {
  return (
    <div>
      <div className="flex justify-between py-2">
        <div className="flex items-center gap-2 duration-300 transform hover:translate-x-2 hover:text-teal-400 hover:cursor-pointer">
          <span>
            <HiOutlineVideoCamera className="text-xl" />
          </span>
          <p>{subSec?.title}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseSubSectionAccordian;
