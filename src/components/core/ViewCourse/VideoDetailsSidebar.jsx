import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { BsChevronDown } from "react-icons/bs";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const { sectionId, subSectionId } = useParams();
  // NOTE: Take all data from state
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    const setActiveFlags = () => {
      if (!courseSectionData?.length) return;
      const currentSectionIndex = courseSectionData?.findIndex(
        (data) => data._id === sectionId
      );
      const currentSubSectionIndex = courseSectionData?.[
        currentSectionIndex
      ]?.subSection.findIndex((data) => data._id === subSectionId);
      const activeSubSectionId =
        courseSectionData?.[currentSectionIndex]?.subSection?.[
          currentSubSectionIndex
        ]?._id;
      // NOTE: Set the section for highlighting
      setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
      // NOTE: Set the subsection for highlighting
      setVideoBarActive(activeSubSectionId);
    };
    setActiveFlags();
  }, [courseSectionData, courseEntireData, location.pathname]);

  // const handleCompletedLecture = async (courseId, subSectionId) => {
  //   setLoading(true);
  //   const res = await markLectureAsComplete(
  //     {
  //       courseId: courseId,
  //       subSectionId: subSectionId,
  //     },
  //     token
  //   );
  //   if (res) {
  //     dispatch(updateCompletedLectures(subSectionId));
  //   }
  //   setLoading(false);
  // };

  console.log("Completed Lectures: ", completedLectures);

  return (
    <>
      <div className="mt-14 flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-slate-600 bg-slate-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-slate-600 py-5 text-lg font-bold text-[#cff5ff]">
          <div className="flex items-center justify-between w-full">
            <div
              className="flex p-2 rounded-full shadow-md hover:cursor-pointer bg-slate-400 bg-opacity-40 hover:bg-opacity-60 shadow-slate-950"
              onClick={() => {
                navigate("/dashboard/enrolled-courses");
              }}
            >
              <IoIosArrowBack />
            </div>
            <button
              onClick={() => setReviewModal(true)}
              className="px-4 py-2 text-sm font-semibold transition-all duration-200 transform bg-teal-500 rounded-md shadow-md bg-opacity-85 text-slate-900 shadow-slate-900 hover:bg-teal-600 hover:text-slate-100 hover:scale-95"
            >
              + Review
            </button>
          </div>
          <div className="flex flex-col">
            <p className="text-[#cef4f7] tracking-wide text-base">
              {courseEntireData?.courseName}
            </p>
            <p className="text-[13px] font-semibold  text-slate-400">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>
        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((course, index) => (
            <div
              className="mx-5 mt-2 text-sm cursor-pointer text-slate-200"
              onClick={() => setActiveStatus(course?._id)}
              key={index}
            >
              {/* Section */}

              <div className="flex flex-row justify-between px-3 py-4 bg-[#2b384e] shadow-md shadow-slate-900 rounded-md hover:bg-opacity-85 mb-3">
                <div className="w-[75%] font-semibold text-slate-300 ">
                  {course?.sectionName}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      activeStatus === course?._id ? "rotate-0" : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Section */}
              {activeStatus === course?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {course.subSection.map((topic, idx) => (
                    <div
                      className={`flex gap-3 my-2 mx-3 px-3 py-2 ${
                        videoBarActive === topic._id
                          ? "bg-[#3a4d6d]  text-[#aebfe4] shadow-md shadow-slate-900"
                          : "hover:bg-[#4c6081] text-[#939dc9]"
                      } font-semibold rounded-md hover:text-teal-400 transition-all duration-300 hover:scale-95 `}
                      key={idx}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                        );
                        setVideoBarActive(topic._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        onChange={() => {}}
                      />
                      {topic?.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoDetailsSidebar;
