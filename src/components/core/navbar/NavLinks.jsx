import React from "react";
import { IoMdArrowDropup } from "react-icons/io";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { NavbarLinks } from "../../../data/navbar-links";
import { motion } from "framer-motion";

const listitemVariants = {
  initial: { opacity: 0 },
  animate: (index) => ({
    opacity: 1,
    transition: {
      duration: 0.1 * index,
      delay: 0.08 * index,
      type: "spring",
      stiffness: "70",
      damping: "20",
    },
  }),
};

const NavLinks = ({ isNavbarOpen, subLinks, matchRoute }) => {
  return (
    <nav className={`${isNavbarOpen ? "block" : "hidden"} lg:block`}>
      <ul className="absolute right-2 top-16 z-20 flex flex-col bg-[#a0c3e4] lg:bg-opacity-0 px-3 py-4 rounded-md gap-x-6 gap-y-4 text-slate-800 font-medium text-[15px] lg:flex-row lg:relative lg:top-0 lg:right-0 lg:bg-none lg:backdrop-blur-none lg:gap-y-0 shadow-md shadow-slate-950 lg:shadow-none">
        {NavbarLinks.map((link, index) => {
          return (
            <li key={index} className="">
              {link.title === "Catalog" ? (
                <motion.div className="relative flex items-center hover:cursor-pointer group">
                  <p className="text-sm lg:hover:text-blue-50 hover:text-blue-200 lg:text-slate-100 text-slate-700">
                    {link.title}
                  </p>
                  <MdOutlineArrowDropDown className="size-6 lg:text-slate-100 text-slate-700" />

                  <div className="invisible group-hover:visible absolute -top-3 lg:top-2 translate-y-[-12%] rotate-90 lg:rotate-0 -translate-x-[70%] lg:translate-x-0  rounded text-opacity-95 text-slate-400 z-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <IoMdArrowDropup className="size-20 " />
                  </div>

                  <motion.div className="invisible absolute left-1/2 lg:top-1/2 -top-10 lg:-translate-x-1/2 -translate-x-[130%] translate-y-[34px] flex flex-col rounded-xl bg-slate-400 bg-opacity-85 px-2 py-3 text-slate-800 opacity-0 transition-all duration-50 group-hover:visible group-hover:opacity-100 lg:w-[250px] max-h-fit md:w-[200px] w-[150px] z-10 gap-y-3">
                    {subLinks.length ? (
                      subLinks.map((subLink, index) => (
                        <motion.div
                          variants={listitemVariants}
                          initial="initial"
                          whileInView="animate"
                          key={index}
                        >
                          <Link
                            to={`/catalog/${subLink.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            className="w-full h-14 rounded-lg bg-[#4d5c83] bg-opacity-95 hover:bg-[#435275]  flex items-center justify-start md:p-2 p-1 text-start font-medium font-poppins  md:text-sm text-xs text-[#e3fdff] shadow-md shadow-[#212838]"
                          >
                            <p className="flex items-center justify-start w-full h-full transition-all duration-200 hover:text-blue-200 lg:hover:text-blue-50 hover:translate-x-2 drop-shadow-xl">
                              {subLink.name}
                            </p>
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-row gap-x-2 text-nowrap">
                        <p>Refreshing Categories</p>
                        <span className="dbSpinner"></span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
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
  );
};

export default NavLinks;
