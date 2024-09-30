import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CountryCode from "../../../../data/countrycode.json";
import Spinner from "../../../common/Spinner";
import { toast } from "react-toastify";
import IconBtn from "../../../common/IconBtn";
import { FaCalendarAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../../services/operations/SettingsAPI";

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("Logging all data: ", data);

    try {
      setLoading(true);
      dispatch(updateProfile(token, data));
      setLoading(false);
      toast.info("We have received your message!");
    } catch (error) {
      console.log("Updating profile error from error: ", error.message);
      toast.error("Some error occurred. Please try again!");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        displayName: "",
        profession: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        about: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(submitContactForm)}
        className="relative flex flex-col justify-center text-cyan-500"
      >
        <div className="flex flex-col gap-y-5 mt-8 justify-between w-10/12 max-w-[1000px] p-7 mx-auto rounded-lg text-richblack-200 font-medium bg-[#253c53] border-[1px] border-[#2c2c46] bg-opacity-40">
          <h2 className="text-lg text-richblack-25">Profile Information</h2>
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            {/* Display name */}
            <div className="flex flex-col gap-y-2 md:w-[45%] w-full">
              <label htmlFor="displayName">
                Display Name <span className="text-pink-100">*</span>{" "}
              </label>
              <input
                className="px-2 py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-slate-400 text-slate-400 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins"
                type="text"
                name="displayName"
                id="displayName"
                defaultValue={user?.firstName}
                placeholder="Enter your name"
                {...register("displayName", { required: true })}
              />
              {errors.displayName && (
                <span className="px-2 text-sm text-pink-100 ">
                  Please Enter Your Name
                </span>
              )}
            </div>
            {/* Profession */}
            <div className="flex flex-col gap-y-2 md:w-[45%] w-full">
              <label htmlFor="profession">
                Profession{" "}
                <span className="text-sm text-slate-400">(Optional)</span>
              </label>
              <input
                className="px-2 py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-slate-400  text-slate-400 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins"
                type="text"
                name="profession"
                id="profession"
                placeholder="Developer, Student"
                {...register("profession")}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row">
            {/* DOB */}
            <div className="relative flex flex-col gap-y-2 md:w-[45%] w-full">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                className="w-full px-2 py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-slate-400  text-slate-400 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins cursor-pointer"
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                {...register("dateOfBirth", { required: true })}
              />
              <span className="absolute pointer-events-none text-slate-400 right-2 top-11">
                <FaCalendarAlt className="w-6 h-6" />
              </span>
            </div>
            {/* Gender */}
            <div className="flex flex-col gap-y-2 md:w-[45%] w-full">
              <label htmlFor="gender">
                Gender <span className="text-pink-100">*</span>{" "}
              </label>
              <div className="flex space-x-4 px-2 py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-slate-400  text-slate-400 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    id="radioInput1"
                    value="Male"
                    className="text-cyan-500 hover:cursor-pointer"
                    {...register("gender", {
                      required: "Please select your gender",
                    })}
                  />
                  <span className="font-medium text-slate-400">Male</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="radioInput2"
                    name="gender"
                    value="Female"
                    className="text-cyan-500 hover:cursor-pointer"
                    {...register("gender", {
                      required: "Please select your gender",
                    })}
                  />
                  <span className="font-medium text-slate-400">Female</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    id="radioInput3"
                    value="Other"
                    className="text-cyan-500 hover:cursor-pointer"
                    {...register("gender", {
                      required: "Please select your gender",
                    })}
                  />
                  <span className="font-medium text-slate-400">Other</span>
                </label>
              </div>

              {/* Error message for gender */}
              {errors.gender && (
                <span className="px-2 text-sm text-pink-100">
                  {errors.gender.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row ">
            {/* Phone No */}
            <div className="flex flex-row justify-between md:w-[45%] w-full gap-x-5 gap-y-2">
              {/* Dropdown */}
              <div className="flex flex-col max-w-[150px] lg:w-max overflow-hidden rounded-lg outline-none gap-y-2 w-[70px] ">
                <label htmlFor="phoneno">
                  Code <span className="text-pink-200">*</span>
                </label>
                <select
                  name="countrycode"
                  id="countrycode"
                  {...register("countrycode", { required: true })}
                  className="py-2 h-[48px] text-sm text-slate-400 rounded-lg shadow-sm outline-none bg-gradient-to-bl from-slate-800 shadow-slate-400  to-slate-700 scrollbar-hide"
                >
                  <option value="" defaultValue={true}></option>
                  {CountryCode.map((element, index) => {
                    return (
                      <option
                        key={index}
                        value={element.code}
                        className="pl-3 hover:bg-cyan-600 text-slate-300 bg-slate-700"
                      >
                        {element.code} - {element.country}
                      </option>
                    );
                  })}
                </select>
                {errors.countrycode && (
                  <span className="px-2 text-sm text-pink-100 ">Required</span>
                )}
              </div>
              {/* Number */}
              <div className="flex flex-col gap-y-2 w-[80%]">
                <label htmlFor="contactNumber">
                  Mobile Number <span className="text-pink-200">*</span>
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  id="contactNumber"
                  {...register("contactNumber", {
                    required: {
                      value: true,
                      message: "Please provide a Phone Number",
                    },
                    maxLength: { value: 10, message: "Invalid Phone Number" },
                    minLength: { value: 8, message: "Invalid Phone Number" },
                  })}
                  placeholder="874XXXXXX0"
                  className="px-2 w-full py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-slate-400  text-slate-400 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins"
                />
                {errors.contactNumber && (
                  <span className="px-2 text-sm text-pink-100 ">
                    {errors.contactNumber.message}
                  </span>
                )}
              </div>
            </div>

            {/* About */}
            <div className="flex flex-col gap-y-2 md:w-[45%] w-full">
              <label htmlFor="about">About</label>
              <input
                className="px-2 py-3 rounded-md bg-gradient-to-bl from-slate-800 to-slate-700 shadow-sm shadow-slate-400 text-slate-400 text-[15px] outline-none focus:border-cyan-300 focus:border-[1px] font-medium font-poppins"
                name="about"
                id="about"
                placeholder="Enter Bio Details"
                {...register("about")}
              />
            </div>
          </div>

          <div className="flex justify-center w-full mt-3">
            {loading && <Spinner />}
          </div>
        </div>
        <div className="flex flex-row gap-x-4 w-10/12 max-w-[1000px] mt-3 mx-auto justify-end">
          {loading && (
            <div className="w-[100px] h-auto flex items-center justify-end mr-3">
              <Spinner />
            </div>
          )}
          <IconBtn
            type={`submit`}
            text={`Save`}
            onclick={() => {
              navigate("/dashboard/settings");
            }}
            customClasses={
              "px-4 h-fit py-2 bg-[#4c9da0] my-auto rounded-md text-slate-700 font-semibold hover:bg-teal-600 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 text-sm"
            }
          ></IconBtn>
          <IconBtn
            text={`Cancel`}
            onclick={() => {
              navigate("/dashboard/my-profile");
            }}
            customClasses={
              "px-4 h-fit py-2 bg-slate-500 my-auto rounded-md text-slate-800 font-semibold hover:bg-cyan-600 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 text-sm"
            }
          ></IconBtn>
        </div>
      </form>
    </>
  );
};

export default EditProfile;
