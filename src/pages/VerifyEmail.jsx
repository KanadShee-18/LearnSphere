import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/common/Spinner";
import OTPInput from "react-otp-input";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { LuTimerReset } from "react-icons/lu";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="items-center justify-center w-11/12 p-4 mx-auto mt-40 text-white max-w-max">
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col max-w-fit">
          <h1 className="mb-2 text-2xl font-semibold md:text-4xl text-cyan-300">
            Verify Email
          </h1>
          <p className="text-slate-400 max-w-[90%] px-2 md:text-base text-sm ">
            A verification code has been sent to you. Enter the code below.
          </p>
          <form onSubmit={handleOnSubmit} className="px-2 md:my-10 mt-7">
            <div className="otpWrapperStyle">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="separatorStyle">-</span>}
                renderInput={(props) => (
                  <input {...props} className="inputStyle" />
                )}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-sm font-semibold text-black rounded-md md:py-3 md:text-base bg-cyan-400 hover:bg-teal-400"
            >
              Verify Email
            </button>
          </form>
          <div className="flex flex-row items-center justify-between px-2 mt-3">
            <Link
              to={"/login"}
              className="text-sm transition-all duration-200 text-slate-400 hover:text-cyan-500 hover:-translate-x-2"
            >
              &larr; Back to login
            </Link>
            <button
              className="flex flex-row items-center text-cyan-500 gap-x-2"
              onClick={() => dispatch(sendOtp(signupData.email))}
            >
              <LuTimerReset />
              Resent it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
