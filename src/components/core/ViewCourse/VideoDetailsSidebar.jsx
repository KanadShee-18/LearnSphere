import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { BsChevronDown } from "react-icons/bs";
import { RiMenuUnfold3Fill, RiMenuFold3Fill } from "react-icons/ri";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const { sectionId, subSectionId } = useParams();
  const [showSidebar, setShowSidebar] = useState(false);
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

  return (
    <>
      {showSidebar && (
        <div className="mt-14 flex md:static fixed z-[50] min-h-screen w-[230px] md:w-[320px] max-w-[350px] flex-col border-r-[1px] md:bg-opacity-100 bg-opacity-35 backdrop-blur-md border-r-slate-600 bg-slate-800">
          <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-slate-600 py-5 md:text-lg text-base font-bold text-[#cff5ff]">
            <div className="flex items-center justify-between w-full">
              <div
                className="relative flex p-2 rounded-full shadow-md group hover:cursor-pointer bg-slate-400 bg-opacity-40 hover:bg-opacity-60 shadow-slate-950"
                onClick={() => {
                  navigate("/dashboard/enrolled-courses");
                }}
              >
                <IoIosArrowBack />
                <p className="absolute invisible text-nowrap text-[10px] font-normal px-1 rounded-md group-hover:visible -top-6 bg-slate-500 bg-opacity-30">
                  Go Back
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-3">
                <button
                  onClick={() => setReviewModal(true)}
                  className="relative px-2 py-2 text-xs font-semibold transition-all duration-200 transform bg-teal-500 rounded-md shadow-md md:px-4 md:text-sm group bg-opacity-85 text-slate-900 shadow-slate-900 hover:bg-teal-600 hover:text-slate-100 hover:scale-95"
                >
                  + Review
                  <p className="absolute invisible text-nowrap text-[10px] font-normal px-1 rounded-md group-hover:visible -top-6 left-0 bg-slate-500 bg-opacity-30">
                    Add a Review
                  </p>
                </button>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="relative p-2 text-base font-semibold bg-teal-500 rounded-full shadow-md md:text-lg group hover:cursor-pointer shadow-slate-950 text-slate-900 hover:bg-slate-300"
                >
                  <RiMenuFold3Fill />
                  <p className="absolute invisible text-nowrap text-slate-100 text-[10px] font-normal px-1 rounded-md group-hover:visible -bottom-8 left-4 bg-slate-500 bg-opacity-60">
                    Collapse
                  </p>
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-[#cef4f7] tracking-wide md:text-base text-sm">
                {courseEntireData?.courseName}
              </p>
              <p className="md:text-[13px] text-xs font-semibold  text-slate-400">
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

                <div className="flex flex-row justify-between px-3 py-2 md:text-sm text-xs md:py-4 bg-[#2b384e] shadow-md shadow-slate-900 rounded-md hover:bg-opacity-85 mb-3">
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
                        className={`flex gap-3 my-2 md:mx-3 mx-1 px-3 py-2 ${
                          videoBarActive === topic._id
                            ? "bg-[#3a4d6d]  text-[#aebfe4] shadow-md shadow-slate-900"
                            : "hover:bg-[#4c6081] text-[#939dc9]"
                        } font-semibold md:text-sm text-xs rounded-md hover:text-teal-400 transition-all duration-300 hover:scale-95 `}
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
      )}

      {!showSidebar && (
        <div
          onClick={() => setShowSidebar(true)}
          className="fixed group hover:cursor-pointer h-fit w-fit p-2 mt-16 text-xl font-semibold bg-teal-500 rounded-full left-2 text-slate-900 hover:bg-slate-200 z-[50] bg-opacity-70 md:bg-opacity-100 shadow-md md:shadow-blue-200 shadow-slate-800 backdrop-blur-md"
        >
          <RiMenuUnfold3Fill />
          <p className="absolute invisible text-nowrap text-slate-100 text-[10px] font-normal px-1 rounded-md group-hover:visible -bottom-10 left-0 bg-slate-500 bg-opacity-60">
            Expand
          </p>
        </div>
      )}
    </>
  );
};

export default VideoDetailsSidebar;
