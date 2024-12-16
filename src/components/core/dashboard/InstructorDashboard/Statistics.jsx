import React from "react";

const Statistics = ({ CourseCount, StudentsCount, Income }) => {
  return (
    <div className="p-5 w-full md:w-auto md:h-[450px] h-fit font-medium shadow-sm shadow-blue-100 text-slate-300 bg-[#222d4b] rounded-lg flex flex-col gap-y-4">
      <h1 className=" border-b-[1px] text-center border-b-[#b8bdf5] font-medium md:text-xl text-lg text-[#b8bdf5]">
        Statistics
      </h1>
      <div className="flex flex-col justify-between h-full gap-y-3">
        <div className="flex flex-1 flex-col p-4 rounded-md bg-[#32426e] place-content-center text-center transition-all hover:scale-95 duration-200 hover:cursor-pointer shadow-md shadow-slate-900">
          <p className="text-base font-poppins">Total Courses</p>
          <p className="text-base text-blue-50">{CourseCount}</p>
        </div>
        <div className="flex flex-col p-4 flex-1 rounded-md bg-[#32426e] place-content-center text-center transition-all hover:scale-95 duration-200 shadow-md hover:cursor-pointer shadow-slate-900">
          <p className="text-base text-center font-poppins">No. of Students</p>
          <p className="text-base text-blue-50">{StudentsCount}</p>
        </div>
        <div className="flex flex-col p-4 rounded-md flex-1 bg-[#32426e] place-content-center text-center hover:cursor-pointer shadow-md shadow-slate-900 transition-all hover:scale-95 duration-200">
          <p className="text-base font-poppins">Your Income</p>
          <p className="text-base text-blue-50">&#8377; {Income}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
