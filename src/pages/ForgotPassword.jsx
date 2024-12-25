import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="flex w-11/12 mx-auto text-white my-28 max-w-maxContent">
      <div className="fixed -bottom-[40%] left-0 aspect-square h-[70vh] md:bg-teal-400 bg-blue-400 rounded-full blur-[120px] md:bg-opacity-25 bg-opacity-35"></div>
      {loading ? (
        <div className="flex items-center justify-center w-16 h-16 mx-auto">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-[400px] w-fit flex flex-col gap-y-4 mx-auto rounded-md py-5 px-8 bg-slate-600 bg-opacity-15 shadow-md shadow-slate-950">
          <h1
            className={`my-2 md:text-4xl sm:text-3xl text-2xl   font-semibold text-cyan-400`}
          >
            {!emailSent ? "Reset Your Password" : "Check Your Email"}
          </h1>
          <p
            className={`text-caribbeangreen-300 text-xs tracking-wide md:text-sm font-poppins`}
          >
            {!emailSent
              ? "Don't Panic! We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery."
              : `We have sent a password reset link to your registered email ${email}.`}
          </p>
          <form
            onSubmit={handleOnSubmit}
            className="flex flex-col mt-4 gap-y-6"
          >
            {!emailSent && (
              <label className="flex flex-col text-sm md:text-base gap-y-2">
                <span className="text-slate-300">
                  Email Address <sup className="text-pink-200">*</sup>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-2 py-3 bg-opacity-50 rounded-md shadow-sm bg-slate-700 focus-within:shadow-teal-500 outline-4 outline-none text-cyan-300"
                />
              </label>
            )}
            <button
              type="submit"
              className="w-full py-2 text-center rounded-md shadow-md md:py-3 text-slate-900 font-semibold tracking-wide hover:text-slate-200 bg-cyan-600 shadow-slate-600 hover:bg-teal-700 active:bg-cyan-600"
            >
              {!emailSent ? "Reset Password" : "Resend Email"}
            </button>
          </form>
          <Link
            to={"/login"}
            className="mt-4 text-sm transition-all duration-200 text-slate-400 hover:text-cyan-300 hover:-translate-x-2"
          >
            &larr; Back to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
