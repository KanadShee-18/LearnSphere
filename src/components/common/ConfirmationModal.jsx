import React from "react";
import IconBtn from "./IconBtn";

const ConfirmationModal = ({ modalData }) => {
  return (
    <div className="z-[1000] inset-0 fixed !mt-0 grid place-items-center overflow-auto bg-slate-600 bg-opacity-60 backdrop-blur-sm">
      <div className="w-11/12 max-w-[350px] rounded-lg border-[1px] border-blue-400 bg-gradient-to-bl from-slate-700 via-slate-800 to-richblack-900 p-5 shadow-sm shadow-blue-200">
        <p className="mb-5 text-xl leading-6 text-blue-100 font-poppins">
          {modalData.text1}
        </p>
        <p className="mb-5 text-sm font-medium leading-6 text-pink-100 font-inter">
          {modalData.text2}
        </p>
        <div className="flex flex-row items-center px-3 gap-x-4">
          <IconBtn
            text={modalData.btn1Text}
            onclick={modalData.btn1Handler}
            customClasses={
              "bg-pink-200 px-3 py-2 rounded-md text-slate-200 font-semibold hover:bg-pink-300 hover:text-slate-200 active:bg-slate-700 active:text-slate-100"
            }
          />

          <button
            onClick={modalData.btn2Handler}
            className="px-4 py-2 font-semibold text-teal-600 rounded-md shadow-sm cursor-pointer bg-slate-800 hover:text-slate-300 active:bg-red-600 active:text-slate-100 shadow-slate-400"
          >
            {modalData.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
