import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import { createRating } from "../../../services/operations/courseDetailsAPI";
import { RxCross2 } from "react-icons/rx";

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  }, []);

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating);
  };

  const onSubmit = async (data) => {
    const newCreatedRating = await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    const errMsg = newCreatedRating?.data?.response?.message;

    setReviewModal(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-slate-800 bg-opacity-25 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-slate-500 bg-gradient-to-br from-[#1e2d44] to-[#1d324e]">
        <div className="flex items-center justify-between p-5 bg-opacity-75 rounded-t-lg bg-[#2e4261]">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="p-1 text-2xl rounded-full bg-slate-400 hover:bg-slate-800 hover:text-slate-200" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4">
            <img
              src={user?.image}
              alt={user?.firstName + "Profile"}
              className="aspect-square object-cover w-[50px] rounded-full"
            />
            <div className="">
              <p className="font-semibold text-slate-300">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-blue-50">Posting Publicly</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center mt-6 text-slate-300"
          >
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#2de3bf"
              color="#798fba"
            />
            <div className="flex flex-col w-11/12 space-y-2">
              <label
                htmlFor="courseExperience"
                className="text-lg font-medium text-slate-400"
              >
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Add your experience"
                {...register("courseExperience", { required: true })}
                className="resize-none p-2 rounded-md bg-[#354d70] placeholder:text-blue-100 focus:outline-none min-h-[130px] shadow-md shadow-slate-900 text-slate-300 w-full"
              />
              {errors.courseExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Please share your experience
                </span>
              )}
            </div>
            <div className="flex flex-row items-center mt-3 gap-x-3">
              <button
                onClick={() => setReviewModal(false)}
                className="px-3 py-2 rounded-md bg-[#293e5e] hover:bg-slate-900 active:bg-slate-950"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold bg-teal-500 rounded-md text-slate-800 hover:bg-teal-600 active:bg-teal-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
