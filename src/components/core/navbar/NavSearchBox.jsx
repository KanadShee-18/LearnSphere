import { useEffect, useRef } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import SearchBox from "../../common/SearchBox";

const NavSearchBox = ({ openBox, setOpenBox }) => {
  const handleOnClick = () => {
    setOpenBox(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpenBox(true);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenBox(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setOpenBox]);

  return (
    <div
      onClick={handleOnClick}
      className="relative flex items-center ml-2  text-teal-500 text-nowrap text-sm md:gap-x-2 hover:cursor-pointer gap-x-1"
    >
      <AiOutlineFileSearch className="text-xl md:text-2xl" /> Courses
      <span>
        <kbd className="hidden sm:block text-xs bg-slate-800 text-slate-300 rounded-md py-2 px-2 shadow-inner shadow-slate-500">
          Ctrl + K
        </kbd>
      </span>
      <div className="absolute -bottom-14">
        {openBox && <SearchBox setOpenBox={setOpenBox} />}
      </div>
    </div>
  );
};

export default NavSearchBox;
