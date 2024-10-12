import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, Height }) => {
  return (
    <Link to={`/courses/${course._id}`} className="inline-block mx-4">
      <div className="flex">
        <div className="rounded-lg max-w-[400px]">
          <img
            src={course?.thumbnail}
            alt="Course Thumbnail"
            className={`h-[250px] w-full rounded-xl object-cover`}
          />
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
