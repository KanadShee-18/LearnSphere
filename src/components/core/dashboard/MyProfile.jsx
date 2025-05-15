import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { LuClipboardPen } from "react-icons/lu";
import orbital from "../../../assets/Images/orbital.png";
import { PiStudent } from "react-icons/pi";
import { TbDetails } from "react-icons/tb";
import { CiMemoPad } from "react-icons/ci";
const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();

  const { firstName, lastName, email, additionalDetails } = user;

  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col w-full mx-auto">
      <img
        src={orbital}
        alt="orbital"
        className="absolute object-contain orbital"
      />
      <h1 className="relative my-8 ml-12 text-xs md:text-sm text-slate-400 tracking-wider">
        Home<span className="text-[#ace320]">{location.pathname}</span>
      </h1>
      <div className="w-10/12 flex items-center gap-x-2 max-w-[1000px] mx-auto text-start md:text-4xl text-2xl font-medium text-blue-25 font-poppins">
        <PiStudent />
        My Profile
      </div>
      {/* Section 1 */}

      <div className="relative flex flex-row justify-between w-10/12 max-w-[1000px] md:p-7 p-3  mt-8 rounded-lg mx-auto text-slate-200 bg-[#28344d] border-[1px] border-[#545480]">
        <div className="flex flex-col items-start md:items-center md:flex-row gap-x-5">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square rounded-full md:w-[84px] w-12 object-cover"
          />
          <div className="">
            <p className="text-base text-teal-500 md:text-lg font-playwrite">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-xs text-cyan-300 md:text-sm tracking-wider">
              {user?.email}
            </p>
          </div>
        </div>
        <IconBtn
          text={`Edit`}
          onclick={() => {
            navigate("/dashboard/settings");
          }}
          children={<LuClipboardPen className="md:size-6 size-4" />}
          customClasses={
            "md:px-4 px-2 h-fit py-2 bg-teal-500 my-auto rounded-md text-slate-800 font-semibold hover:bg-slate-700 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 md:text-sm text-xs"
          }
        ></IconBtn>
      </div>

      {/* Section 2 */}
      <div className="flex relative flex-col justify-between w-10/12 max-w-[1000px] md:p-7 p-3 mx-auto mt-8 rounded-lg text-slate-200 bg-[#28344d] border-[1px] border-[#545480]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="flex items-center text-lg text-teal-500 md:text-xl gap-x-2">
            <CiMemoPad />
            About
          </h1>
          <IconBtn
            text={`Edit`}
            onclick={() => {
              navigate("/dashboard/settings");
            }}
            children={<LuClipboardPen className="md:size-6 size-4" />}
            customClasses={
              "md:px-4 px-2 h-fit py-2 bg-teal-500 my-auto rounded-md text-slate-800 font-semibold hover:bg-slate-700 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 md:text-sm text-xs"
            }
          ></IconBtn>
        </div>
        <div className="bg-[#2a324d] w-full mx-auto h-[1px] mb-5" />

        <p className="md:text-sm text-xs text-[#7b86ac] font-poppins">
          {additionalDetails.about ?? "Tell us something about yourself."}
        </p>
      </div>

      {/* Section 3 */}

      <div className="flex flex-col relative justify-between w-10/12 max-w-[1000px] md:p-7 p-3 mx-auto mt-8 mb-32 rounded-lg text-slate-200 bg-[#28344d] border-[1px] border-[#545480]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="flex items-center text-lg text-teal-500 md:text-xl gap-x-2">
            <TbDetails />
            Personal Details
          </h1>
          <IconBtn
            text={`Edit`}
            onclick={() => {
              navigate("/dashboard/settings");
            }}
            children={<LuClipboardPen className="md:size-6 size-4" />}
            customClasses={
              "md:px-4 px-2 h-fit py-2 bg-teal-500 my-auto rounded-md text-slate-800 font-semibold hover:bg-slate-700 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 md:text-sm text-xs"
            }
          ></IconBtn>
        </div>
        <div className="bg-[#2a324d] w-full mx-auto h-[1px] mb-5" />

        <div className="flex flex-col justify-between w-full md:flex-row">
          <div className="flex flex-col items-start justify-start w-full md:gap-y-4 gap-y-1">
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-[#a6b3e4]">First Name</p>
              <p className="text-sm text-[#7b86ac] font-poppins">{firstName}</p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-[#a6b3e4]">Email</p>
              <p className="text-sm text-[#7b86ac]  font-poppins">{email}</p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-[#a6b3e4]">Gender</p>
              <p className="text-sm text-[#7b86ac] font-poppins">
                {additionalDetails.gender ?? "Tell us your gender"}
              </p>
            </span>
          </div>
          <div className="flex flex-col items-start justify-start w-full gap-y-4">
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-[#a6b3e4]">Last Name</p>
              <p className="text-sm text-[#7b86ac] font-poppins">{lastName}</p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-[#a6b3e4]">Phone Number</p>

              <p className="text-sm text-[#7b86ac] font-poppins">
                {additionalDetails.contactNumber ?? "Fill this field!"}
              </p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-[#a6b3e4]">Date of Birth</p>
              <p className="text-sm text-[#7b86ac] font-poppins">
                {additionalDetails.dateOfBirth ?? "Fill this field!"}
              </p>
            </span>
          </div>
          <div className="flex flex-col items-start justify-start w-full gap-y-4">
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-[#a6b3e4]">Username</p>
              <p className="text-sm text-[#7b86ac] font-poppins">
                {additionalDetails.displayName ?? "Not Given!"}
              </p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-[#a6b3e4]">Profession</p>

              <p className="text-sm text-[#7b86ac] font-poppins">
                {additionalDetails.profession ?? "Not filled!"}
              </p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
