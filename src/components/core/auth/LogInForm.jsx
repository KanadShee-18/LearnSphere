import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../../../services/operations/authAPI";
import InputBox from "../../common/InputBox";
import { FaArrowRightLong } from "react-icons/fa6";

const LogInForm = () => {
  const emailRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();

    dispatch(login(email, password, navigate));
  };

  useEffect(() => {
    emailRef.current && emailRef.current.focus();
  }, []);

  return (
    <form
      onSubmit={handleOnSubmit}
      className="flex flex-col w-full mt-6 text-white gap-y-2"
    >
      <InputBox
        ref={emailRef}
        type={"text"}
        required
        name={"email"}
        value={email}
        handleOnChangeEvent={(e) => setEmail(e.target.value)}
        autoComplete={"email"}
        label={"Enter email address"}
        placeholder={"Enter email address"}
      />

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
        <p className="group flex items-center gap-x-3 justify-center w-full">
          Sign In{" "}
          <span className="group-hover:translate-x-2 duration-200">
            <FaArrowRightLong />
          </span>{" "}
        </p>
      </button>
    </form>
  );
};

export default LogInForm;
