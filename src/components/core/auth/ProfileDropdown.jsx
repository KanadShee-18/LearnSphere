import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { logout } from "../../../services/operations/authAPI";

const ProfileDropdown = () => {
  const { user } = useSelector((state) => state?.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));
  if (!user) return null;

  return (
    <button className="relative" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-1">
        <img
          src={user?.image}
          alt={`profile-${user.firstName}`}
          className="object-cover rounded-full w-7 aspect-square"
        />
        <AiOutlineCaretDown className="text-base text-slate-500 hover:text-slate-300" />
      </div>
      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="absolute p-2 top-[130%] right-0 z-[1000]  divide-y-[1px] divide-slate-500 overflow-hidden rounded-md border-[1px] border-slate-500 bg-slate-700 shadow-sm shadow-cyan-400"
        >
          <Link to={"/dashboard/my-profile"} onClick={() => setOpen(false)}>
            <div className="flex items-center w-full px-3 py-2 mb-1 text-sm font-medium text-teal-400 rounded-md bg-slate-800 gap-x-1 active:bg-slate-600 hover:bg-slate-400 hover:text-slate-800">
              <VscDashboard className="text-xl" />
              Dashboard
            </div>
          </Link>

          <div
            onClick={() => {
              dispatch(logout(navigate));
            }}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-teal-400 rounded-md bg-slate-800 gap-x-1 hover:bg-slate-400 active:bg-slate-600 hover:text-slate-800"
          >
            <VscSignOut className="text-xl" />
            Logout
          </div>
        </div>
      )}
    </button>
  );
};

export default ProfileDropdown;
