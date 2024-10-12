import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
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
            className="absolute p-1 rounded-full -left-10 top-[45%] md:p-2 bg-slate-600 bg-opacity-45 text-teal-800 hover:text-teal-500 hover:bg-opacity-70"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={slideRight}
            className="absolute p-1 rounded-full -right-10 md:p-2 top-[45%] bg-slate-600 bg-opacity-45 text-teal-800 hover:text-teal-500 hover:bg-opacity-70"
          >
            <FaArrowRight />
          </button>

          <div
            id="slider"
            className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide"
          >
            {Courses?.map((course, i) => (
              <CourseCard key={i} course={course} Height={"200px"} />
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
