import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { RxTimer } from "react-icons/rx";
import { SiTicktick } from "react-icons/si";
import { LuFileEdit } from "react-icons/lu";
import { HiTrash } from "react-icons/hi2";
import { IoTime } from "react-icons/io5";
import { formatDate } from "../../../../services/formatDate";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../slices/courseSlice";
import { toast } from "react-toastify";

const CourseTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteCourse = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result?.instructorCourses);
      dispatch(setCourse(result?.instructorCourses)); // Ensure you're dispatching the action properly
    }
    setConfirmationModal(null);
    setLoading(false);
    toast("Courses recently updated!", { position: "bottom-right" });
  };

  return (
    <div className="w-10/12 mx-auto mb-36 max-w-maxContent mt-14">
      {courses.length === 0 ? (
        <p className="w-full text-center text-purple-400">No Courses Found</p>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            className="relative flex lg:max-w-[800px] mx-auto md:flex-row flex-col p-8 rounded-xl mb-10 border-[1px] bg-opacity-80 border-slate-600 courseCard 
        bg-[#212e42] hover:cursor-pointer hover:bg-[#121f31] hover:scale-105 duration-300 transition-all"
          >
            {/* Left Side - 70% */}
            <div className="flex flex-col gap-3 lg:flex-row w-full lg:w-[70%]">
              <img
                src={course.thumbnail}
                alt="course_img"
                className="w-[220px] shadow-sm shadow-slate-300 h-[150px] object-cover rounded-xl"
              />
              <div className="flex flex-col gap-y-2">
                <p className="text-richblack-5">{course.courseName}</p>
                <p className="text-[13px] font-medium text-slate-400 font-poppins">
                  {course.courseDescription.length > 50
                    ? `${course.courseDescription.substring(0, 50)}...`
                    : course.courseDescription}
                </p>

                <p className="text-sm text-blue-50">
                  Created:{formatDate(course.createdAt)}
                </p>
                <div className="flex flex-col items-center gap-3 md:flex-row">
                  {course.status === COURSE_STATUS.DRAFT ? (
                    <p className="flex w-fit items-center px-3 py-[2px] text-[15px] text-[#ce7d98] font-inter tracking-wider rounded-full bg-slate-900 font-medium gap-x-2">
                      <IoTime className="size-5" />
                      Drafted
                    </p>
                  ) : (
                    <p className="flex items-center px-3 py-1 text-sm font-semibold text-blue-100 rounded-full bg-slate-700 w-fit bg-opacity-90 gap-x-2 ">
                      <SiTicktick className="size-4" />
                      Published
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Right Side - 30% */}
            <div className="flex md:flex-col flex-row md:items-end items-center md:mt-0 mt-4 justify-start w-full lg:w-[30%] gap-y-4 lg:gap-x-3">
              <div>
                <p className="text-xl font-medium tracking-wide text-richblack-25">
                  &#8377;{course.price}
                </p>
              </div>
              <div className="mx-3 md:mx-0">
                <h1 className="px-2 inline-block py-[2px] text-sm font-medium rounded-full bg-slate-700 text-slate-300">
                  2hr 30mins
                </h1>
              </div>
              <div className="flex">
                <button
                  className="p-3 text-teal-400 rounded-full hover:bg-slate-700"
                  disabled={loading}
                >
                  <LuFileEdit className="text-xl" />
                </button>
                <button
                  className="p-3 text-pink-100 rounded-full hover:bg-slate-700"
                  disabled={loading}
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Are You Sure?",
                      text2: "This whole course content will be deleted!",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: !loading
                        ? () => handleDeleteCourse(course._id)
                        : () => {},
                      btn2Handler: !loading
                        ? () => setConfirmationModal(null)
                        : () => {},
                    })
                  }
                >
                  <HiTrash className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseTable;
