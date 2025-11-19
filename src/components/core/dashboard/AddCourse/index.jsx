import React from "react";
import RenderSteps from "./RenderSteps";
import { MdTipsAndUpdates } from "react-icons/md";

const index = () => {
  return (
    <>
      <div className='flex w-full lg:flex-row flex-col-reverse items-center lg:items-start justify-between gap-x-6 max-w-[1200px] mx-auto p-4'>
        <div className='md:w-[70%] w-11/12'>
          <h1 className='mb-3 text-3xl text-richblack-25'>Add Course</h1>
          <div>
            <RenderSteps />
          </div>
        </div>

        <div className='p-4 rounded-xl bg-[#233149] max-w-[470px] mb-7 min-w-[200px] bg-opacity-65 backdrop-blur-md shadow-md shadow-slate-600 '>
          <p className='flex items-center pt-5 ml-3 text-lg md:text-2xl text-cyan-500'>
            <MdTipsAndUpdates className='mr-3 text-yellow-100 size-5 md:size-10' />{" "}
            Course Upload Tips
          </p>
          <ul className='flex flex-col mx-6 mt-5 mb-4 text-sm md:text-xl list-disc gap-y-3 text-slate-400 font-eduSa'>
            <li>Set the Course Price option or set it free.</li>
            <li>Standard size for the course thumbnail is 1024 x 576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
          <p className='px-3 my-3 font-semibold text-blue-100 text-sm md:text-base'>
            If any problem occurrs while creating lecture, feel free to contact
            with{" "}
            <span className='text-purple-300 font-eduSa'>
              kanadshee18@gmail.com
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default index;
