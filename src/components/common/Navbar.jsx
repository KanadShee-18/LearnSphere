import React, { useContext, useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo/LL_logo.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaCartShopping } from "react-icons/fa6";
import ProfileDropdown from "../core/auth/ProfileDropdown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { motion } from "framer-motion";
import { IoMdArrowDropup } from "react-icons/io";
import { ThemeContext } from "../../context/ThemeContextProvider";
import { FaMoon } from "react-icons/fa6";
import { FiSun } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { RiMenuUnfold2Fill } from "react-icons/ri";
import { AiOutlineFileSearch } from "react-icons/ai";
import { toast } from "react-toastify";
import SearchBox from "./SearchBox";
import Spinner from "./Spinner";

const Navbar = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const { theme } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [openBox, setOpenBox] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const [subLinks, setSubLinks] = useState([]);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // State to control navbar visibility

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result?.data?.categoryDetails?.categories);
    } catch (error) {
      // toast.error("Error occurred fetching categories.");
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div
      className={`flex fixed top-0 z-[100] h-14 w-full px-2 sm:px-9 lg:px-20 mx-auto items-center justify-between border-b-[1px] border-slate-700 shadow-sm shadow-slate-900 bg-[#10101b]  bg-opacity-80 backdrop-blur-sm`}
    >
      {/* Logo Image */}
      <Link to={"/"}>
        <img
          src={Logo}
          alt="LearnSphere"
          className="md:w-[160px] w-[95px]"
          loading="lazy"
        />
      </Link>

      {/* Toggle Button for Navbar */}
      <button
        className={`absolute p-1 z-30 text-lg rounded-full right-2 top-16 text-slate-900 lg:hidden bg-[#a7caeb] shadow-md shadow-slate-950 bg-opacity-95 backdrop-blur-md`}
        onClick={() => setIsNavbarOpen((prev) => !prev)}
      >
        {isNavbarOpen ? <MdClose /> : <RiMenuUnfold2Fill />}
      </button>

      {/* nav links */}
      <nav className={`${isNavbarOpen ? "block" : "hidden"} lg:block`}>
        <ul className="absolute right-2 top-16 z-20 flex flex-col bg-[#a0c3e4] lg:bg-opacity-0 px-3 py-4 rounded-md gap-x-6 gap-y-4 text-slate-800 font-medium text-[15px] lg:flex-row lg:relative lg:top-0 lg:right-0 lg:bg-none lg:backdrop-blur-none lg:gap-y-0 shadow-md shadow-slate-950 lg:shadow-none">
          {NavbarLinks.map((link, index) => {
            return (
              <li key={index} className="">
                {link.title === "Catalog" ? (
                  <div className="relative flex items-center hover:cursor-pointer group">
                    <p className="text-sm lg:hover:text-blue-50 hover:text-blue-200 lg:text-slate-100 text-slate-700">
                      {link.title}
                    </p>
                    <MdOutlineArrowDropDown className="size-6 lg:text-slate-100 text-slate-700" />

                    <div className="invisible group-hover:visible absolute -top-3 lg:top-2 translate-y-[-12%] rotate-90 lg:rotate-0 -translate-x-[70%] lg:translate-x-0  rounded text-opacity-95 text-slate-400 z-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <IoMdArrowDropup className="size-20 " />
                    </div>

                    <div className="invisible absolute left-1/2 lg:top-1/2 -top-10 lg:-translate-x-1/2 -translate-x-[130%] translate-y-[34px] flex flex-col rounded-xl bg-slate-400 bg-opacity-95 px-2 py-3 text-slate-800 opacity-0 transition-all duration-50 group-hover:visible group-hover:opacity-100 lg:w-[250px] max-h-fit md:w-[200px] w-[150px] z-10 gap-y-3">
                      {subLinks.length ? (
                        subLinks.map((subLink, index) => (
                          <Link
                            to={`/catalog/${subLink.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            key={index}
                            className="w-full h-14 rounded-lg bg-[#4d5c83] bg-opacity-95 hover:bg-[#435275]  flex items-center justify-start md:p-2 p-1 text-start font-medium font-poppins  md:text-sm text-xs text-[#e3fdff] shadow-md shadow-[#212838]"
                          >
                            <p className="flex items-center justify-start w-full h-full transition-all duration-500 ease-in-out hover:text-blue-200 lg:hover:text-blue-50 hover:translate-x-2 drop-shadow-xl">
                              {subLink.name}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <div className="flex flex-row gap-x-2 text-nowrap">
                          <p>Refreshing Categories</p>
                          <span className="dbSpinner"></span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path} className="flex items-center h-full">
                    <p
                      className={`text-sm w-full md:w-auto lg:hover:text-blue-50 hover:text-blue-200  ${
                        matchRoute(link?.path)
                          ? "lg:text-cyan-500 text-[#2e66ff]"
                          : "lg:text-slate-100 text-slate-700"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Search Box */}
      <div
        onClick={() => setOpenBox(true)}
        className="relative flex items-center ml-2 text-[11px] text-teal-500 text-nowrap md:text-sm md:gap-x-2 hover:cursor-pointer gap-x-1"
      >
        <AiOutlineFileSearch className="text-xl md:text-2xl" /> Search Courses
        <div className="absolute -bottom-14">
          {openBox && <SearchBox setOpenBox={setOpenBox} />}
        </div>
      </div>

      {/* Buttons (Login, Signup, Dashboard) */}
      <div className="flex items-center ml-2 text-sm md:gap-x-4 gap-x-2">
        {/* <div
          onClick={toggleTheme}
          className="relative flex items-center p-1 rounded-full w-14 h-7 dark:bg-slate-800 bg-slate-200"
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
    </div>
  );
};

export default Navbar;
