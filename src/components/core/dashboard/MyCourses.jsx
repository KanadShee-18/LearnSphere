import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../slices/courseSlice";
import CourseTable from "./InstructorCourses/CourseTable";
import { useToken } from "../../../context/TokenContext";

const MyCourses = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token);
      if (result) {
        // console.log("The instructor courses comes as: ", result);

        setCourses(result?.instructorCourses);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleButtonClick = () => {
    navigate("/dashboard/add-course");
    dispatch(setEditCourse(false));
  };

  return (
    <div className="w-10/12 mx-auto mt-6 max-w-maxContent">
      <div
        onClick={() => handleButtonClick()}
        className="relative flex justify-between md:mt-0 mt-14"
      >
        <h1 className="ml-4 text-2xl md:text-3xl md:ml-0 text-slate-200">
          My Courses
        </h1>
        <button className="flex items-center px-3 py-2 font-semibold bg-teal-500 rounded text-slate-800 hover:bg-richblue-50 gap-x-2">
          Add Course <FaPlus />
        </button>
      </div>

      {courses && <CourseTable courses={courses} setCourses={setCourses} />}
    </div>
  );
};

export default MyCourses;
