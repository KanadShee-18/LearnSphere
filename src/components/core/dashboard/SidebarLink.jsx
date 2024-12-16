import React from "react";
import * as Icons from "react-icons/vsc";
import { matchPath, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEditCourse } from "../../../slices/courseSlice";

const SidebarLink = ({ link, iconName }) => {
  const Icon = Icons[iconName];
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isRouteMatch = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const path = location.pathname.split("/").pop();
  if (path === "add-course") {
    dispatch(setEditCourse(false));
  }

  return (
    <NavLink
      to={link.path}
      className={`relative px-8 py-2 text-sm font-medium
      
      ${
        isRouteMatch(link.path)
          ? "bg-cyan-700 text-slate-200"
          : "bg-opacity-0 text-slate-400 tracking-wide"
      } transition-all duration-200 w-full hover:bg-slate-800 hover:bg-opacity-80 hover:text-blue-50 hover:rounded-md
      
      `}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.20rem] bg-teal-300
        ${isRouteMatch(link.path) ? "opacity-100" : "opacity-0"}
        
        `}
      ></span>

      <div className="flex items-center gap-x-2">
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
};

export default SidebarLink;
