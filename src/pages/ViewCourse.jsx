import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseEntireData,
  setCourseSectionData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";

const ViewCourse = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
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
      <div>
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div>
          <Outlet />
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
