import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ChipInput from "./ChipInput";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleRight } from "react-icons/fa";
import { IoFlashSharp } from "react-icons/io5";
import {
  addCourseDetails,
  addCourseDetailsWithAI,
  addCourseThumbnail,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import RequirementField from "./RequirementField";
import IconBtn from "../../../../common/IconBtn";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import { toast } from "sonner";
import { COURSE_STATUS } from "../../../../../utils/constants";
import Upload from "../Upload";
import Spinner from "../../../../common/Spinner";

const CourseInformationForm = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [aiCourseName, setAICourseName] = useState("");
  const [aiImageURL, setAIImageURL] = useState("");

  const imgPrompt = (courseName) => {
    return `
Create a high-quality 16:9 thumbnail background inspired by the course topic: ${courseName}.
Do NOT include any text or letters in the image.

Use abstract, modern, educational visuals that clearly represent the concept.
Include clean technology design, soft gradients, neon accents, and a professional ed-tech style.
The composition should be sharp, minimalistic, and visually balanced.

No human characters, no logos, no watermarks.
High resolution, modern design suitable for an online course thumbnail.
`;
  };

  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  const [startGeneration, setStartGeneration] = useState(false);

  const firstInput = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const base64ToFile = async (dataUrl, fileName) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  // const handelAIThumbnail = async () => {
  //   setStartGeneration(true);
  //   try {
  //     if (!getValues("courseTitle")) {
  //       toast.error("First provide a course title!");
  //       return;
  //     }

  //     const courseTitle = getValues("courseTitle");

  //     const imgGenPrompt = imgPrompt(courseTitle);
  //     const resp = await addCourseThumbnail(imgGenPrompt, token);
  //     console.log(resp);
  //     const base64 = resp.data.image_buffer;
  //     const imageUrl = `data:image/png;base64,${base64}`;
  //     setAIImageURL(imageUrl);
  //     const aiFile = await base64ToFile(imageUrl, "thumbnail.png");
  //     setValue("courseImage", aiFile);
  //   } catch (error) {
  //     console.log("Error response in ai thumbnail generation: ", error);
  //   } finally {
  //     setStartGeneration(false);
  //   }
  // };

  const handelAIContentGeneration = async () => {
    setStartGeneration(true);
    try {
      const resp = await addCourseDetailsWithAI(aiCourseName, token);
      // console.log(resp);
      setValue("courseTitle", resp.title);
      setValue("courseDescription", resp.description);
      setValue("courseTags", resp.tags);
      const matchedCategory = courseCategories.find(
        (cat) => cat.name.toLowerCase() === resp.category.toLowerCase()
      );
      if (matchedCategory) {
        setValue("courseCategory", matchedCategory._id);
      }
      setValue("coursePrice", resp.price);
      setValue("courseBenefits", resp.learnings.join("\n"));
      setValue("courseRequirements", resp.instructions);
    } catch (error) {
      // console.log("Error response in ai generation: ", error);
      toast.error(
        "Some error occurred while generating content for the course."
      );
    } finally {
      setStartGeneration(false);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const result = await fetchCourseCategories();
      const categories = await result?.categoryDetails?.categories;
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseDescription", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }

    getCategories();
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course.name ||
      currentValues.courseDescription !== course.courseDescription ||
      currentValues.coursePrice !== course.coursePrice ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory !== course.category ||
      currentValues.courseRequirements !== course.instructions ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true;
    }
    return false;
  };

  const onSubmit = async (data) => {
    // console.log("Form data is coming: ", data);

    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseDescription !== course.courseDescription) {
          formData.append("courseDescription", data.courseDescription);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory);
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }

        // console.log("Form Data is: ", formData);

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No changes made to the form.");
      }
      return;
    }

    // Create a new course:
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseDescription);
    formData.append("price", data.coursePrice);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("thumbnailImage", data.courseImage);

    // console.log("Form Data is: ", formData);
    setLoading(true);
    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
  };

  return (
    <div className=' text-slate-300'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full p-5 space-y-8 bg-[#212b41] border-slate-500 rounded-xl text-richblack-50 text-[15px] relative pt-16 md:pt-14'
      >
        <span className='absolute w-11/12 md:w-fit px-4 rounded-bl-xl py-2 flex md:flex-row flex-col items-center gap-2 right-0 top-0 bg-gradient-to-br from-neutral-800 via-teal-600/10 to-neutral-900 shadow-xl shadow-black/20 text-white hover:text-teal-300 cursor-pointer'>
          <input
            value={aiCourseName}
            disabled={startGeneration}
            onChange={(e) => setAICourseName(e.target.value)}
            placeholder='Course Topic: DSA/AI...'
            className='placeholder:text-xs px-2 py-1 rounded-md bg-transparent shadow shadow-black/50 focus-within:shadow-xl focus-within:shadow-black/35 outline-none focus-visible:outline-none text-sm disabled:cursor-not-allowed disabled:opacity-75'
          />
          <button
            disabled={startGeneration}
            type='button'
            onClick={() => handelAIContentGeneration()}
            className='flex items-center group gap-x-2 bg-gradient-to-br from-black/20 via-black/40 to-black/20 px-4 py-1.5 rounded-full relative disabled:cursor-not-allowed disabled:opacity-85'
          >
            <div className='absolute bottom-0 inset-x-0 mx-auto w-3/4 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent'></div>
            <IoFlashSharp className='size-4 group-hover:translate-x-0.5 duration-200 ease-linear transition-all' />
            <p className='text-xs font-medium group-hover:-translate-x-0.5 duration-200 ease-linear transition-all'>
              Generate Content by AI
            </p>
          </button>
        </span>

        <div className='flex flex-col space-y-2'>
          <label htmlFor='courseTitle'>
            Course Title <sup className='text-pink-200'>*</sup>{" "}
          </label>
          <input
            id='courseTitle'
            ref={firstInput}
            placeholder='Enter Course Title'
            {...register("courseTitle", { required: true })}
            className='w-full px-2 py-3 text-xs md:text-sm rounded-md shadow-sm shadow-slate-500 bg-slate-900 text-slate-400 outline-none focus:border-slate-500 focus:border-[1px]'
          />
          {errors.courseTitle && (
            <span className='text-pink-200'>Course Title is required.</span>
          )}
        </div>
        <div className='flex flex-col space-y-2'>
          <label htmlFor='courseDescription'>
            Course Short Description <sup className='text-pink-200'>*</sup>{" "}
          </label>
          <textarea
            id='courseDescription'
            placeholder='Enter Course Description'
            {...register("courseDescription", { required: true })}
            className='w-full px-2 py-3 text-xs md:text-sm rounded-md shadow-sm shadow-slate-500 bg-slate-900 text-slate-400 outline-none focus:border-slate-500 focus:border-[1px] min-h-[140px] scrollbar-hide'
          />
          {errors.courseDescription && (
            <span className='text-pink-200'>
              Course Description is required.
            </span>
          )}
        </div>
        <div className='flex flex-col space-y-2'>
          <label htmlFor='coursePrice'>
            Course Price <sup className='text-pink-200'>*</sup>{" "}
          </label>
          <div className='relative w-full h-fit'>
            <input
              id='coursePrice'
              placeholder='Enter Course Price'
              {...register("coursePrice", {
                required: true,
                valueAsNumber: true,
              })}
              className='w-full pr-2 pl-12 py-3 text-xs md:text-sm rounded-md shadow-sm shadow-slate-500 bg-slate-900 text-slate-400 outline-none focus:border-slate-500 focus:border-[1px]'
            />
            <RiMoneyRupeeCircleLine className='absolute top-1/2 -translate-y-1/2 left-2 size-6 md:size-7 text-slate-500 ' />
          </div>
          {errors.coursePrice && (
            <span className='text-pink-200'>Course Price is required.</span>
          )}
        </div>
        <div className='flex flex-col space-y-2'>
          <label htmlFor='courseCategory'>
            Course Category <sup className='text-pink-200'>*</sup>{" "}
          </label>
          <select
            id='courseCategory'
            defaultValue={""}
            placeholder='Enter Course Price'
            {...register("courseCategory", {
              required: true,
            })}
            className='w-full px-2 py-3 text-sm rounded-md shadow-sm shadow-slate-500 bg-slate-900 text-slate-400 outline-none focus:border-slate-500 focus:border-[1px] cursor-pointer'
          >
            <option
              value=''
              disabled
              className='py-3 bg-richblack-800 text-slate-400'
            >
              Choose a Category
            </option>
            {!loading &&
              courseCategories.map((category, index) => (
                <option
                  key={index}
                  value={category?._id}
                  className='py-3 bg-richblack-800 text-slate-400'
                >
                  {category?.name}
                </option>
              ))}
          </select>

          {errors.courseCategory && (
            <span className='text-pink-200'>Course Category is required.</span>
          )}
        </div>
        {/* Tag Component */}
        <ChipInput
          label={"Tags"}
          name={"courseTags"}
          placeholder={"Enter Tags and Press Enter"}
          register={register}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
          externalValues={getValues("courseTags")}
        />

        {/* Upload */}
        <div className='relative'>
          {/* <span className='absolute right-0 text-xs'>
            <button type='button' onClick={() => handelAIThumbnail()}>
              Generate Thumbnail with AI
            </button>
          </span> */}
          <Upload
            name='courseImage'
            label='Course Thumbnail'
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            contentUploadSection={false}
            editData={editCourse ? course?.thumbnail : null}
            externalFile={getValues("courseImage")}
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor='courseBenefits'>
            Benefits of Course <sup className='text-pink-200'>*</sup>{" "}
          </label>
          <textarea
            id='courseBenefits'
            placeholder='Enter Course Benifits'
            {...register("courseBenefits", {
              required: true,
            })}
            className='w-full px-2 py-3 text-xs md:text-sm rounded-md shadow-sm shadow-slate-500 bg-slate-900 text-slate-400 outline-none focus:border-slate-500 focus:border-[1px] min-h-[120px] scrollbar-hide'
          />

          {errors.courseBenefits && (
            <span className='text-pink-200'>Course Benefits is required.</span>
          )}
        </div>

        <RequirementField
          name={"courseRequirements"}
          label={"Instructions/Content"}
          register={register}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
          externalValues={getValues("courseRequirements")}
        />

        <div className='flex flex-col items-center ml-auto md:flex-row w-fit gap-x-3'>
          {editCourse && (
            <button
              onClick={() => dispatch(setStep(2))}
              className='flex items-center px-2 py-2 rounded-md hover:bg-slate-800 hover:text-slate-100 bg-slate-700 text-slate-400'
            >
              Continue Without Saving
            </button>
          )}

          {loading && <Spinner />}

          <IconBtn
            children={<FaAngleRight />}
            disabled={loading}
            text={!editCourse ? "Next" : "Save Changes"}
            customClasses={`bg-cyan-700 flex-row-reverse gap-x-2 ml-3 rounded-md text-slate-200 px-4 py-2 hover:bg-cyan-600`}
          />
        </div>
      </form>
    </div>
  );
};

export default CourseInformationForm;
