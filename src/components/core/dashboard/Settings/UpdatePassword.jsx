import React, { useRef, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../../services/operations/SettingsAPI";
import Spinner from "../../../common/Spinner";

const UpdatePassword = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const oldPassword = useRef(null);
  const newPassword = useRef(null);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const passwords = {
      oldPassword: oldPassword.current.value,
      newPassword: newPassword.current.value,
      confirmNewPassword: newPassword.current.value,
    };

    try {
      console.log("Updating password...");
      setLoading(true);

      // Dispatch the async action to change the password
      dispatch(changePassword(token, passwords, navigate));

      // Clear input fields
      oldPassword.current.value = "";
      newPassword.current.value = "";

      // Set loading to false
      setLoading(false);
    } catch (error) {
      console.log("Error while updating password: ", error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleOnSubmit} className="relative flex flex-col gap-y-6 ">
      <div className="flex flex-col md:flex-row md:gap-x-5 gap-y-5 mt-8 justify-between w-10/12 max-w-[1000px] p-7 mx-auto rounded-lg text-cyan-700 font-medium bg-[#161d29ec] border-[1px] border-[#2c2c46]">
        <label className="relative flex flex-col gap-y-1 w-[45%]">
          <span className="text-teal-400">
            Current Password <sup className="text-pink-200">*</sup>
          </span>
          <span
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute text-xl cursor-pointer hover:text-cyan-500 text-cyan-300 right-4 top-10"
          >
            {showCurrentPassword ? <IoMdEye /> : <IoMdEyeOff />}
          </span>
          <input
            type={showCurrentPassword ? "text" : "password"}
            required
            placeholder="Enter current password"
            ref={oldPassword}
            name="changePassword"
            className="py-3 pl-2 rounded-md shadow-sm pr-7 bg-slate-700 text-cyan-300 outline-4 outline-cyan-400 shadow-[#ace320] "
          />
        </label>
        <label className="relative flex flex-col gap-y-1 w-[45%]">
          <span className="text-teal-400">
            New Password <sup className="text-pink-200">*</sup>
          </span>
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute text-xl cursor-pointer hover:text-cyan-500 text-cyan-300 right-4 top-10"
          >
            {showNewPassword ? <IoMdEye /> : <IoMdEyeOff />}
          </span>
          <input
            type={showNewPassword ? "text" : "password"}
            required
            placeholder="Enter new password"
            ref={newPassword}
            name="newPassword"
            className="py-3 pl-2 rounded-md shadow-sm pr-7 bg-slate-700 text-cyan-300 outline-4 outline-cyan-400 shadow-[#ace320] "
          />
        </label>
      </div>
      <div className="flex flex-row gap-x-4 justify-end  w-10/12 max-w-[1000px] mx-auto">
        {loading && (
          <div className="w-[100px] h-auto flex items-center justify-end mr-3">
            <Spinner />
          </div>
        )}
        <button
          type="submit"
          className="bg-[#ace320] px-3 text-sm py-2 rounded-md text-slate-800 font-medium hover:bg-teal-600 hover:text-slate-100 active:bg-slate-700 active:text-slate-100"
        >
          Update
        </button>
        <button
          onClick={() => {
            navigate("/dashboard/my-profile");
          }}
          className="px-4 py-2 my-auto text-sm font-semibold rounded-md h-fit bg-slate-500 text-slate-800 hover:bg-cyan-600 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UpdatePassword;
