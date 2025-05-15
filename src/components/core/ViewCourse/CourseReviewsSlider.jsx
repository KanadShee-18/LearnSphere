import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdArrowLeft, MdArrowRight, MdModeEdit } from "react-icons/md";
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import CourseReviewModal from "./CourseReviewModal";
import { HiOutlineTrash } from "react-icons/hi";
import { destroyRating } from "../../../services/operations/courseDetailsAPI";
import { toast } from "sonner";

const CourseReviewsSlider = ({ Reviews, Id }) => {
  let truncateWords = 20;
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const [reviewEditModal, setReviewEditModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const slideLeft = () => {
    const slider = document.getElementById(`${Id}`);
    slider.scrollLeft -= 250;
  };
  const slideRight = () => {
    const slider = document.getElementById(`${Id}`);
    slider.scrollLeft += 250;
  };

  const handleReviewDelete = async (reviewId) => {
    if (!reviewId || !token) return;
    try {
      await destroyRating(
        {
          reviewId: reviewId,
        },
        token
      );
      window.location.reload();
    } catch (error) {
      toast.error("Error occurred while deleting review. Try again!");
    }
  };

  return (
    <div className="text-slate-300">
      {Reviews?.length ? (
        <div className="relative">
          <div className="absolute z-30 flex gap-2 md:right-0 sm:right-4 -right-2 md:-top-10 -top-8">
            <button
              onClick={slideLeft}
              className="p-1 text-2xl text-teal-800 rounded-full bg-[#1e2736]  hover:text-teal-500 hover:bg-opacity-80"
            >
              <MdArrowLeft />
            </button>
            <button
              onClick={slideRight}
              className="p-1 text-2xl text-teal-800 rounded-full bg-[#1e2736] hover:text-teal-500 hover:bg-opacity-80"
            >
              <MdArrowRight />
            </button>
          </div>

          <div
            id={Id}
            className="w-full h-full px-4 mt-8 overflow-x-scroll md:px-0 whitespace-nowrap scroll-smooth scrollbar-hide"
          >
            {Reviews?.map((review, i) => (
              <div
                key={i}
                className="md:min-w-[230px] min-w-[170px] max-w-[300px] bg-gradient-to-br from-[#1d2c47] to-[#273f68] inline-block  md:h-[170px] h-[220px]  mb-16 rounded-md shadow-md bg-opacity-45 backdrop-blur-lg shadow-slate-600 p-4 md:mx-4 mx-2"
              >
                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-row items-center my-1 gap-x-2 justify-between">
                    <div className="flex flex-row items-center my-1 gap-x-2">
                      {review?.user?.image && (
                        <img
                          src={review?.user?.image}
                          className="w-5 h-5 "
                          alt="User"
                        />
                      )}
                      <p className="text-sm md:text-[15px] text-slate-400">
                        {review?.user?.firstName} {review?.user?.lastName}
                      </p>
                    </div>
                    {review?.user?._id === user?._id && (
                      <div className="flex flex-row items-center gap-x-1">
                        <span
                          onClick={() => {
                            setReviewEditModal(true);
                            setReviewData(review);
                          }}
                          className="relative group"
                        >
                          <MdModeEdit className="p-1 w-6 h-6 text-teal-300 bg-slate-400 rounded-full bg-opacity-30 hover:bg-opacity-20 shadow-sm shadow-slate-800 cursor-pointer" />
                          <p className="absolute invisible text-nowrap tracking-wider text-slate-100 text-[10px] font-normal px-2 py-0.5 rounded-md group-hover:visible -top-5 -left-4 bg-slate-900 bg-opacity-60">
                            Edit
                          </p>
                        </span>
                        <span
                          onClick={() => handleReviewDelete(review?._id)}
                          className="relative group"
                        >
                          <HiOutlineTrash className="p-1 w-6 h-6 text-rose-300 hover:text-rose-400 bg-slate-400 rounded-full bg-opacity-30 hover:bg-opacity-20 shadow-sm shadow-slate-800 cursor-pointer" />
                          <p className="absolute invisible text-nowrap tracking-wider text-slate-100 text-[10px] font-normal px-2 py-0.5 rounded-md group-hover:visible -top-5 -left-4 bg-slate-900 bg-opacity-60">
                            Delete
                          </p>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="relative w-full group hover:cursor-pointer">
                    <p className="text-[#93a4da] tracking-wide text-wrap text-xs">
                      {review?.review.split(" ").length > truncateWords
                        ? `${review?.review
                            ?.split(" ")
                            .slice(0, truncateWords)
                            .join(" ")} ...`
                        : `${review?.review}`}
                    </p>

                    <p className="text-slate-300 absolute text-wrap hidden group-hover:block z-[30] -top-1 p-2 rounded-lg bg-slate-900 bg-opacity-35 backdrop-blur-md h-auto text-[13px]">
                      {review?.review}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-x-2">
                    <p className="text-sm">{review?.rating}</p>
                    <ReactStars
                      count={5}
                      value={review?.rating}
                      size={16}
                      edit={false}
                      activeColor={"#14e0b1"}
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                      color={"#798fba"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-base text-start pl-10 text-blue-100">No Reviews</p>
      )}

      {reviewEditModal && (
        <CourseReviewModal
          setReviewEditModal={setReviewEditModal}
          reviewData={reviewData}
          isEdit={true}
        />
      )}
    </div>
  );
};

export default CourseReviewsSlider;
