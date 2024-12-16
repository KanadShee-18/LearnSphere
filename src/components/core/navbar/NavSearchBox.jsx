import React from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import SearchBox from "../../common/SearchBox";

const NavSearchBox = ({ openBox, setOpenBox }) => {
  return (
    <div
      onClick={() => setOpenBox(true)}
      className="relative flex items-center ml-2 text-[11px] text-teal-500 text-nowrap md:text-sm md:gap-x-2 hover:cursor-pointer gap-x-1"
    >
      <AiOutlineFileSearch className="text-xl md:text-2xl" /> Search Courses
      <div className="absolute -bottom-14">
        {openBox && <SearchBox setOpenBox={setOpenBox} />}
      </div>
    </div>
  );
};

export default NavSearchBox;
