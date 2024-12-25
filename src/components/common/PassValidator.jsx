import React from "react";
import { TiTick } from "react-icons/ti";
const PassValidator = () => {
  return (
    <div className="flex flex-col justify-between px-2 text-sm text-green-600 sm:flex-row">
      <div>
        <span className="flex flex-row items-center gap-x-1">
          <TiTick className="bg-teal-400 rounded-full size-3 text-slate-700" />
          <p>one lowercase character</p>
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <TiTick className="bg-teal-400 rounded-full size-3 text-slate-700" />
          <p>one uppercase character</p>
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <TiTick className="bg-teal-400 rounded-full size-3 text-slate-700" />
          <p>one number</p>
        </span>
      </div>
      <div>
        <span className="flex flex-row items-center gap-x-1">
          <TiTick className="bg-teal-400 rounded-full size-3 text-slate-700" />
          <p>one special character</p>
        </span>
        <span className="flex flex-row items-center gap-x-1">
          <TiTick className="bg-teal-400 rounded-full size-3 text-slate-700" />
          <p>8 character minimum</p>
        </span>
      </div>
    </div>
  );
};

export default PassValidator;
