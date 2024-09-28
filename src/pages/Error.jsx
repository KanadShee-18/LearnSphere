import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full my-auto mt-16 text-3xl font-semibold text-pink-300 place-items-center">
      <div className="flex flex-col items-center justify-center border-2 border-pink-200 h-[300px] p-5 rounded-lg mt-44 gap-y-4 bg-slate-800">
        Error - Page Not found
        <br />
        <p>You have requested to wrong route.</p>
        <Link
          to={"/"}
          className="flex items-center text-base transition-all duration-200 text-cyan-400 hover:text-cyan-600 active:-translate-x-4"
        >
          &larr;<p className="ml-4">Back to homepage</p>
        </Link>
      </div>
    </div>
  );
};

export default Error;
