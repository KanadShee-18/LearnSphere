import React, { useState } from "react";
import { useForm } from "react-hook-form";
import NestedView from "./NestedView";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleRight } from "react-icons/fa";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import { toast } from "react-toastify";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";

const CourseBuilderForm = () => {
  const dispatch = useDispatch();
  const { course, editCourse } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [editSectionName, setEditSectionName] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }
    // Update values after valid result
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    // All done, so make loading false
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };
  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Plese add atleast one section to move forward.");
      return;
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Plese add atleast one sub section for further process.");
      return;
    }
    // if everything good move to next step
    dispatch(setStep(3));
  };

  const handleChnageEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="text-white w-full p-5 space-y-8 bg-[#182133]  border-slate-500 rounded-xl">
      <h1 className="mb-8 text-2xl text-slate-300">Structure Your Course</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" text-richblack-50 text-[15px]"
      >
        <div className="flex flex-col space-y-2">
          <label htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Enter your Section Name"
            {...register("sectionName", { required: true })}
            className="w-full px-2 py-3 text-sm rounded-md shadow-sm shadow-slate-500 bg-richblack-700 text-slate-400 outline-none focus:border-slate-500 focus:border-[1px]"
          />
          {errors.sectionName && (
            <span className="text-pink-200">Section Name is required.</span>
          )}
        </div>
        <div className="flex flex-row mt-4 gap-x-5">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center cursor-pointer px-2 py-2 text-sm rounded-md border-[1px] border-cyan-500 hover:bg-slate-900 text-cyan-500 gap-x-2 bg-slate-800"
          >
            {editSectionName ? "Edit Section Name" : "Create Section"}
            <MdOutlineAddCircleOutline className="size-6" />
          </button>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {course.courseContent.length > 0 && (
        <NestedView handleChnageEditSectionName={handleChnageEditSectionName} />
      )}

      <div className="flex items-center justify-end mt-10 mb-32 text-sm gap-x-3">
        <button
          className="px-4 py-2 rounded-md cursor-pointer bg-slate-700 text-slate-200"
          onClick={goBack}
        >
          Back
        </button>
        <button
          className="flex items-center px-2 py-2 font-medium rounded-md cursor-pointer gap-x-2 bg-cyan-500 text-slate-900"
          onClick={goToNext}
        >
          Next <FaAngleRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
