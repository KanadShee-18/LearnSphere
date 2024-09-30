import React from "react";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
// import { PublishCourse } from "./PublishCourse/index";

const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ];

  return (
    <>
      <div className="relative flex justify-center w-full mb-2">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center " key={item.id}>
              <button
                className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                  step >= item.id
                    ? "border-cyan-400 bg-[#1b2536] text-teal-300"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"
                } ${step > item.id && "bg-cyan-300 text-yellow-50"}} `}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  item.id
                )}
              </button>
            </div>
            {item.id !== steps.length && (
              <>
                <div
                  className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${
                    step > item.id ? "border-cyan-300" : "border-richblack-500"
                  } `}
                ></div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="relative flex justify-between w-full mb-16 select-none">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div
              className="flex min-w-[130px] flex-col items-center gap-y-2"
              key={item.id}
            >
              <p
                className={`text-sm ${
                  step >= item.id ? "text-cyan-400" : "text-richblack-500"
                }`}
              >
                {item.title}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {/* {step === 3 && <PublishCourse />} */}
    </>
  );
};

export default RenderSteps;
