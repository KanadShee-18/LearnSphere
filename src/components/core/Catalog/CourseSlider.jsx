import React from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import CourseCard from "./CourseCard";

const CourseSlider = ({ Courses }) => {
  const slideLeft = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft -= 250;
  };
  const slideRight = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft += 250;
  };

  return (
    <div className="px-6 mt-6">
      {Courses?.length ? (
        <div className="relative">
          <button
            onClick={slideLeft}
            className="absolute p-1 text-2xl rounded-full -left-10 top-[25%] bg-slate-600 bg-opacity-45 text-teal-800 hover:text-teal-500 hover:bg-opacity-70"
          >
            <MdArrowLeft />
          </button>
          <button
            onClick={slideRight}
            className="absolute p-1 text-2xl rounded-full -right-10 top-[25%] bg-slate-600 bg-opacity-45 text-teal-800 hover:text-teal-500 hover:bg-opacity-70"
          >
            <MdArrowRight />
          </button>

          <div
            id="slider"
            className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide"
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
