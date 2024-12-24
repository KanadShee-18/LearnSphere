import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

import { login } from "../../../services/operations/authAPI";
import InputBox from "../../common/InputBox";

const LogInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log("email: ", email);
    console.log("password: ", password);

    dispatch(login(email, password, navigate));
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="flex flex-col w-full mt-6 text-white gap-y-2"
    >
      {/* <label className="w-full">
        <p className="text-slate-300 mb-1 text-sm leading-[1.375rem]">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          type="text"
          required
          name="email"
          onChange={handleOnChange}
          autoComplete="email"
          value={email}
          placeholder="Enter email address"
          className="w-full rounded-[8px] bg-slate-600 bg-opacity-65 p-3 hover:bg-opacity-75 outline-cyan-500 outline-2 text-cyan-300 active:bg-opacity-95"
        />
      </label> */}
      <InputBox
        type={"text"}
        required
        name={"email"}
        value={email}
        handleOnChangeEvent={(e) => setEmail(e.target.value)}
        autoComplete={"email"}
        label={"Enter email address"}
        placeholder={"Enter email address"}
      />
      {/* <label className="relative">
        <p className="text-slate-300 mb-1 text-sm leading-[1.375rem]">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          type={showPassword ? "text" : "password"}
          required
          name="password"
          autoComplete="current-password"
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
        <div className="flex flex-row items-center justify-between px-2">
          <Link to={"/signup"}>
            <p className="mt-1 text-sm max-w-max text-cyan-600 hover:underline">
              No Account?
            </p>
          </Link>
          <Link to={"/forgot-password"}>
            <p className="mt-1 text-xs max-w-max text-cyan-500 hover:underline">
              Forgot Password
            </p>
          </Link>
        </div>
      </label> */}
      <InputBox
        type={"password"}
        required
        name="password"
        autoComplete="current-password"
        handleOnChangeEvent={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        label="Enter Password"
        value={password}
        className={"relative"}
      />
      <div className="flex flex-row items-center justify-between px-2">
        <Link to={"/signup"}>
          <p className="mt-1 text-sm max-w-max text-cyan-600 hover:underline">
            No Account?
          </p>
        </Link>
        <Link to={"/forgot-password"}>
          <p className="mt-1 text-xs max-w-max text-cyan-500 hover:underline">
            Forgot Password
          </p>
        </Link>
      </div>
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
