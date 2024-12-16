import React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkValidData } from "../../../utils/validate";
import { Link } from "react-router-dom";

import { sendOtp } from "../../../services/operations/authAPI";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { setSignupData } from "../../../slices/authSlice";
import Tab from "../../common/Tab";
import PassValidator from "../../common/PassValidator";

const SignUpForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPasword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errMessage, setErrMessage] = useState(null);

  const { firstName, lastName, email, password, confirmPassword } = formData;
  // console.log("Form data comes as: ", formData);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Both passwords have to be matched.");
      return;
    }
    const message = checkValidData(email, password);
    if (message) {
      toast.warn("Please fill all fields correctly.");
      setErrMessage(message);
      return;
    }

    const signupData = {
      ...formData,
      accountType,
    };

    // Dispatch an action to signup data to be used in OTP varification
    dispatch(setSignupData(signupData));
    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate));

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPasword: "",
    });
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  return (
    <div className="text-white">
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/* From  */}
      <form onSubmit={handleOnSubmit} className="flex flex-col w-full gap-y-4">
        <div className="flex gap-x-4">
          <label>
            <p className="mb-1 text-sm leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="w-full rounded-[0.5rem] text-sm  bg-richblack-800 p-[12px] text-cyan-500 shadow-sm shadow-teal-600 outline-2 outline-cyan-300"
            />
          </label>
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-cyan-500 shadow-sm shadow-teal-600 outline-2 outline-cyan-300"
            />
          </label>
        </div>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-cyan-500 shadow-sm shadow-teal-600 outline-2 outline-cyan-300"
          />
        </label>
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-4 md:gap-y-0">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-cyan-500 shadow-sm shadow-teal-600 outline-2 outline-cyan-300"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <IoMdEye fontSize={20} fill="#AFB2BF" />
              ) : (
                <IoMdEyeOff fontSize={20} fill="#AFB2BF" />
              )}
            </span>
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-cyan-500 shadow-sm shadow-teal-600 outline-2 outline-cyan-300"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <IoMdEye fontSize={20} fill="#AFB2BF" />
              ) : (
                <IoMdEyeOff fontSize={20} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        {errMessage ? (
          <p className="text-sm font-medium text-red-400 font-poppins">
            {errMessage}
          </p>
        ) : (
          <PassValidator />
        )}
        <Link to={"/login"}>
          <p className="mt-1 ml-auto text-sm max-w-max text-cyan-500 hover:underline">
            Already have an account?
          </p>
        </Link>
        <button
          type="submit"
          className="mt-3 rounded-[8px] bg-teal-500 hover:bg-cyan-700 hover:text-slate-200 active:bg-teal-600 py-[10px] px-[12px] font-medium text-richblack-900 transition-all duration-150"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
