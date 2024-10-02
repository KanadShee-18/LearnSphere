import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CgAdd } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import NestedView from "./NestedView";
import {
  setCourse,
  setStep,
  setEditCourse,
} from "../../../../../slices/courseSlice";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";

const CourseBuilderForm = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  // Handling form submit.
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

    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  };

  // Cancelling editing section name
  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  // Handle toggling between edit and create section name:
  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  // Go back and Go next:
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  const goNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section to go to the next step.");
      return;
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error(
        "Please add atleast one lecture in each section to proceed further."
      );
      return;
    }
    dispatch(setStep(3));
  };

  return (
    <div className="mb-36">
      <div className="p-6 rounded-lg bg-[#1c273b]">
        <h1 className="mb-3 text-2xl text-slate-300">Structure Your Course</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="sectionName"
              className="text-[15px] text-richblack-25"
            >
              Section Name <sup className="text-pink-200">*</sup>
            </label>
            <input
              type="text"
              disabled={loading}
              id="sectionName"
              {...register("sectionName", { required: true })}
              placeholder="Add a section for your course"
              className="w-full px-4 py-3 text-sm rounded-lg outline-none bg-slate-700 focus:border-blue-300 focus:border-[1px] text-slate-300"
            />
            {errors.sectionName && (
              <span className="ml-2 text-sm tracking-wide text-blue-100">
                Section Name is required.
              </span>
            )}

            <div className="flex flex-row items-center justify-start gap-x-2">
              <button
                type="submit"
                className="flex text-sm hover:text-slate-900 hover:bg-teal-600 items-center px-3 py-2  text-teal-500 border-teal-500 rounded-md gap-x-2 bg-slate-800 border-[1px]"
              >
                <CgAdd className=" size-5" />
                {editSectionName ? "Edit Section Name" : "Create Section"}
              </button>
              {editSectionName && (
                <button
                  className="flex px-2 py-2 text-sm rounded-md bg-slate-700"
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Nested View */}
        {course.courseContent.length > 0 && (
          <NestedView
            handleChangeEditSectionName={handleChangeEditSectionName}
          />
        )}

        {/* next, prev button  */}

        <div className="flex justify-end my-3 gap-x-3">
          <button
            onClick={goBack}
            className="flex  bg-[#2b4861] rounded-md hover:bg-[#273d50] text-slate-200 text-sm items-center px-3 py-2 gap-x-1"
          >
            <IoIosArrowBack />
            Back
          </button>
          <button
            onClick={goNext}
            className="flex font-medium bg-[#2d92a0] rounded-md hover:bg-[#2d4270] hover:text-slate-300 text-slate-900 text-sm items-center px-3 py-2 gap-x-1"
          >
            Next
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
