import React from "react";

const IconBtn = ({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center
      ${outline ? "border-[1px] border-cyan-500 bg-transparent" : "p-1"}
      cursor-pointer ${customClasses}
      `}
      type={type}
    >
      {children ? (
        <>
          {children}
          <span className={`${outline && "text-cyan-200"} flex flex-row`}>
            {text}
          </span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default IconBtn;
