import HighlightText from "./HighlightText";
import CTAButton from "./CTAButton";
import { FaArrowRight } from "react-icons/fa6";
import ins_img from "../../../assets/Images/Instructor.jpg";
import { motion } from "framer-motion";

const InstructorSection = () => {
  return (
    <div className="flex flex-col items-center justify-around mx-auto my-32 sm:flex-row">
      <img
        src={ins_img}
        alt="instructor"
        className="sm:w-1/2 w-4/5 lg:w-[500px] relative instructorImg"
      />
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        whileInView={{ x: "0%", opacity: 1 }}
        transition={{
          duration: 0.7,
          type: "spring",
          stiffness: 60,
          damping: 25,
        }}
        className="relative sm:w-2/5 w-[3/5] my-10 h-full sm:items-start items-center sm:my-auto flex flex-col sm:justify-center justify-start text-start"
      >
        <p className="text-4xl text-white font-inter">
          Become an <br />
          <HighlightText text={" Instructor"} />
        </p>
        <p className="text-slate-400 font-inter mt-3 text-sm mb-10 w-[60%] sm:w-[80%]">
          Instructors from around the world teach millions of students on
          Learnsphere. We provide the tools and skills to teach what you love.
        </p>
        <CTAButton active={true} linkto={"/signup"}>
          <div className="flex gap-3 items-center font-playwrite text-[13px]">
            Start Teaching Today
            <FaArrowRight />
          </div>
        </CTAButton>
      </motion.div>
    </div>
  );
};

export default InstructorSection;
