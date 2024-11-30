import React from "react";
import ProfileDropdown from "../auth/ProfileDropdown";
import { Link } from "react-router-dom";
import { FaCartShopping, FaMoon } from "react-icons/fa6";
import { FiSun } from "react-icons/fi";
import { useSelector } from "react-redux";

const NavButtons = ({ user, toggleTheme, pathname, token, theme }) => {
  const { totalItems } = useSelector((state) => state.cart);
  return (
    <div className="flex items-center ml-2 text-sm md:gap-x-4 gap-x-2">
      {/* <div
        onClick={toggleTheme}
        className={`
            ${pathname === "/" ? "hidden" : "block"}
            relative flex items-center p-1 rounded-full w-14 h-7 dark:bg-slate-800 bg-slate-200`}
      >
        <div
          className={`w-6 h-6 dark:bg-slate-500 bg-slate-400 light:bg-white rounded-full flex items-center justify-center transform transition-all duration-500 ease-in-out ${
            theme === "light" ? "translate-x-0" : "translate-x-6"
          }`}
        >
          <button onClick={toggleTheme} className="text-xl">
            {theme === "light" ? <FiSun /> : <FaMoon />}
          </button>
        </div>
      </div> */}
      {user &&
        user?.accountType !== "Instructor" &&
        user?.accountType !== "Admin" && (
          <Link to={"/dashboard/cart"} className="relative text-slate-400">
            <FaCartShopping className="size-5" />
            {totalItems > 0 && (
              <span className="absolute grid w-5 h-5 overflow-hidden text-xs font-bold text-center text-teal-400 rounded-full -bottom-2 -right-3 place-items-center bg-richblack-700">
                {totalItems}
              </span>
            )}
          </Link>
        )}
      {token === null && (
        <Link to={"/login"}>
          <button className="border-[1px] font-semibold border-cyan-700 bg-slate-800 bg-opacity-65 md:text-sm text-xs md:px-4 px-2 py-2 text-nowrap hover:bg-cyan-500 hover:text-slate-800 hover:bg-opacity-85 active:bg-opacity-70 text-richblack-50 rounded-md">
            Log in
          </button>
        </Link>
      )}
      {token === null && (
        <Link to={"/signup"}>
          <button className="border-[1px] font-semibold border-cyan-700 bg-slate-800 bg-opacity-65 md:text-sm text-xs md:px-4 px-1 text-nowrap py-2 hover:bg-cyan-500 hover:bg-opacity-85 hover:text-slate-800 active:bg-opacity-70 text-richblack-50 rounded-md">
            Sign up
          </button>
        </Link>
      )}
      {token !== null && <ProfileDropdown />}
    </div>
  );
};

export default NavButtons;
