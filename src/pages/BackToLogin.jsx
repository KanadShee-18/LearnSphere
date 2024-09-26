import React from "react";
import { Link } from "react-router-dom";

const BackToLogin = () => {
  return (
    <div className="flex items-center justify-center w-11/12 mx-auto mt-16 text-white max-w-maxContent">
      <div className="w-[350px] flex flex-col gap-y-4 mt-20">
        <h1 className="mb-3 text-3xl font-semibold text-cyan-500">
          Reset Complete!
        </h1>
        <p className="text-slate-400 mb-6 font-medium max-w-[95%]">
          All done! We have reset your password. Go back and login with you new
          created password.{" "}
          <span className="font-semibold text-teal-500"> Happy Learning!</span>
        </p>
        <Link to={`/login`}>
          <button className="w-full py-4 text-base font-medium text-center rounded-md bg-cyan-500 text-slate-900 hover:bg-teal-500 active:bg-cyan-600">
            Return to login
          </button>
        </Link>
        <Link to={`/login`} className="flex pl-3 gap-x-2">
          <p className="text-teal-500">&larr; Back to login</p>
        </Link>
      </div>
    </div>
  );
};

export default BackToLogin;
