import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";

const CourseCard = ({ course, Height, Width }) => {
  const [avgRatingCount, setAvgRatingCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgRatingCount(count);
  }, [course]);

  return (
    <Link
      to={`/courses/${course._id}`}
      className="inline-block mx-1 transition-all duration-200 transform md:mx-4 hover:scale-95"
    >
      <div className={`${Width && "mx-auto"}`}>
        <div
          className={`rounded-lg
            ${Width ? `${Width}` : "w-[150px]"}
            relative md:w-[320px] lg:w-[400px]`}
        >
          <img
            src={course?.thumbnail}
            alt="Course Thumbnail"
            className={`${Height} w-full rounded-xl object-cover`}
          />
          <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-[#262631] to-transparent rounded-b-xl"></div>
        </div>
        <div className="flex flex-col md:w-[320px] lg:w-[400px] w-[150px] gap-1 px-1 py-3">
          <p className="overflow-hidden text-sm text-nowrap text-ellipsis md:text-lg text-slate-200 font-poppins">
            {course?.courseName}
          </p>
          <p className="text-sm text-slate-400">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>
          <div className="flex flex-col items-start gap-2 md:items-center md:flex-row">
            <span className="text-teal-500">{avgRatingCount || 0}</span>
            <RatingStars Review_Count={avgRatingCount} />
            <span className="text-sm text-slate-400">
              {course?.ratingAndReviews?.length} Ratings
            </span>
          </div>
          <p className="text-xs text-sky-200 md:text-base sm:text-sm">
            Rs. {course?.price.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
