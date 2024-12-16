import React from "react";

const Tab = ({ tabData, field, setField }) => {
    return (
        <div className="flex bg-slate-600 p-1 gap-x-1 my-6 rounded-full max-w-max shadow-sm shadow-cyan-300">
            {tabData.map((tab, index) => (
                <button
                key={index}
                    className={`py-2 px-5 rounded-full transition-all duration-200 ${
                        field === tab.type
                            ? "bg-slate-800 text-slate-300"
                            : "bg-transparent text-slate-300"
                    } font-poppins hover:bg-slate-700 active:bg-slate-800`}
                    onClick={() => setField(tab.type)}
                >
                    {tab?.tabName}
                </button>
            ))}
        </div>
    );
};

export default Tab;
