import React from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import CourseCard from "./CourseCard";

const CourseSlider = ({ Courses, Id }) => {
  const slideLeft = () => {
    const slider = document.getElementById(`${Id}`);
    slider.scrollLeft -= 250;
  };
  const slideRight = () => {
    const slider = document.getElementById(`${Id}`);
    slider.scrollLeft += 250;
  };

  return (
    <div className="mt-6 ">
      {Courses?.length ? (
        <div className="relative">
          <div className="absolute z-30 flex gap-2 md:right-0 sm:right-4 right-6 -top-10">
            <button
              onClick={slideLeft}
              className="p-1 text-2xl text-teal-800 rounded-full bg-[#1e2736]  hover:text-teal-500 hover:bg-opacity-80"
            >
              <MdArrowLeft />
            </button>
            <button
              onClick={slideRight}
              className="p-1 text-2xl text-teal-800 rounded-full bg-[#1e2736] hover:text-teal-500 hover:bg-opacity-80"
            >
              <MdArrowRight />
            </button>
          </div>

          <div
            id={Id}
            className="w-full h-full px-4 mt-12 overflow-x-scroll md:px-0 whitespace-nowrap scroll-smooth scrollbar-hide"
          >
            {Courses?.map((course, i) => (
              <CourseCard key={i} course={course} Height={"h-[200px]"} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xl text-purple-200">No Courses Found</p>
      )}
    </div>
  );
};

export default CourseSlider;
