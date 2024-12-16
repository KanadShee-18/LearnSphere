import React from "react";
import { motion } from "framer-motion";

const Stats = [
  { count: "5K", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

const StatsComponenet = () => {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      whileInView={{ x: "0%", opacity: 1 }}
      transition={{
        duration: 1,
        ease: "easeIn",
        type: "spring",
        stiffness: 60,
        damping: 25,
      }}
      className="my-24 bg-gradient-to-r from-[#19202c] via-[#202d42] to-[#131c2c]"
    >
      {/* Stats */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        whileInView={{ x: "0%", opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeIn", delay: 0.5 }}
        className="flex flex-col justify-between w-11/12 gap-10 mx-auto text-white max-w-maxContent "
      >
        <div className="grid grid-cols-2 text-center md:grid-cols-4">
          {Stats.map((data, index) => {
            return (
              <div className="flex flex-col py-10" key={index}>
                <h1 className="text-[30px] font-bold text-richblack-5">
                  {data.count}
                </h1>
                <h2 className="font-semibold text-[16px] text-slate-500">
                  {data.label}
                </h2>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsComponenet;
