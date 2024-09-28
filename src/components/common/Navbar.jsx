import React, { useEffect, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import Logo from "../../assets/Logo/LL_logo.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropdown from "../core/auth/ProfileDropdown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { IoMdArrowDropup } from "react-icons/io";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);

  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      // console.log("The result of all categories we get: ", result);
      setSubLinks(result?.data?.categoryDetails?.categories);
    } catch (error) {
      console.log("Fetch to get categories list.");
    }
  };

  // console.log("Sublinks are: ", subLinks);

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex fixed top-0 z-50 h-14 w-full px-4 sm:px-9 lg:px-32 mx-auto items-center justify-center border-b-[1px] border-slate-700 shadow-sm shadow-slate-900 bg-[#10101b]">
      <div className="flex items-center justify-between w-full mx-auto">
        {/* Logo Image */}
        <Link to={"/"}>
          <img
            src={Logo}
            alt="LearnSphere"
            className="w-[160px]"
            loading="lazy"
          />
        </Link>

        {/* nav links */}

        <nav>
          <ul className="flex gap-x-6 text-richblack-50 text-[15px]">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index} className="">
                  {link.title === "Catalog" ? (
                    <div className="relative flex items-center hover:cursor-pointer group">
                      <p className="">{link.title}</p>
                      <MdOutlineArrowDropDown className="size-6" />

                      <div className="invisible group-hover:visible absolute top-0 translate-y-[-12%] rounded text-slate-400 z-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <IoMdArrowDropup className="size-20" />
                      </div>

                      <div className="invisible absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-7 flex flex-col rounded-xl bg-slate-400 bg-opacity-95 px-2 py-3 text-slate-800 opacity-0 transition-all duration-50 group-hover:visible group-hover:opacity-100 lg:w-[250px] max-h-fit md:w-[200px] w-[150px] z-10 gap-y-3">
                        {subLinks.length ? (
                          subLinks.map((subLink, index) => (
                            <Link
                              to={`${subLink.name}`}
                              key={index}
                              className="w-full h-14 rounded-lg bg-[#4d5c83] bg-opacity-95 hover:bg-[#435275] hover:text-teal-400 flex items-center justify-start p-2 text-start font-medium font-poppins text-sm text-[#e3fdff] shadow-md shadow-[#435275]"
                            >
                              <p className="flex items-center justify-start w-full h-full transition-all duration-500 ease-in-out hover:translate-x-2 drop-shadow-xl">
                                {subLink.name}
                              </p>
                            </Link>
                          ))
                        ) : (
                          <div>No Category</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-cyan-500"
                            : "text-slate-100"
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

        {/* Buttons (Login, Signup, Dashboard) */}

        <div className="flex items-center text-sm gap-x-4">
          {user && user?.accountType !== "Instructor" && (
            <Link to={"/dashboard/cart"} className="relative text-slate-400">
              <AiOutlineShoppingCart className="size-5" />
              {totalItems > 0 && <span className="absolute">{totalItems}</span>}
            </Link>
          )}
          {token === null && (
            <Link to={"/login"}>
              <button className="border-[1px] border-cyan-700 bg-slate-800 bg-opacity-65 px-4 py-2 hover:bg-cyan-700 hover:bg-opacity-85 active:bg-opacity-70 text-richblack-50 rounded-md">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to={"/signup"}>
              <button className="border-[1px] border-cyan-700 bg-slate-800 bg-opacity-65 px-4 py-2 hover:bg-cyan-700 hover:bg-opacity-85 active:bg-opacity-70 text-richblack-50 rounded-md">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
