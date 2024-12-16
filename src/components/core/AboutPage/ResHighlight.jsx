import React from "react";

const ResHighlight = ({ text }) => {
  return (
    <span className="font-bold text-transparent bg-gradient-to-br from-purple-500 via-pink-300 to-orange-500 bg-clip-text">
      {" "}
      {text}
    </span>
  );
};

export default ResHighlight;
