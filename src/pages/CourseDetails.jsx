import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Spinner from "../components/common/Spinner";
import Error from "./Error";
import RatingStars from "../components/common/RatingStars";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { formatDate } from "../services/formatDate";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import ReactMarkdown from "react-markdown";
import Footer from "../components/common/Footer";
import CourseAccordianBar from "../components/core/Course/CourseAccordianBar";
import { buyCourse } from "../services/operations/studentFeaturesAPI";

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
  const [confirmationModal, setConfirmationModal] = useState(null);

  useEffect(() => {
    // Fetch course details
    (async () => {
      try {
        const res = await fetchCourseDetails(courseId);
        setResponse(res);
      } catch (error) {
        console.log("Could not fetch course details.");
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

  // Collapse all Course Content
  const [isActive, setIsActive] = useState(Array(0));
  const handleActive = (id) => {
    // console.log("called", id)
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    );
  };

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

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You're not logged in!",
      text2: "Please Login to Purchase This Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  if (paymentLoading) {
    return (
      <div className="w-full place-content-center h-52">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="relative text-white mt-14 bg-richblack-800">
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-w-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="Course Thumbnail"
                className="w-full aspect-auto"
              />
            </div>
            <div className="z-30 flex flex-col justify-center gap-4 py-5 my-5 text-lg text-slate-400">
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseName}
                </p>
              </div>
              <p className="text-slate-400 text-[15px] font-poppins">
                {courseDescription}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-md">
                <span className="text-teal-500">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span className="text-[15px] font-poppins text-richblack-100">
                  {`- ${ratingAndReviews.length} Reviews -`}{" "}
                </span>
                <span className="text-[15px] font-poppins text-richblack-100">
                  {`${studentsEnrolled.length} Students Enrolled`}{" "}
                </span>
              </div>
              <div>
                <p className=" text-[13px]">
                  Created By {`${instructor.firstName} ${instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-richblack-100 font-poppins">
                <p className="flex items-center gap-2">
                  <BiInfoCircle className="text-xl" /> Created at{" "}
                  {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2 text-teal-500">
                  <HiOutlineGlobeAlt className="text-xl" /> English
                </p>
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 py-4 border-y border-y-slate-600 lg:hidden">
              <p className="pb-4 space-x-3 text-3xl font-semibold text-richblack-25">
                Rs. {price}
              </p>
              <button
                onClick={handleBuyCourse}
                className="px-4 py-3 font-medium bg-teal-500 rounded-md hover:bg-teal-600 text-slate-800 hover:text-slate-200"
              >
                Buy Now
              </button>
              <button className="px-4 py-3 font-medium rounded-md bg-slate-700 hover:bg-slate-800 text-slate-300 hover:text-slate-200">
                Add to Cart
              </button>
            </div>
          </div>

          {/* Courses Card */}

          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
            <CourseDetailsCard
              course={response?.data?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn */}
          <div className="p-8 my-8 border rounded border-slate-700 bg-slate-800">
            <p className="text-[28px] font-semibold text-slate-300">
              Learnings From This Course
            </p>
            <div className="mt-5 text-[#7a82a8] font-poppins">
              <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="max-w-[830px]">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span className="text-[#7a82a8] font-poppins">
                    {courseContent.length} {`section(s) -`}
                  </span>
                  <span className="text-[#7a82a8] font-poppins">
                    {totalNoOfLectures} {`lecture(s) -`}
                  </span>
                  <span className="text-[#7a82a8] font-poppins">
                    {response.data?.totalDuration} total length
                  </span>
                </div>
                <div>
                  <button
                    className="text-teal-500"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>

            {/* Course Details Accordian */}
            <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordianBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author Details */}
            <div className="py-4 mb-12">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    instructor.image
                      ? instructor.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt="Author"
                  className="object-cover rounded-full h-14 w-14"
                />
                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
              </div>
              <p className="text-[#7a82a8]">
                {instructor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default CourseDetails;
