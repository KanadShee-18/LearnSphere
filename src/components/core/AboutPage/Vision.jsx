import React from "react";
import RedHighlight from "../AboutPage/ResHighlight";
import FoundingStory from "../../../assets/Images/FoundingStory.png";
import orbital from "../../../assets/Images/orbital.png";

const Vision = () => {
  return (
    <section className="relative mt-24">
      <img src={orbital} alt="orbital" className="absolute orbital" />
      <div className="relative flex flex-col items-center justify-between mx-auto max-w-maxContent md:flex-row md:gap-x-3">
        <div className="flex flex-col w-full md:w-[45%] px-3 md:px-8">
          <h1 className="mb-5 text-5xl font-semibold">
            <RedHighlight text={"Our Founding Story"} />
          </h1>
          <div className="flex flex-col font-medium text-transparent bg-gradient-to-br from-cyan-600 via-slate-500 to-teal-600 bg-clip-text gap-y-4">
            <p className="text-justify font-poppins">
              Our e-learning platform was born out of a shared vision and
              passion for transforming education. It all began with a group of
              educators, technologists, and lifelong learners who recognized the
              need for accessible, flexible, and high-quality learning
              opportunities in a rapidly evolving digital world.
            </p>
            <p className="text-justify font-poppins">
              As experienced educators ourselves, we witnessed firsthand the
              limitations and challenges of traditional education systems. We
              believed that education should not be confined to the walls of a
              classroom or restricted by geographical boundaries. We envisioned
              a platform that could bridge these gaps and empower individuals
              from all walks of life to unlock their full potential.
            </p>
          </div>
        </div>
        <div className="relative  max-w-[45%] w-fit">
          <div className="absolute w-[80%] h-full bg-gradient-to-bl from-orange-600 via-pink-300 to-purple-500 rounded-2xl left-8 blur-[30px]"></div>
          <img
            src={FoundingStory}
            alt="Founding"
            className="relative object-cover w-full px-3 rounded-md md:px-8 visionImg"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between mx-auto mt-28 max-w-maxContent md:flex-row md:gap-x-3">
        <div className="flex flex-col w-full md:w-[45%] px-3 md:px-8">
          <h1 className="mb-5 text-5xl font-semibold text-transparent bg-gradient-to-br from-orange-600 to-yellow-200 bg-clip-text">
            Our Vission
          </h1>
          <div className="flex flex-col font-medium text-transparent bg-gradient-to-br from-cyan-600 via-slate-500 to-teal-600 bg-clip-text gap-y-4">
            <p className="text-justify font-poppins">
              With this vision in mind, we set out on a journey to create an e-
              learning platform that would revolutionize the way people learn.
              Our team of dedicated experts worked tirelessly to develop a
              robust and intuitive platform that combines cutting-edge
              technology with engaging content, fostering a dynamic and
              interactive learning experience.
            </p>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-[45%] px-3 md:px-8">
          <h1 className="mb-5 text-5xl font-semibold text-transparent bg-gradient-to-br from-cyan-700 to-teal-300 bg-clip-text">
            Our Mission
          </h1>
          <div className="flex flex-col font-medium text-transparent bg-gradient-to-br from-pink-400 via-yellow-400 to-orange-600 bg-clip-text gap-y-4">
            <p className="text-justify font-poppins">
              Our mission goes beyond just delivering courses online. We wanted
              to create a vibrant community of learners, where individuals can
              connect, collaborate, and learn from one another. We believe that
              knowledge thrives in an environment of sharing and dialogue, and
              we foster this spirit of collaboration through forums, live
              sessions, and networking opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
