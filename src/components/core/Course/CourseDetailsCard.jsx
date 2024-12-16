import copy from "copy-to-clipboard";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";
import { motion } from "framer-motion";

const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course;

  const handleShare = () => {
    copy(window.location.href);
    toast.info("Link Copied to Clipboard.");
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("As an Instructor, you can't buy a course!");
      return;
    }
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add to cart.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          duration: 2,

          type: "spring",
          stiffness: 60,
          damping: 25,
        }}
        className="flex flex-col max-w-[380px] justify-center gap-4 p-5 rounded-md bg-slate-700 text-richblack-25 courseDetails"
      >
        {/* Course Image */}

        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] w-full min-h-[180px] flex mx-auto overflow-hidden rounded-md object-cover md:max-w-full"
        />

        <div className="">
          <div className="w-full pb-4 space-x-3 text-3xl font-semibold ">
            Rs. {CurrentPrice.toLocaleString("en-IN")}
          </div>
          <div className="flex flex-col gap-4 font-poppins">
            <button
              className="px-4 py-3 font-medium bg-teal-500 rounded-md hover:bg-teal-600 text-slate-800 hover:text-slate-200 "
              onClick={
                user && course?.studentsEnrolled.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && course?.studentsEnrolled.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
            </button>
            {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
              <button
                className="px-4 py-3 font-medium rounded-md bg-[#1b1f31] hover:bg-slate-800 text-slate-300 hover:text-slate-200"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            )}
          </div>
          <div>
            <p className="pt-6 pb-3 text-sm text-center text-richblack-25">
              15-Days Money-Back Gurantee
            </p>
          </div>

          <div className="px-4">
            <p className="my-2 text-lg font-semibold">This Course Includes:</p>

            <div className="flex flex-col gap-1 text-sm text-[#72a4ff]">
              {course?.instructions?.map((item, i) => (
                <p className="flex items-center gap-2" key={i}>
                  <BsFillCaretRightFill />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button
              className="flex items-center gap-2 py-8 mx-auto text-[#6bf1c4] "
              onClick={handleShare}
            >
              <FaRegShareFromSquare className="text-xl" />
              Share
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CourseDetailsCard;
