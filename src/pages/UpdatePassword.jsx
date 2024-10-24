import React, { useEffect, useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../components/common/Spinner";

import PasswordValidator from "../components/common/PassValidator";
import { resetPassword } from "../services/operations/authAPI";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [errMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const { password, confirmPassword } = formData;

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const token = location.pathname.split("/").at(-1);
    dispatch(
      resetPassword(password, confirmPassword, token, setErrorMessage, navigate)
    );
  };

  useEffect(() => {
    // Set a timeout to clear the error message after 5 seconds
    let timer;
    if (errMessage) {
      timer = setTimeout(() => {
        setErrorMessage(null); // Clear the error message
      }, 7000);
    }

    return () => clearTimeout(timer); // Cleanup timer on unmount or when errMessage changes
  }, [errMessage]);

  return (
    <div className="flex items-center justify-center w-11/12 pt-12 mx-auto mt-16 text-white max-w-maxContent">
      {loading ? (
        <Spinner />
      ) : (
        <div className="max-w-[400px] mx-auto mt-16 flex w-fit flex-col gap-y-4">
          <h1 className="text-3xl font-semibold text-cyan-400 text-start">
            Choose New Password
          </h1>
          <p className="w-full font-medium font-poppins text-slate-400">
            Almost done. Enter your new password and you're all set.
          </p>
          <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-6">
            <label className="relative flex flex-col gap-y-1">
              <span className="text-teal-400">
                New Password <sup className="text-pink-200">*</sup>
              </span>
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-xl cursor-pointer hover:text-cyan-500 text-cyan-300 right-4 top-10"
              >
                {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter new password"
                onChange={handleOnChange}
                value={password}
                name="password"
                className="py-3 pl-2 rounded-md shadow-md pr-7 bg-slate-700 text-cyan-300 outline-4 outline-cyan-400 shadow-teal-500"
              />
            </label>
            <label className="relative flex flex-col gap-y-1">
              <span className="text-teal-400">
                Confirm New Password <sup className="text-pink-200">*</sup>
              </span>
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute text-xl cursor-pointer hover:text-cyan-500 text-cyan-300 right-4 top-10"
              >
                {showConfirmPassword ? <IoMdEye /> : <IoMdEyeOff />}
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                required
                onChange={handleOnChange}
                name="confirmPassword"
                value={confirmPassword}
                className="py-3 pl-2 rounded-md shadow-md pr-7 bg-slate-700 text-cyan-300 outline-4 outline-cyan-400 shadow-teal-500"
              />
            </label>
            {errMessage && (
              <p className="text-sm font-medium text-red-400 font-poppins">
                {errMessage}
              </p>
            )}
            <PasswordValidator />
            <button
              type="submit"
              className="w-full py-3 font-semibold text-center rounded-md bg-cyan-500 text-slate-900 hover:bg-teal-500 active:bg-cyan-400"
            >
              Reset Password
            </button>
          </form>
          <Link
            to={"/login"}
            className="mt-4 text-sm transition-all duration-200 text-slate-400 hover:text-cyan-500 hover:-translate-x-2"
          >
            &larr; Back to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
