import React from "react";
import HighlightText from "../homeaccessories/HighlightText";

const Quote = () => {
  return (
    <div className="py-5 pb-20 mx-auto text-base font-semibold text-center text-transparent sm:text-xl md:text-4xl max-w-maxContent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-200">
      <span className="text-slate-400 font-playwrite">"</span> We are passionate
      about revolutionizing the way we learn. Our innovative platform{" "}
      <HighlightText text={"combines technology"} />,{" "}
      <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
        {" "}
        expertise
      </span>
      , and community to create an
      <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
        {" "}
        unparalleled educational experience.
        <span className="text-slate-400 font-playwrite">"</span>
      </span>
    </div>
  );
};

export default Quote;
