import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

const LogInForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showpassword, setShowPassword] = useState(false);

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
        <form className="text-white mt-6 flex w-full flex-col gap-y-5">
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
                    className="w-full rounded-[8px] bg-slate-600 bg-opacity-65 p-3 hover:bg-opacity-75 outline-cyan-500 outline-2 text-slate-300 active:bg-opacity-95"
                />
            </label>
            <label className="relative">
                <p className="text-slate-300 mb-1 text-sm leading-[1.375rem]">
                    Password <sup className="text-pink-200">*</sup>
                </p>
                <input
                    type={showpassword ? "text" : "password"}
                    required
                    name="password"
                    onChange={handleOnChange}
                    placeholder="Enter Password"
                    value={password}
                    className="w-full rounded-[8px] bg-slate-600 bg-opacity-65 p-3 pr-14 hover:bg-opacity-75 outline-cyan-500 outline-2 text-slate-300 active:bg-opacity-95"
                />
                <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-9 cursor-pointer"
                >
                    {showpassword ? (
                        <IoMdEyeOff fontSize={24} fill="#AFB2BF" />
                    ) : (
                        <IoMdEye fontSize={24} fill="#AFB2BF" />
                    )}
                </span>
                <Link to={"/forgot-password"}>
                    <p className="mt-1 ml-auto max-w-max text-xs text-cyan-500 hover:underline">Forgot Password</p>
                </Link>
            </label>
            <button className="mt-6 rounded-lg bg-teal-500 text-richblack-900 font-medium py-2 px-3 hover:bg-cyan-700 hover:text-slate-200 active:bg-teal-600">
                Sign In
            </button>
        </form>
    );
};

export default LogInForm;
