import React from "react";
import { Link } from "react-router-dom";

const InstructorCourses = ({ CourseDetails }) => {
  const shuffledCourses = CourseDetails?.sort(
    (a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length
  );
  const threeCourses = shuffledCourses.slice(0, 3);
  console.log(threeCourses);

  return (
    <div className=" flex flex-col gap-y-3 p-5 w-full bg-[#222d4b] rounded-lg">
      <div className="flex flex-row items-center justify-between">
        <p className="lg:text-xl md:text-lg text-base font-semibold text-[#b8bdf5]">
          Your Most Bought Courses
        </p>
        <Link
          to={"/dashboard/my-courses"}
          className="bg-[#32426e] text-nowrap flex items-center font-semibold md:text-sm text-xs md:px-4 px-6 md:py-2 py-3 rounded-md text-teal-500 hover:bg-teal-500 hover:text-slate-900"
        >
          View All
        </Link>
      </div>

      {/* Render 3 courses */}
      {threeCourses?.length === 0 ? (
        <div className="flex flex-col w-full h-12 place-items-center">
          <p className="text-xl font-semibold text-lime-50">No Courses Found</p>
          <Link
            to={"/dashboard/add-course"}
            className="underline text-blue-50 hover:cursor-pointer"
          >
            Make your first course
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center my-4 space-y-5 lg:space-y-0 lg:space-x-6 lg:items-start lg:flex-row">
          {threeCourses.map((course) => (
            <div
              key={course._id}
              className="lg:w-1/3 sm:w-3/4 w-11/12  rounded-b-lg bg-[#49567a] p-3 rounded-t-md shadow-md shadow-slate-950 hover:cursor-pointer transition-all duration-200 hover:shadow-slate-500"
            >
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="h-[201px] w-full rounded-md object-cover aspect-video"
              />
              <div className="w-full mt-3">
                <p className="overflow-hidden text-sm font-medium text-teal-400 md:text-base text-nowrap text-ellipsis">
                  {course.courseName}
                </p>
                <div className="flex items-center mt-1 space-x-2 md:text-sm text-xs font-medium tracking-wide gap-x-3 text-[#bcf5ff]">
                  <p className="">
                    {course?.studentsEnrolled?.length}{" "}
                    {course?.studentsEnrolled.length > 1
                      ? "Students"
                      : "Student"}
                  </p>
                  <p className="">|</p>
                  <p className="">Rs. {course.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
