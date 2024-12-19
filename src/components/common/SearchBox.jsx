import React, { useEffect, useRef, useState } from "react";
import { getTaggedCourses } from "../../services/operations/courseDetailsAPI";
import { Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import { LuBookMarked } from "react-icons/lu";

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

const SearchBox = ({ setOpenBox }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const debounceTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  const fetchSuggestions = async (query) => {
    if (query === "") {
      setSuggestions([]);
      return;
    }
    const response = await getTaggedCourses(query);
    // console.log(response);
    setSuggestions(response);
  };

  const handleOnChange = (e) => {
    const query = e.target.value;
    // console.log("e.target.value is: ", e.target.value);

    setSearchValue(query);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      // console.log("Query while calling:", query);
      fetchSuggestions(query);
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleLinkClick = (e, courseId) => {
    e.stopPropagation();
    setSuggestions([]);
    setSearchValue("");
    setOpenBox(false);
    navigate(`courses/${courseId}`);
  };

  const handleClickOutside = (event) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      setSuggestions([]);
      setSearchValue("");
      setOpenBox(false);
    }
  };

  const handleCloseButtonClick = (e) => {
    e.stopPropagation();
    setSuggestions([]);
    setSearchValue("");
    setOpenBox(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    // <div
    //   ref={searchContainerRef}
    //   className="fixed text-slate-300 !mt-14 pt-5 grid w-screen h-screen place-items-center inset-0 z-[1000] bg-slate-950 bg-opacity-70"
    // >
    //   <div className="relative w-[350px] md:w-[400px] lg:w-[500px] h-auto min-h-[200px] shadow-md flex gap-x-2 flex-col shadow-slate-950 bg-gradient-to-br from-slate-800 to-slate-900 rounded-md px-4 py-4 text-sm items-start justify-center">
    //     <span className="absolute -top-3 -right-3 text-slate-300">
    //       <button onClick={handleCloseButtonClick}>
    //         <MdClose className="p-1 text-2xl rounded-full bg-slate-700 hover:bg-slate-800 hover:text-slate-200 shadow-md shadow-slate-950" />
    //       </button>
    //     </span>
    //     <h1 className="text-lg mb-3 font-medium text-teal-400 font-inter tracking-wide w-full">
    //       Find your courses here
    //     </h1>
    //     <div className="w-full h-full p-4 flex items-center justify-start bg-gradient-to-br from-slate-700 to-slate-800 rounded-md shadow-md shadow-slate-950">
    //       <div className=" w-[40px] text-xl flex  items-center">
    //         <BsSearch className="relative text-teal-400" />
    //       </div>
    //       <input
    //         type="text"
    //         value={searchValue}
    //         onChange={handleOnChange}
    //         placeholder="Ex: ML, AI, DSA"
    //         className="px-2 py-1 bg-transparent placeholder:text-slate-200 outline-none tracking-wide"
    //       />
    //     </div>
    //     {suggestions.length > 0 && (
    //       <motion.ul
    //         initial={{ y: -20, opacity: 0 }}
    //         animate={{ y: 0, opacity: 1 }}
    //         transition={{
    //           duration: 0.8,
    //           type: "spring",
    //           stiffness: "70",
    //           damping: "20",
    //         }}
    //         className=" w-full px-4 py-4 backdrop-blur-md mt-3 bg-opacity-75 rounded-md bg-slate-800 text-[#cdf1ff]"
    //       >
    //         {suggestions.map((suggestion, index) => (
    //           <motion.li
    //             variants={listitemVariants}
    //             initial="initial"
    //             whileInView="animate"
    //             custom={index}
    //             key={index}
    //             onClick={(e) => handleLinkClick(e, suggestion.courseId)}
    //             className=" px-2 py-3 my-2 text-xs transition-all duration-200 rounded-md shadow-md md:text-sm shadow-slate-950 hover:cursor-pointer hover:text-teal-400 bg-slate-700 hover:scale-95 text-wrap"
    //           >
    //             {suggestion.courseName}
    //           </motion.li>
    //         ))}
    //       </motion.ul>
    //     )}
    //   </div>
    // </div>
    <div
      onClick={() => {
        setSuggestions([]);
        setSearchValue("");
        setOpenBox(false); // Close the search box when clicking outside
      }}
      className="fixed text-slate-300 !mt-14 pt-5 grid w-screen h-screen place-items-center inset-0 z-[1000] bg-slate-950 bg-opacity-70 backdrop-blur-sm"
    >
      <div
        ref={searchContainerRef}
        onClick={(e) => e.stopPropagation()} // Prevent event propagation
        className="relative w-[350px] md:w-[400px] lg:w-[500px] h-auto min-h-[200px] shadow-md flex gap-x-2 flex-col shadow-slate-950 bg-gradient-to-br from-slate-800 to-slate-900 rounded-md px-4 py-4 text-sm items-start justify-center  scrollbar-hide"
      >
        <span className="absolute -top-3 -right-3 text-slate-300">
          <button onClick={handleCloseButtonClick}>
            <MdClose className="p-1 text-2xl rounded-full bg-slate-700 hover:bg-slate-800 hover:text-slate-200 shadow-md shadow-slate-950" />
          </button>
        </span>
        <h1 className="text-lg mb-3 font-medium text-teal-400 font-inter tracking-wide w-full">
          Find your courses here
        </h1>
        <div className="w-full h-full p-4 flex items-center justify-start bg-gradient-to-br from-slate-700 to-slate-800 rounded-md shadow-md shadow-slate-950">
          <div className="w-[40px] text-xl flex items-center">
            <BsSearch className="relative text-teal-400" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={handleOnChange}
            placeholder="Ex: ML, AI, DSA"
            className="px-2 py-1 bg-transparent placeholder:text-slate-200 outline-none tracking-wide"
          />
        </div>
        {suggestions.length > 0 && (
          <motion.ul
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: "70",
              damping: "20",
            }}
            className="w-full px-4 py-4 backdrop-blur-md mt-3 bg-opacity-75 rounded-md bg-slate-800 text-[#cdf1ff]"
          >
            {suggestions.map((suggestion, index) => (
              <motion.li
                variants={listitemVariants}
                initial="initial"
                whileInView="animate"
                custom={index}
                key={index}
                onClick={(e) => handleLinkClick(e, suggestion.courseId)}
                className="px-2 py-3 my-2 text-xs transition-all duration-100 rounded-md shadow-md md:text-sm shadow-slate-950 hover:shadow-slate-700 hover:cursor-pointer hover:text-teal-400 bg-slate-700 text-wrap"
              >
                <span className="flex items-center gap-x-2">
                  <p className="text-xs md:text-sm">
                    &rarr; {suggestion.courseName}
                  </p>
                </span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
