import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";

const CourseCard = ({ course, Height }) => {
  const [avgRatingCount, setAvgRatingCount] = useState(0);
  console.log(Height);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgRatingCount(count);
  }, [course]);

  return (
    <Link
      to={`/courses/${course._id}`}
      className="inline-block mx-4 transition-all duration-200 transform hover:scale-95"
    >
      <div className="">
        <div
          className={`rounded-lg ${
            Height === "h-[270px]" ? "w-[400px]" : "w-[320px]"
          } relative`}
        >
          <img
            src={course?.thumbnail}
            alt="Course Thumbnail"
            className={`${Height} w-full rounded-xl object-cover`}
          />
          <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-[#262631] to-transparent rounded-b-xl"></div>
        </div>
        <div className="flex flex-col gap-1 px-1 py-3">
          <p className="text-lg text-slate-200 font-poppins">
            {course?.courseName}
          </p>
          <p className="text-sm text-slate-400">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-teal-500">{avgRatingCount || 0}</span>
            <RatingStars Review_Count={avgRatingCount} />
            <span className="text-sm text-slate-400">
              {course?.ratingAndReviews?.length} Ratings
            </span>
          </div>
          <p className="text-sky-200">
            Rs. {course?.price.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
