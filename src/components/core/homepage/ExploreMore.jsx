import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";

import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabsUsed = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsUsed[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    if (result.length > 0) {
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-4xl font-semibold text-center font-inter">
        Unlock the <HighlightText text={"Power of Code"} />
      </div>
      <p className="font-medium text-center font-inter text-slate-400">
        Learn to build anything you can imagine.
      </p>
      <div className="parentTab flex w-fit flex-row font-inter rounded-full bg-[#132930] p-1 my-10 sm:mb-36 mb-16">
        {tabsUsed.map((element, index) => {
          return (
            <div
              className={`text-base flex flex-row items-center gap-2 bg-opacity-65 ${
                currentTab === element
                  ? "bg-slate-900 text-slate-200 font-semibold"
                  : "bg-[#14292e] text-slate-400 font-medium"
              } rounded-full transition-all cursor-pointer hover:bg-[#2e484e] hover:text-slate-300 px-4 py-2 duration-150 active:bg-slate-500`}
              key={index}
              onClick={() => setMyCards(element)}
            >
              {element}
            </div>
          );
        })}
      </div>

      {/* Group of course */}

      <div className="flex flex-col sm:absolute relative sm:translate-y-[90%] sm:flex-row my-7  items-center justify-center sm:gap-x-10 gap-y-10">
        {courses.map((element, index) => {
          return (
            <div
              className="cursor-pointer"
              key={index}
              onClick={() => setCurrentCard(element.heading)}
            >
              <CourseCard
                heading={element.heading}
                desc={element.description}
                lessonNum={element.lessionNumber}
                level={element.level}
                active={currentCard === element.heading}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMore;
