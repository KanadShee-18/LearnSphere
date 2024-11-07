// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { getTaggedCourses } from "../../services/operations/courseDetailsAPI";
// import { Link, useNavigate } from "react-router-dom";
// import { debounce, initial } from "lodash";
// import { BsSearch } from "react-icons/bs";
// import { motion } from "framer-motion";

// const listitemVariants = {
//   initial: { opacity: 0 },
//   animate: (index) => ({
//     opacity: 1,
//     transition: {
//       duration: 0.1 * index,
//       delay: 0.08 * index,
//       type: "spring",
//       stiffness: "70",
//       damping: "20",
//     },
//   }),
// };

// const SearchBox = ({ setOpenBox }) => {
//   const navigate = useNavigate();
//   const [searchValue, setSearchValue] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const searchContainerRef = useRef(null);

//   const fetchSuggestions = async (query) => {
//     if (query === "") {
//       setSuggestions([]);
//       return;
//     }
//     const response = await getTaggedCourses(query);
//     // console.log(response);
//     setSuggestions(response);
//   };

//   const debouncedFetchSuggestions = useCallback(
//     debounce((query) => fetchSuggestions(query), 700),
//     []
//   );

//   const handleOnChange = (e) => {
//     const query = e.target.value;
//     // console.log("e.target.value is: ", e.target.value);
//     setSearchValue(query);
//     debouncedFetchSuggestions(query);
//   };

//   const handleLinkClick = (courseId) => {
//     setSuggestions([]);
//     setSearchValue("");
//     navigate(`courses/${courseId}`);
//   };

//   const handleClickOutside = (event) => {
//     if (
//       searchContainerRef.current &&
//       !searchContainerRef.current.contains(event.target)
//     ) {
//       setSuggestions([]);
//       setSearchValue("");
//       setOpenBox(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       debouncedFetchSuggestions.cancel();
//     };
//   }, [debouncedFetchSuggestions]);

//   // console.log("Search Value: ", searchValue);

//   return (
//     <div ref={searchContainerRef} className="relative text-slate-300">
//       <div className="w-[200px] h-auto shadow-md flex gap-x-2 shadow-slate-950 bg-slate-700 rounded-md px-2 py-1 text-sm">
//         <div className=" w-[40px] text-xl flex  items-center">
//           <BsSearch className="relative text-teal-400" />
//         </div>
//         <input
//           type="text"
//           value={searchValue}
//           onChange={handleOnChange}
//           placeholder="Search courses"
//           className="px-2 py-1 bg-transparent outline-none "
//         />
//       </div>
//       {suggestions.length > 0 && (
//         <motion.ul
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{
//             duration: 0.8,
//             type: "spring",
//             stiffness: "70",
//             damping: "20",
//           }}
//           className="absolute w-[200px] px-2 py-2 backdrop-blur-md mt-3 bg-opacity-75 rounded-md bg-slate-800 text-[#cdf1ff]"
//         >
//           {suggestions.map((suggestion, index) => (
//             <motion.li
//               variants={listitemVariants}
//               initial="initial"
//               whileInView="animate"
//               // viewport={{
//               //   once: true,
//               // }}
//               custom={index}
//               key={index}
//               onClick={() => handleLinkClick(suggestion.courseId)}
//               className="w-full px-2 py-1 my-2 text-sm transition-all duration-200 rounded-md shadow-md shadow-slate-950 hover:cursor-pointer hover:text-teal-400 bg-slate-700 hover:scale-95"
//             >
//               {suggestion.courseName}
//             </motion.li>
//           ))}
//         </motion.ul>
//       )}
//     </div>
//   );
// };

// export default SearchBox;

import React, { useEffect, useRef, useState } from "react";
import { getTaggedCourses } from "../../services/operations/courseDetailsAPI";
import { Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
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
    console.log(response);
    setSuggestions(response);
  };

  const handleOnChange = (e) => {
    const query = e.target.value;
    console.log("e.target.value is: ", e.target.value);

    setSearchValue(query);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Use the latest query directly in the timeout
    debounceTimeoutRef.current = setTimeout(() => {
      console.log("Query while calling:", query);
      fetchSuggestions(query); // Pass the latest query directly
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleLinkClick = (courseId) => {
    setSuggestions([]);
    setSearchValue("");
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  console.log("Search Value: ", searchValue);

  return (
    <div ref={searchContainerRef} className="relative text-slate-300">
      <div className="w-[200px] h-auto shadow-md flex gap-x-2 shadow-slate-950 bg-slate-700 rounded-md px-2 py-1 text-sm">
        <div className=" w-[40px] text-xl flex  items-center">
          <BsSearch className="relative text-teal-400" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleOnChange}
          placeholder="Search courses"
          className="px-2 py-1 bg-transparent outline-none "
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
          className="absolute w-[200px] px-2 py-2 backdrop-blur-md mt-3 bg-opacity-75 rounded-md bg-slate-800 text-[#cdf1ff]"
        >
          {suggestions.map((suggestion, index) => (
            <motion.li
              variants={listitemVariants}
              initial="initial"
              whileInView="animate"
              // viewport={{
              //   once: true,
              // }}
              custom={index}
              key={index}
              onClick={() => handleLinkClick(suggestion.courseId)}
              className="w-full px-2 py-1 my-2 text-sm transition-all duration-200 rounded-md shadow-md shadow-slate-950 hover:cursor-pointer hover:text-teal-400 bg-slate-700 hover:scale-95 text-wrap"
            >
              {suggestion.courseName}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default SearchBox;
