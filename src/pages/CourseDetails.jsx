import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Spinner from "../components/common/Spinner";
import Error from "./Error";

const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courseId } = useParams();

  // Saving course details in a state
  const [response, setResponse] = useState(null);
  const [confirmantionMdal, setConfirmantionMdal] = useState(null);

  useEffect(() => {
    // Calling fetchCourseDetails fucntion to fetch the details
    (async () => {
      try {
        const res = await fetchCourseDetails(courseId);
        // console.log("course details res: ", res)
        setResponse(res);
      } catch (error) {
        console.log("Could not fetch Course Details");
      }
    })();
  }, [courseId]);

  // Calculating average rating count

  const [avgReviewCount, setAvgReviewCount] = useState(0);
  useEffect(() => {
    console.log(
      "Count passed: ",
      response?.data?.courseDetails.ratingAndReviews
    );
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews);

    setAvgReviewCount(count);
  }, [response]);

  // Total lectures:
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  useEffect(() => {
    let lectures = 0;
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [response]);

  if (loading || !response) {
    return (
      <div className="w-full place-content-center h-52">
        <Spinner />
      </div>
    );
  }

  if (!response.success) {
    return <Error />;
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response?.data?.courseDetails;

  if (paymentLoading) {
    return (
      <div className="w-full place-content-center h-52">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative text-white mt-14 bg-richblack-800">
      {/* Hero Section */}
      {/* <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">

        <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-w-[30rem] lg:hidden">
                <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]">

                </div>
                <img src="" alt="" />

            </div>

        </div>


    </div> */}
    </div>
  );
};

export default CourseDetails;
