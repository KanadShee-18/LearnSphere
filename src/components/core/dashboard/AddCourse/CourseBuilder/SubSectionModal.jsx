import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import Upload from "../Upload";
import { setCourse } from "../../../../../slices/courseSlice";
import Spinner from "../../../../common/Spinner";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  // Check if form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues();

    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    }
    return false;
  };

  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }
    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) return;
    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No Chnages have made to the form.");
      } else {
        handleEditSubsection();
      }
      return;
    }

    // Create new Sub Section:

    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo);

    setLoading(true);
    const result = await createSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-slate-700 bg-opacity-45 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-blue-200 bg-gradient-to-br from-slate-800 via-[#1d2d44] to-slate-800">
        {/* Upper part heading and cross button */}
        <div className="flex items-center justify-between p-5 rounded-t-lg bg-gradient-to-r from-[#4f6a7c] to-[#325770]">
          <p className="text-xl font-semibold text-slate-200 font-poppins">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700"
            onClick={() => (!loading ? setModalData(null) : {})}
          >
            <RxCross2 className="text-xl text-slate-100" />
          </button>
        </div>

        {/* Modal form */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-8 py-10 space-y-7"
        >
          {/* Upload Lecture Video using upload file */}
          <Upload
            name="lectureVideo"
            label="Drop Lecture Video Here"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="lectureTitle" className="text-sm text-slate-300">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter the Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="w-full px-4 py-3 text-sm rounded-lg outline-none bg-slate-600 bg-opacity-70 focus:border-blue-300 focus:border-[1px] text-slate-200"
            />
            {errors.lectureTitle && (
              <span className="text-sm tracking-wide text-blue-100">
                Lecture Title is Required!
              </span>
            )}
          </div>

          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="lectureDesc" className="text-sm text-slate-300">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter the Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="w-full min-h-[130px] px-4 py-3 text-sm rounded-lg outline-none bg-slate-600 bg-opacity-70 focus:border-blue-300 focus:border-[1px] text-slate-300"
            />
            {errors.lectureDesc && (
              <span className="text-sm tracking-wide text-blue-100">
                Lecture Description is Required!
              </span>
            )}
          </div>

          {/* Show button accoring to state */}
          <div className="flex items-center justify-center gap-x-5">
            <button className="flex px-5 rounded-lg py-2 bg-[#2c5f81] hover:bg-[#255270]">
              {loading ? "Loading..." : edit ? "Save Changes" : "Save"}
            </button>
            {loading && <Spinner />}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubSectionModal;
