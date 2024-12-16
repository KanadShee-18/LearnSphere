import React from "react";

const Offline = () => {
  return (
    <div className="grid inset-0 z-[1000] bg-slate-900 bg-opacity-85 backdrop-blur-sm place-items-center w-screen h-screen overflow-auto fixed !mt-0">
      <div className="shadow-lg shadow-slate-600 flex flex-col items-center bg-opacity-60 rounded-lg justify-between p-5 pb-16 space-y-3 bg-[#242b4b]">
        <h1 className="text-3xl font-semibold text-center text-pink-200 font-poppins">
          You're currently offline.{" "}
        </h1>
        <h1 className="text-xl font-semibold text-center text-pink-200 font-poppins">
          Please check your internet connection.
        </h1>

        <p className="text-xl font-medium text-center text-blue-50 font-eduSa">
          We're always here for you.
        </p>
      </div>
    </div>
  );
};

export default Offline;
