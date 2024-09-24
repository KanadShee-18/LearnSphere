import React from "react";

const HighlightText = ({ text }) => {
    return (
        <span className=" font-bold bg-gradient-to-b from-blue-300 to-teal-400 text-transparent bg-clip-text">
            {" "}
            {text}
        </span>
    );
};

export default HighlightText;
