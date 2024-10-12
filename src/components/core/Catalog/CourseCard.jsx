import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, Height }) => {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="inline-block mx-4 transition-all duration-200 transform hover:scale-95"
    >
      <div className="flex">
        <div className="rounded-lg max-w-[400px]">
          <img
            src={course?.thumbnail}
            alt="Course Thumbnail"
            className={`h-[250px] relative w-full rounded-xl object-cover`}
          />
          <div className="absolute w-full h-[30%] top-[70%] rounded-xl bg-gradient-to-t from-[#262631] to-transparent inset-0"></div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
