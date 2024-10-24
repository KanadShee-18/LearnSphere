import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RequirementField = ({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);

  useEffect(() => {
    if (editCourse) {
      setRequirementList(course?.instructions);
    }
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
  }, []);

  useEffect(() => {
    setValue(name, requirementList);
  }, [requirementList]);

  const handleAddRequirements = () => {
    if (requirement && !requirementList.includes(requirement)) {
      setRequirementList([...requirementList, requirement]);

      setRequirement("");
    }
  };

  const handleRemoveRequiements = (index) => {
    const updatedRequirements = [...requirementList];
    updatedRequirements.splice(index, 1);
    setRequirementList(updatedRequirements);
  };

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <label htmlFor={name}>
          {label} <sup className="text-pink-200">*</sup>{" "}
        </label>
        <input
          type="text"
          id={name}
          value={requirement}
          placeholder="Contents from this course"
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full px-2 py-3 text-sm rounded-md shadow-sm shadow-slate-500 bg-slate-900 text-slate-400 outline-none focus:border-slate-500 focus:border-[1px]"
        />
        <button
          type="button"
          onClick={handleAddRequirements}
          className="px-2 py-1 font-semibold rounded-md text-cyan-600 bg-slate-700 w-fit hover:bg-cyan-700 hover:text-slate-200 active:bg-blue-50 mb-"
        >
          {" "}
          Add
        </button>
      </div>
      {requirementList.length > 0 && (
        <ul className="flex flex-col justify-center mt-3 gap-y-1">
          {requirementList.map((requirement, index) => (
            <li className="flex flex-row items-center px-2 gap-x-2" key={index}>
              <span className="text-slate-300 text-[13px] bg-slate-800 rounded-md p-2 shadow-inner  shadow-slate-600">
                {requirement}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveRequiements(index)}
                className="px-1 py-1 text-[12px] text-blue-200 rounded-md bg-slate-800 border-[1px] border-slate-500"
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && (
        <span className="text-pink-200">Course label is required.</span>
      )}
    </div>
  );
};

export default RequirementField;
