import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseEntireData,
  setCourseSectionData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import { useToken } from "../context/TokenContext";

const ViewCourse = () => {
  const dispatch = useDispatch();
  const { token } = useToken();
  const { courseId } = useParams();
  const [reviewModal, setReviewModal] = useState(false);

  useEffect(() => {
    const courseSpecificDetails = async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent));
      dispatch(setCourseEntireData(courseData?.courseDetails));
      dispatch(setCompletedLectures(courseData?.completedVideos));
      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    };
    courseSpecificDetails();
  }, []);

  return (
    <>
      <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className='h-calc-[100vh-3.5rem] mt-14 flex-1 overflow-auto'>
          <div className='mx-3'>
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
