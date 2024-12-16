import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

const BounceToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed group md:bottom-8 bottom-4 p-2 rounded-full bg-opacity-45 cursor-pointer  md:right-8 right-2 bg-slate-500 shadow-md shadow-slate-950 ${
        isVisible ? "opacity-100 animate-pulse" : "opacity-0 animate-none"
      }`}
      initial={{ y: 100 }}
      animate={{
        y: isVisible ? 0 : 100,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      }}
      whileHover={{ scale: 1.2 }}
      onClick={scrollToTop}
    >
      {isHovered && (
        <span className="absolute hidden px-2 py-1 text-[10px] transition-transform duration-200 -translate-y-4 rounded shadow-sm sm:block -left-8 -top-3 shadow-blue-200 bg-slate-800 text-slate-200 text-nowrap">
          Scroll to Top
        </span>
      )}
      <FaArrowUp size={16} className="group-hover:text-white text-slate-900"/>
    </motion.div>
  );
};

export default BounceToTop;
