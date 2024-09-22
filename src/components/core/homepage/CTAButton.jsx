import React from "react";
import { Link } from "react-router-dom";

const CTAButton = ({ children, active, linkto }) => {
    return (
        <Link to={linkto}>
            <div
                className={`text-center shadow-sm shadow-slate-200 transition-all duration-200 hover:scale-95 text-sm px-6 py-3 rounded-md font-semibold
                ${
                    active
                        ? "bg-gradient-to-b from-teal-300 to-blue-200 text-black"
                        : "bg-gradient-to-b from-slate-700 to-slate-800 text-white"
                }
                    `}
            >
                {children}
            </div>
        </Link>
    );
};

export default CTAButton;
