import React from "react";

const Stats = [
  { count: "5K", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

const StatsComponenet = () => {
  return (
    <div className="my-24 bg-gradient-to-r from-[#19202c] via-[#202d42] to-[#131c2c]">
      {/* Stats */}
      <div className="flex flex-col justify-between w-11/12 gap-10 mx-auto text-white max-w-maxContent ">
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
      </div>
    </div>
  );
};

export default StatsComponenet;
