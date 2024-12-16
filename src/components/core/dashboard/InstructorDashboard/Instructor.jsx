import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorData } from "../../../../services/operations/profileApi";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import Spinner from "../../../common/Spinner";
import InstructorChart from "./InstructorChart";
import { useLocation } from "react-router-dom";
import Statistics from "./Statistics";
import InstructorCourses from "./InstructorCourses";

const Instructor = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getInstructorStats = async () => {
      setLoading(true);
      const insturctorDetails = await getInstructorData(token);
      const instructorAllCourses = await fetchInstructorCourses(token);
      // console.log("Instructor details coming as: ", insturctorDetails);
      // console.log(
      //   "Instructor courses coming as: ",
      //   instructorAllCourses?.instructorCourses
      // );
      if (insturctorDetails?.length) {
        setInstructorData(insturctorDetails);
      }
      if (instructorAllCourses) {
        setCourses(instructorAllCourses?.instructorCourses);
      }
      setLoading(false);
    };
    getInstructorStats();
  }, [location.pathname]);

  // Calculate total students and total amount generated
  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );
  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div className="w-10/12 mx-auto mt-4 mb-32 max-w-maxContent">
      <div className="flex flex-col md:gap-y-3 gap-y-6">
        <h1 className="text-[#969ddf] lg:text-4xl md:text-3xl text-2xl md:mt-0 mt-14 font-semibold">
          Hi, {user?.firstName}👋
        </h1>
        <p className="text-xl text-slate-400 font-eduSa">
          Hope you're doing well. Lets've a see in your progress.
        </p>
      </div>

      {loading ? (
        <div className="w-full h-[40vh] grid place-items-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col mt-5 md:gap-y-3 gap-y-4">
          <div className="flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between">
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex-1 rounded-md bg-[#222d4b] p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            <Statistics
              CourseCount={courses?.length}
              StudentsCount={totalStudents}
              Income={
                typeof totalAmount === "number"
                  ? totalAmount.toLocaleString()
                  : "0"
              }
            />
          </div>
          <div>
            {courses.length > 0 ? (
              <InstructorCourses CourseDetails={courses} />
            ) : (
              <p className="text-2xl font-bold text-center text-slate-400">
                You have not created any courses yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructor;
