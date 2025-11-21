import { useForm } from "react-hook-form";
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import {
  createRating,
  modifyRating,
} from "../../../services/operations/courseDetailsAPI";
import { RxCross2 } from "react-icons/rx";
import { useToken } from "../../../context/TokenContext";

const CourseReviewModal = ({
  setReviewModal,
  setReviewEditModal,
  reviewData,
  isEdit = false,
}) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useToken();
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseExperience: isEdit ? reviewData?.review || "" : "",
      courseRating: isEdit ? reviewData?.rating || 1 : 1,
    },
  });

  const ratingValue = watch("courseRating");

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating);
  };
  // reviewId, rating, review
  const onSubmit = async (data) => {
    if (isEdit) {
      try {
        await modifyRating(
          {
            reviewId: reviewData?._id,
            rating: data.courseRating,
            review: data.courseExperience,
          },
          token
        );
        window.location.reload();
      } catch (error) {
        toast.error("Error occurred while updating review. Try again!");
      } finally {
        isEdit ? setReviewEditModal(false) : setReviewModal(false);
      }
    } else {
      try {
        await createRating(
          {
            courseId: courseEntireData._id,
            rating: data.courseRating,
            review: data.courseExperience,
          },
          token
        );
        window.location.reload();
      } catch (error) {
        toast.error("Error occurred while adding review. Try again!");
      } finally {
        isEdit ? setReviewEditModal(false) : setReviewModal(false);
      }
    }
  };

  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-slate-800 bg-opacity-25 backdrop-blur-sm'>
      <div className='my-10 w-11/12 max-w-[700px] rounded-lg border border-slate-500 bg-gradient-to-br from-[#1e2d44] to-[#1d324e]'>
        <div className='flex items-center justify-between p-5 bg-opacity-75 rounded-t-lg bg-[#2e4261]'>
          <p className='text-xl font-semibold text-richblack-5'>
            {isEdit ? "Modify Review" : "Add Review"}
          </p>
          <button
            onClick={() => {
              if (isEdit) {
                setReviewEditModal(false);
              } else {
                setReviewModal(false);
              }
            }}
          >
            <RxCross2 className='p-1 text-2xl rounded-full bg-slate-700 duration-200 shadow-sm shadow-slate-900 hover:bg-black hover:scale-105 transition-all hover:text-teal-400 w-7 h-7' />
          </button>
        </div>
        {/* Modal Body */}
        <div className='p-6'>
          <div className='flex items-center justify-center gap-x-4'>
            <img
              src={user?.image}
              alt={user?.firstName + "Profile"}
              className='aspect-square object-cover w-[50px] rounded-full'
            />
            <div className=''>
              <p className='font-semibold text-slate-300'>
                {user?.firstName} {user?.lastName}
              </p>
              <p className='text-sm text-blue-50'>Posting Publicly</p>
            </div>
          </div>
          <div className='w-full h-px bg-slate-500 my-4' />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col space-y-4 items-center mt-6 text-slate-300'
          >
            <div className='flex flex-col items-center'>
              <p>Add a Rating (out of 5) </p>
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor='#2de3bf'
                color='#798fba'
                value={ratingValue}
              />
            </div>
            <div className='flex flex-col w-11/12 space-y-2'>
              <label
                htmlFor='courseExperience'
                className='text-lg font-medium text-slate-400'
              >
                {isEdit ? "Modify" : "Add"} Your Experience{" "}
                <sup className='text-pink-200'>*</sup>
              </label>
              <textarea
                id='courseExperience'
                placeholder={
                  isEdit ? "Modify your experience" : "Add your experience"
                }
                {...register("courseExperience", { required: true })}
                className='resize-none p-2 rounded-md bg-[#354d70] placeholder:text-blue-100 focus:outline-none min-h-[130px] shadow-md shadow-slate-900 text-slate-300 w-full'
              />
              {errors.courseExperience && (
                <span className='ml-2 text-xs tracking-wide text-pink-200'>
                  Please share your experience
                </span>
              )}
            </div>
            <div className='flex flex-row items-center mt-3 gap-x-3'>
              <button
                onClick={() => {
                  if (isEdit) {
                    setReviewEditModal(false);
                  } else {
                    setReviewModal(false);
                  }
                }}
                className='px-3 py-2 rounded-md bg-[#293e5e] hover:bg-slate-900 active:bg-slate-950 shadow-sm shadow-slate-900'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-5 py-2 font-semibold bg-teal-500 rounded-md text-slate-800 hover:bg-teal-600 active:bg-teal-500 shadow-sm shadow-slate-900'
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
