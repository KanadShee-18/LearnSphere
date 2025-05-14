import { useState } from "react";
import { HiTrash } from "react-icons/hi2";
import { IoTime } from "react-icons/io5";
import { LuFilePen } from "react-icons/lu";
import { SiTicktick } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { toast } from "sonner";
import { formatDate } from "../../../../services/formatDate";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";

const CourseTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteCourse = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result?.instructorCourses);
      // dispatch(setCourse(result?.instructorCourses)); // Ensure you're dispatching the action properly
    }
    setConfirmationModal(null);
    setLoading(false);
    toast("Courses recently updated!", {
      position: "bottom-right",
      theme: "dark",
    });
  };

  return (
    <div className="w-11/12 mx-auto md:w-10/12 mb-36 max-w-maxContent mt-14">
      {courses.length === 0 ? (
        <p className="w-full text-center text-purple-400">No Courses Found</p>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            className="relative flex lg:max-w-[800px] w-full min-w-[250px] flex-col lg:flex-row gap-y-3 lg:gap-y-0 md:p-8 p-3 rounded-xl mb-10 border-[1px] bg-opacity-90 border-slate-600 courseCard 
        bg-neutral-950 bg-gradient-to-br from-[#1a223b] to-[#181829] hover:cursor-pointer hover:bg-[#121f31] hover:scale-105 duration-300 transition-all"
          >
            <div className="flex flex-col  gap-3 lg:w-[40%] w-full">
              <img
                src={course.thumbnail}
                alt="course_img"
                className="lg:w-[270px] w-full mx-auto shadow-sm shadow-slate-300 lg:h-[170px] h-[200px] object-cover rounded-xl"
              />
            </div>

            <div className="flex md:flex-row flex-col items-center lg:w-[60%] w-full gap-x-3  justify-center">
              <div className="flex flex-col w-full mx-auto place-items-start lg:w-auto gap-y-2">
                <p className="text-richblack-5">{course.courseName}</p>
                <p className="text-[13px] font-medium text-slate-400 font-poppins">
                  {course.courseDescription.length > 50
                    ? `${course.courseDescription.substring(0, 50)}...`
                    : course.courseDescription}
                </p>

                <p className="text-sm text-blue-50">
                  Created:{formatDate(course.createdAt)}
                </p>
                <div className="flex flex-col items-center gap-3 mt-3 md:flex-row">
                  {course.status === COURSE_STATUS.DRAFT ? (
                    <p className="flex w-fit items-center px-3 py-[2px] text-[15px] text-[#ce7d98] font-inter tracking-wider rounded-full bg-slate-800 font-medium gap-x-2">
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

              <div className="flex md:flex-col flex-row items-center md:mt-0 mt-4 justify-center w-1/2 lg:w-[30%] gap-y-4 lg:gap-x-3 gap-x-2">
                <div>
                  <p className="text-xl font-medium tracking-wide text-richblack-25">
                    &#8377;{course.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex">
                  <button
                    className="p-3 text-teal-400 rounded-full hover:bg-slate-700"
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                  >
                    <LuFilePen className="text-xl" />
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
          </div>
        ))
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseTable;
