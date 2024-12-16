import React from "react";
import { useSelector } from "react-redux";
import Spinner from "../../common/Spinner";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";
import frameImg from "../../../assets/Images/frame.png";
import { motion } from "framer-motion";

const Template = ({ title, description1, description2, image, formType }) => {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center z-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6a78a52e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 -top-48"></div>
      {loading ? (
        <Shimmer />
      ) : (
        <div className="z-20 flex flex-col-reverse justify-between w-11/12 mx-auto my-32 md:my-0 max-w-maxContent md:flex-row md:gap-y-0 gap-y-12 md:gap-x-12">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 50,
              damping: 20,
            }}
            className="mx-auto w-11/12 max-w-[450px] md:mx-0"
          >
            <h1 className="text-[#4adfd7] mb-5 font-semibold leading-8 md:text-3xl text-2xl text-start">
              {title}
            </h1>
            <p className="font-medium">
              <span className="text-slate-400 text-[15px]">{description1}</span>{" "}
              <span className="text-cyan-400 font-eduSa text-[17px]">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignUpForm /> : <LogInForm />}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 50,
              damping: 20,
            }}
            className="mx-auto my-0 md:my-auto w-11/12 relative max-w-[450px] md:mx-0"
          >
            <img
              src={frameImg}
              alt="frame"
              width={558}
              height={504}
              loading="lazy"
              className=""
            />

            <img
              src={image}
              alt="image"
              width={558}
              height={504}
              loading="lazy"
              className="absolute z-10 right-2 -top-4 mainImg"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

const Shimmer = () => {
  return (
    <div className="flex flex-col items-center justify-center w-11/12 mx-auto my-32 max-w-maxContent md:my-0 animate-pulse">
      {/* Left Section Placeholder */}
      <div className="flex flex-col w-11/12 md:w-[450px] max-w-[450px] mx-auto md:mx-0 gap-y-4">
        <div className="w-3/4 h-6 rounded-md bg-slate-600"></div>
        <div className="w-full h-4 rounded-md bg-slate-500"></div>
        <div className="w-5/6 h-4 rounded-md bg-slate-500"></div>
        <div className="flex flex-col gap-3 mt-6">
          <div className="w-full h-10 rounded-md bg-slate-600"></div>
          <div className="w-full h-10 rounded-md bg-slate-600"></div>
          <div className="w-full h-10 rounded-md bg-slate-600"></div>
        </div>
      </div>

      {/* Right Section Placeholder (Image Frame) */}
      <div className="w-[400px]  h-[370px] mt-10 md:mt-0 bg-slate-800 rounded-lg relative overflow-hidden">
        <div className="absolute rounded-lg inset-2 bg-slate-600"></div>
      </div>
      <div className="flex flex-col w-11/12 md:w-[400px] max-w-[450px] mx-auto md:mx-0 gap-y-4">
        <div className="w-3/4 h-6 rounded-md bg-slate-600"></div>
        <div className="w-full h-4 rounded-md bg-slate-500"></div>
      </div>
    </div>
  );
};

export default Template;
