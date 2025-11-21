import React, { useContext, useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo/LL_logo.png";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ThemeContext } from "../../context/ThemeContextProvider";
import { MdClose } from "react-icons/md";
import { RiMenuUnfold2Fill } from "react-icons/ri";
import NavLinks from "../core/navbar/NavLinks";
import NavSearchBox from "../core/navbar/NavSearchBox";
import NavButtons from "../core/navbar/NavButtons";
import { useToken } from "../../context/TokenContext";

const Navbar = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const { theme } = useSelector((state) => state.theme);
  const { token } = useToken();
  const { user } = useSelector((state) => state.profile);
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
          alt='LearnSphere'
          className='md:w-[160px] w-[95px]'
          loading='lazy'
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

      <NavLinks
        isNavbarOpen={isNavbarOpen}
        subLinks={subLinks}
        matchRoute={matchRoute}
      />

      {/* Search Box */}
      <NavSearchBox openBox={openBox} setOpenBox={setOpenBox} />

      {/* Buttons (Login, Signup, Dashboard) */}
      <NavButtons
        pathname={pathname}
        toggleTheme={toggleTheme}
        token={token}
        user={user}
        theme={theme}
      />
    </div>
  );
};

export default Navbar;
