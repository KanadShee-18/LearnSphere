import React from "react";
import ChangeProfilePicture from "./ChangeProfilePicture";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import DeleteAccount from "./DeleteAccount";
import { Link, useLocation } from "react-router-dom";
import orbital from "../../../../assets/Images/orbital.png";

const Settings = () => {
  const location = useLocation();
  return (
    <div className="relative flex flex-col w-full mx-auto ">
      <img src={orbital} alt="orbital" className="absolute orbital" />
      <h1 className="relative my-8 ml-12 text-xs md:ml-4 text-slate-400">
        Home<span className="text-[#ace320]">{location.pathname}</span>
      </h1>
      <div className="relative w-10/12 max-w-[1000px] mx-auto flex flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-medium md:text-3xl lg:text-4xl text-start text-cyan-500 font-poppins">
          Edit Profile
        </h1>
        <Link
          to={"/dashboard/my-profile"}
          className="flex flex-row items-center text-sm text-teal-500 transition-all duration-200 hover:-translate-x-2"
        >
          &larr;<p className="ml-3">Back to Profile</p>
        </Link>
      </div>
      <ChangeProfilePicture />
      <EditProfile />
      <UpdatePassword />
      <DeleteAccount />
    </div>
  );
};

export default Settings;
