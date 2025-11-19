import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

const ChipInput = ({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
  externalValues,
}) => {
  const { editCourse, course } = useSelector((state) => state.course);

  const [chips, setChips] = useState([]);

  const handleKeyDown = (event) => {
    //  checking if user click "Enter" or ","
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const chipValue = event.target.value.trim();
      // Check if value is already included
      if (chipValue && !chips.includes(chipValue)) {
        const newChips = [...chips, chipValue];
        setChips(newChips);
        event.target.value = "";
      }
    }
  };

  const handleDeleteChip = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex);
    setChips(newChips);
  };

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag);
    }
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
  }, []);

  useEffect(() => {
    setValue(name, chips);
  }, [chips]);

  useEffect(() => {
    if (externalValues && Array.isArray(externalValues)) {
      setChips(externalValues);
    }
  }, [externalValues]);

  return (
    <div className='flex flex-col space-y-2'>
      <label htmlFor={name} className='text-sm text-richblack-50'>
        {label} <sup className='text-pink-200'>*</sup>
      </label>

      <div className='flex flex-wrap w-full gap-y-2'>
        {chips.map((chip, index) => (
          <div
            key={index}
            className='flex items-center px-2 py-1 m-1 text-sm rounded-xl bg-slate-600 text-cyan-500'
          >
            {chip}
            <button
              type='button'
              className='ml-2 focus:outline-none'
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className='text-sm' />
            </button>
          </div>
        ))}

        <input
          type='text'
          name={name}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className='w-full px-2 py-3 text-xs md:text-sm rounded-md shadow-sm shadow-slate-500 bg-slate-900 text-slate-400 outline-none focus:border-slate-500 focus:border-[1px]'
        />
      </div>
      {errors[name] && (
        <span className='ml-2 text-xs tracking-wide text-pink-200'>
          {label} is required.
        </span>
      )}
    </div>
  );
};

export default ChipInput;
