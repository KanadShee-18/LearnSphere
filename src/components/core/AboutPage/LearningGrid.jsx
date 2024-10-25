import React from "react";
import HighlightText from "../homeaccessories/HighlightText";
import CTAButton from "../Homepage/CTAButton";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Anyone, Anywhere",
    description:
      "Learnsphere partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "Learnsphere partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Learnsphere partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "Learnsphere partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "Learnsphere partners with more than 275+ leading universities and companies to bring",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid w-11/12 grid-cols-1 mx-auto my-32 text-white lg:grid-cols-4">
      {LearningGridArray.map((card, index) => (
        <div
          key={index}
          className={`${index === 0 && "lg:col-span-2"}
            ${
              card.order % 2 === 1
                ? "bg-gradient-to-br from-slate-700 to-richblack-700"
                : "bg-gradient-to-br from-blue-600 to-slate-700"
            }
            ${card.order === 3 && "lg:col-start-2"}
            mx-auto col-span-1 lg:w-auto md:w-[350px] lg:h-[270px] 
            lg:rounded-none rounded-lg lg:mb-0 mb-3 hover:scale-95 transition-all duration-200 cursor-pointer`}
        >
          {card.order < 0 ? (
            <div className="flex flex-col p-4">
              <h1 className="mb-3 text-4xl font-medium text-slate-300">
                {card.heading} <HighlightText text={card.highlightText} />
              </h1>

              <p className="mb-3 font-medium text-justify text-slate-400">
                {card.description}
              </p>
              <div>
                <CTAButton active={true} linkto={card.BtnLink}>
                  {card.BtnText}
                </CTAButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-col p-4 gap-y-3 ">
              <h1 className="text-2xl h-[70px] font-semibold text-slate-100">
                {card.heading}
              </h1>
              <p className="text-slate-400">{card.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LearningGrid;
