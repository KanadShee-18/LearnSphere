import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

import { login } from "../../../services/operations/authAPI";

const LogInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="flex flex-col w-full mt-6 text-white  gap-y-5"
    >
      <label className="w-full">
        <p className="text-slate-300 mb-1 text-sm leading-[1.375rem]">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          type="text"
          required
          name="email"
          onChange={handleOnChange}
          value={email}
          placeholder="Enter email address"
          className="w-full rounded-[8px] bg-slate-600 bg-opacity-65 p-3 hover:bg-opacity-75 outline-cyan-500 outline-2 text-cyan-300 active:bg-opacity-95"
        />
      </label>
      <label className="relative">
        <p className="text-slate-300 mb-1 text-sm leading-[1.375rem]">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          type={showPassword ? "text" : "password"}
          required
          name="password"
          onChange={handleOnChange}
          placeholder="Enter Password"
          value={password}
          className="w-full rounded-[8px] bg-slate-600 bg-opacity-65 p-3 pr-14 hover:bg-opacity-75 outline-cyan-500 outline-2 text-cyan-300 active:bg-opacity-95"
        />

        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute cursor-pointer right-3 top-9"
        >
          {showPassword ? (
            <IoMdEye fontSize={24} fill="#AFB2BF" />
          ) : (
            <IoMdEyeOff fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link to={"/forgot-password"}>
          <p className="mt-1 ml-auto text-xs max-w-max text-cyan-500 hover:underline">
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type="submit"
        className="px-3 py-3 mt-6 font-medium bg-teal-500 rounded-lg text-richblack-900 hover:bg-cyan-700 hover:text-slate-200 active:bg-teal-600"
      >
        Sign In
      </button>
    </form>
  );
};

export default LogInForm;
