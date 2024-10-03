import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../slices/courseSlice";
import CourseTable from "./InstructorCourses/CourseTable";

const MyCourses = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token);
      if (result) {
        console.log("The instructor courses comes as: ", result);

        setCourses(result?.instructorCourses);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="w-10/12 mx-auto mt-6 max-w-maxContent">
      <div className="flex justify-between">
        <h1>My Courses({courses.length})</h1>
        <button
          onClick={() => navigate("/dashboard/add-course")}
          className="flex items-center px-3 py-2 font-semibold rounded bg-blue-50 text-slate-800 hover:bg-richblue-50 gap-x-2"
        >
          Add Course <FaPlus />
        </button>
      </div>

      {courses && <CourseTable courses={courses} setCourses={setCourses} />}
    </div>
  );
};

export default MyCourses;
