import React, { useEffect, useState } from "react";
import { get, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../../../../context/TokenContext";

const PublishCourse = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useToken();
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, []);

  const handleCoursePublish = async () => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // no changes happened in form so no need to make an api call
      goToCourses();
      return;
    }
    // But if form updates
    const formData = new FormData();
    formData.append("courseId", course._id);
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;
    formData.append("status", courseStatus);
    // make api call to update course
    setLoading(true);
    const result = await editCourseDetails(formData, token);
    if (result) {
      goToCourses();
    }
    setLoading(false);
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  const onSubmit = async (data) => {
    handleCoursePublish();
  };

  const goBack = () => {
    dispatch(setStep(2));
  };

  return (
    <div className="my-10 rounded-lg bg-[#292f4d] p-5 publishedCourse">
      <p className="mb-2 text-xl text-slate-100">Publish Course</p>
      <div className="mb-8 w-full h-[2px] bg-slate-500"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row items-center space-y-3">
          <label htmlFor="public" className="flex flex-row items-center">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="w-5 h-5 transition duration-300 ease-in-out border-2 rounded-md border-slate-500 bg-richblack-700 text-cyan-500 checked:bg-cyan-500 checked:border-cyan-500 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            />
            <span className="ml-3 text-teal-500">
              Make This Course as Public
            </span>
          </label>
        </div>
        <div className="flex justify-end w-full mt-10 gap-x-3">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex items-center px-5 py-2 rounded-lg text-slate-300 bg-[#303957] hover:bg-slate-600"
          >
            Back
          </button>
          <button
            disabled={loading}
            className="flex items-center px-3 py-2 font-medium bg-teal-400 rounded-md text-slate-900 hover:bg-teal-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublishCourse;
