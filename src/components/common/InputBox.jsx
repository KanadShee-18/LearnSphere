import React, { useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

const InputBox = ({
  type,
  placeholder,
  label,
  id,
  name,
  value,
  required,
  handleOnChangeEvent,
  autoComplete,
  backgroundColor,
  spanReq,
  className,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full flex flex-col relative my-4">
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={handleOnChangeEvent}
        disabled={disabled}
        autoComplete={autoComplete}
        required={required}
        className={`peer ${
          className && `${className}`
        } rounded-lg h-12 px-2 bg-transparent focus-within:bg-[#293346] 
        ${type === "password" && "pr-12"}
        outline-none border-b-[2px] border-b-slate-500 focus-within:border-b-teal-400 placeholder-transparent text-slate-400`}
      />
      <label className="absolute -top-7 peer-placeholder-shown:top-3 peer-placeholder-shown:left-2 left-0 peer-placeholder-shown:text-base text-sm pointer-events-none text-teal-400 transition-all duration-300">
        {label}
        <sup className="ml-2 text-pink-200 text-base">*</sup>
      </label>
      {type === "password" && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute cursor-pointer top-3 text-2xl text-slate-300 right-2"
        >
          {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
        </span>
      )}
    </div>
  );
};

export default InputBox;
