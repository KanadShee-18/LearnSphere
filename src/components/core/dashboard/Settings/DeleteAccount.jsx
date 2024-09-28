import React from "react";
import IconBtn from "../../../common/IconBtn";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2 } from "react-icons/fi";
import { deleteProfile } from "../../../../services/operations/SettingsAPI";

const DeleteAccount = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteAccount = () => {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      console.log("Error while deleting account: ", error.message);
    }
  };

  return (
    <div className="relative mt-24 mb-36">
      <div className="flex mt-12 flex-row gap-x-5 w-10/12 max-w-[1000px] p-7 mx-auto rounded-lg text-cyan-700 font-medium bg-[#5a042d] border-[1px] border-[#ff439b]">
        <div className="flex items-start justify-center">
          <span className="bg-[#881940] p-3 rounded-full hover:border-[1px] cursor-pointer hover:border-[#ff439b] border-dashed border-[1px] border-[#ff58a6] m-2">
            <FiTrash2 className="size-7 text-[#ff285a]" />
          </span>
        </div>
        <div className="flex-col items-start">
          <h1 className="text-lg text-richblack-25">Delele Account</h1>
          <p className="my-2 text-sm text-red-200 font-eduSa">
            Would you like to delete account?
          </p>
          <p className="mb-3 text-sm text-red-200 font-poppins">
            This account contains Paid Courses. Deleting your account will
            remove all the contain associated with it.
          </p>
          <p className="text-[#ff7091] italic underline font-playwrite">
            I want to delete my account
          </p>
        </div>
      </div>
      <div className="w-10/12 max-w-[1000px] mx-auto mt-4 flex flex-row justify-end gap-x-4">
        <IconBtn
          text={`Cancel`}
          onclick={() => {
            navigate("/dashboard/my-profile");
          }}
          customClasses={
            "px-4 h-fit py-2 bg-slate-500 my-auto rounded-md text-slate-800 font-semibold hover:bg-cyan-600 hover:text-slate-100 active:bg-slate-700 active:text-slate-100 gap-x-2 text-sm"
          }
        ></IconBtn>
        <IconBtn
          text={`Delete`}
          onclick={handleDeleteAccount}
          customClasses={
            "px-4 h-fit py-2 bg-[#db0235] my-auto rounded-md text-slate-200 font-semibold hover:bg-[#ff7091] hover:border-[1px] hover:border-[#db0235] hover:text-slate-800 active:bg-slate-700 active:text-slate-100 gap-x-2 text-sm"
          }
        ></IconBtn>
      </div>
    </div>
  );
};

export default DeleteAccount;
