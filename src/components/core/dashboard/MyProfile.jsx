import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { MdEditDocument } from "react-icons/md";
import orbital from "../../../assets/Images/orbital.png";
const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();

  const { firstName, lastName, email, additionalDetails } = user;

  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col w-full mx-auto">
      <img src={orbital} alt="orbital" className="absolute orbital" />
      <h1 className="relative my-8 ml-4 text-xs text-slate-400">
        Home<span className="text-[#ace320]">{location.pathname}</span>
      </h1>
      <h1 className="w-10/12 max-w-[1000px] mx-auto text-start text-4xl font-medium text-cyan-500 font-poppins">
        My Profile
      </h1>
      {/* Section 1 */}

      <div className="relative flex flex-row justify-between w-10/12 max-w-[1000px] p-7 mx-auto mt-8 rounded-lg text-slate-200 bg-[#161d29] border-[1px] border-[#2c2c46]">
        <div className="flex flex-row items-center gap-x-5">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square rounded-full w-[84px] object-cover"
          />
          <div>
            <p className="text-lg text-[#ace320] font-playwrite">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text={`Edit`}
          onclick={() => {
            navigate("/dashboard/settings");
          }}
          children={<MdEditDocument className="size-6" />}
          customClasses={
            "px-4 h-fit py-2 bg-[#ace320] my-auto rounded-md text-slate-800 font-semibold hover:bg-teal-600 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 text-sm"
          }
        ></IconBtn>
      </div>

      {/* Section 2 */}
      <div className="flex relative flex-col justify-between w-10/12 max-w-[1000px] p-7 mx-auto mt-8 rounded-lg text-slate-200 bg-[#161d29] border-[1px] border-[#2c2c46]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl ">About</h1>
          <IconBtn
            text={`Edit`}
            onclick={() => {
              navigate("/dashboard/settings");
            }}
            children={<MdEditDocument className="size-6" />}
            customClasses={
              "px-4 h-fit py-2 bg-[#ace320] my-auto rounded-md text-slate-800 font-semibold hover:bg-teal-600 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 text-sm"
            }
          ></IconBtn>
        </div>
        <div className="bg-[#2a324d] w-full mx-auto h-[1px] mb-5" />

        <p className="text-sm text-[#5f71b6] font-poppins">
          {additionalDetails.about ?? "Tell us something about yourself."}
        </p>
      </div>

      {/* Section 3 */}

      <div className="flex flex-col relative justify-between w-10/12 max-w-[1000px] p-7 mx-auto mt-8 mb-32 rounded-lg text-slate-200 bg-[#161d29] border-[1px] border-[#2c2c46]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl ">Personal Details</h1>
          <IconBtn
            text={`Edit`}
            onclick={() => {
              navigate("/dashboard/settings");
            }}
            children={<MdEditDocument className="size-6" />}
            customClasses={
              "px-4 h-fit py-2 bg-[#ace320] my-auto rounded-md text-slate-800 font-semibold hover:bg-teal-600 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 text-sm"
            }
          ></IconBtn>
        </div>
        <div className="bg-[#2a324d] w-full mx-auto h-[1px] mb-5" />

        <div className="flex flex-col justify-between w-full md:flex-row">
          <div className="flex flex-col items-start justify-start w-full gap-y-4">
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-slate-300">First Name</p>
              <p className="text-sm text-[#5f71b6] font-poppins">{firstName}</p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-slate-300">Email</p>
              <p className="text-sm text-[#5f71b6]  font-poppins">{email}</p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-slate-300">Gender</p>
              <p className="text-sm text-[#5f71b6] font-poppins">
                {additionalDetails.gender ?? "Tell us your gender"}
              </p>
            </span>
          </div>
          <div className="flex flex-col items-start justify-start w-full gap-y-4">
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-slate-300">Last Name</p>
              <p className="text-sm text-[#5f71b6] font-poppins">{lastName}</p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-slate-300">Phone Number</p>

              <p className="text-sm text-[#5f71b6] font-poppins">
                {additionalDetails.contactNumber ?? "Fill this field!"}
              </p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-slate-300">Date of Birth</p>
              <p className="text-sm text-[#5f71b6] font-poppins">
                {additionalDetails.dateOfBirth ?? "Fill this field!"}
              </p>
            </span>
          </div>
          <div className="flex flex-col items-start justify-start w-full gap-y-4">
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-slate-300">Username</p>
              <p className="text-sm text-[#5f71b6] font-poppins">
                {additionalDetails.displayName ?? "Not Given!"}
              </p>
            </span>
            <span className="flex flex-col p-2 transition-all rounded-lg cursor-pointer ">
              <p className="text-slate-300">Profession</p>

              <p className="text-sm text-[#5f71b6] font-poppins">
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
