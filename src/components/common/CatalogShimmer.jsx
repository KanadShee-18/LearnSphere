import { FaStar } from "react-icons/fa";

const CatalogShimmer = () => {
  return (
    <div className="flex flex-col gap-6 mt-14">
      <div className="box-content flex flex-col w-full h-48 px-4 bg-richblack-800 animate-pulse gap-y-4">
        <div className="mt-10 w-[150px] h-7 bg-slate-800 rounded-md ml-5 shadow-md shadow-slate-950" />
        <div className=" w-[90px] h-4 bg-slate-800 rounded-md ml-5 shadow-md shadow-slate-950" />
        <div className="w-3/4 h-10 mt-1 ml-5 rounded-md shadow-md bg-slate-800 shadow-slate-950" />
      </div>
      <div className="w-3/4 h-10 mt-1 rounded-md shadow-md bg-slate-800 shadow-slate-950 animate-pulse" />
      {/* Shimmer Cards */}
      <div className="flex flex-col gap-3 mx-auto md:flex-row max-w-maxContentTab lg:max-w-maxContent">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-full md:w-[320px] lg:w-[400px] h-64 p-2 bg-gray-700 rounded-md animate-pulse"
          >
            <div className="w-full rounded-md shadow-md h-3/5 bg-slate-800 shadow-slate-950"></div>
            <div className="mt-2 w-[150px] h-7 bg-slate-800 rounded-md" />
            <div className="flex flex-row items-center gap-1 mt-2 text-slate-800">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <div className="ml-3 w-[90px] h-4 bg-slate-800 rounded-md" />
            </div>
            <div className="mt-1 w-[160px] h-4 bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
      <div className="w-3/4 h-10 rounded-md shadow-md mt-14 bg-slate-800 shadow-slate-950 animate-pulse" />
      {/* Shimmer Cards */}
      <div className="flex flex-col gap-3 mx-auto md:flex-row max-w-maxContentTab lg:max-w-maxContent">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-full md:w-[320px] lg:w-[400px] h-64 p-2 bg-gray-700 rounded-md animate-pulse"
          >
            <div className="w-full rounded-md shadow-md h-3/5 bg-slate-800 shadow-slate-950"></div>
            <div className="mt-2 w-[150px] h-7 bg-slate-800 rounded-md" />
            <div className="flex flex-row items-center gap-1 mt-2 text-slate-800">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <div className="ml-3 w-[90px] h-4 bg-slate-800 rounded-md" />
            </div>
            <div className="mt-1 w-[160px] h-4 bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogShimmer;
