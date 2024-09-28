import React from "react";
import IconBtn from "./IconBtn";

const ConfirmationModal = ({ modalData }) => {
  return (
    <div className="z-[1000] inset-0 fixed !mt-0 grid place-items-center overflow-auto bg-slate-600 bg-opacity-80">
      <div className="w-11/12 max-w-[350px] rounded-lg border-[1px] border-teal-500 bg-gradient-to-bl from-slate-800 to-richblack-800 p-5 shadow-md shadow-cyan-600">
        <p className="mb-5 text-2xl leading-6 text-slate-300">
          {modalData.text1}
        </p>
        <p className="mb-5 font-medium leading-6 text-cyan-500 font-eduSa">
          {modalData.text2}
        </p>
        <div className="flex flex-row items-center justify-between px-3">
          <IconBtn
            text={modalData.btn1Text}
            onclick={modalData.btn1Handler}
            customClasses={
              "bg-cyan-600 px-3 py-3 rounded-md text-slate-200 font-semibold hover:bg-teal-600 hover:text-slate-200 active:bg-slate-700 active:text-slate-100"
            }
          />

          <button
            onClick={modalData.btn2Handler}
            className="px-4 py-3 font-semibold text-teal-600 rounded-md shadow-sm cursor-pointer bg-slate-800 hover:text-pink-200 active:bg-red-600 active:text-slate-100 shadow-slate-400"
          >
            {modalData.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
