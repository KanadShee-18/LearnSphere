import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileApi";
import Spinner from "../../common/Spinner";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [loading, setLoading] = useState(false);

  const getEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await getUserEnrolledCourses(token);
      
      setEnrolledCourses(response);
    } catch (error) {
   
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="w-10/12 mx-auto mt-14">
      <div className="flex text-xl md:text-3xl text-blue-25 gap-x-3">
        <FaGraduationCap className="text-2xl md:text-4xl" />
        Enrolled Courses
      </div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <Shimmer />
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
          {/* TODO: Modify this Empty State */}
        </p>
      ) : (
        <div className="my-8 rounded-lg shadow-md text-richblack-5 shadow-slate-800">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-[#2f3b54] text-sm md:text-base">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-[#2f3b54] ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="md:flex-row flex flex-col w-[45%] cursor-pointer items-center gap-4 px-3 md:px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  );
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="object-cover w-full h-24 rounded-lg md:h-14 md:w-14"
                />
                <div className="flex flex-col max-w-xs gap-2">
                  <p className="text-sm font-semibold text-slate-400 md:text-base">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-[#7a8cb4] font-poppins">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3 text-xs text-slate-400 md:text-base">
                {course?.totalDuration}
              </div>
              <div className="flex flex-col w-1/5 gap-2 px-2 py-3 text-xs md:text-base">
                <p className="text-slate-400">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="5px"
                  isLabelVisible={false}
                  baseBgColor="#4b5566"
                  bgColor="#34e0bb"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Shimmer = () => {
  return (
    <div className="flex flex-col w-full gap-6">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="flex items-center p-4 rounded-lg bg-gradient-to-br from-[#1c233b] to-[#28344d] animate-pulse"
          >
            {/* Course Thumbnail */}
            <div className="w-16 h-16 rounded-lg bg-slate-700"></div>
            <div className="w-1/2 ml-4">
              {/* Course Name */}
              <div className="h-4 mb-2 rounded-md bg-slate-700"></div>
              {/* Course Description */}
              <div className="h-3 mb-2 rounded-md bg-slate-700"></div>
              {/* Course Progress */}
              <div className="w-3/4 h-3 rounded-md bg-slate-700"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default EnrolledCourses;
