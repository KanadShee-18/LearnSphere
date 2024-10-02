import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { TbEdit } from "react-icons/tb";
import { GrEdit } from "react-icons/gr";
import { MdOutlineArrowLeft, MdArrowDropDown } from "react-icons/md";
import { IoTrash } from "react-icons/io5";
import { BsFillTrash2Fill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import SubSectionModal from "./SubSectionModal";
import Spinner from "../../../../common/Spinner";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [expand, setExpand] = useState(true);

  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteSection = async (sectionId) => {
    setLoading(true);
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
      token,
    });
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    console.log("Deleting subsection started.......");
    setLoading(true);
    const result = await deleteSubSection({ subSectionId, sectionId, token });
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <>
      <div className="p-5 mt-9 bg-[#2e3f57] rounded-lg">
        {course?.courseContent?.map((section) => (
          <details key={section._id} open={expand ? true : undefined}>
            <div className="justify-center w-full">
              {loading && <Spinner />}
            </div>
            {/* Section content */}
            <summary className="flex items-center justify-between py-2 border-b-2 cursor-pointer border-b-slate-600">
              <div className="flex flex-row items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-[#6ba8a3]" />
                <p className="font-semibold text-[#73b6b0]">
                  {section.sectionName}
                </p>
              </div>

              <div className="flex flex-row items-center gap-x-3">
                <button
                  onClick={() => setExpand(!expand)}
                  className="text-2xl text-[#6ba8a3]"
                >
                  {expand ? <MdArrowDropDown /> : <MdOutlineArrowLeft />}
                </button>
                <button
                  onClick={() => {
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    );
                  }}
                >
                  <TbEdit className="text-xl text-[#6ba8a3]" />
                </button>
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2:
                        "All the lectures of this section will be deleted.",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <IoTrash className="text-lg text-[#6ba8a3] hover:text-[#ff087b]" />
                </button>
              </div>
            </summary>

            {/* rendering all sub sections inside a sectoon */}
            <div className="flex flex-col p-4 gap-y-2">
              {section.subSection.map((subSection) => (
                <div
                  key={subSection._id}
                  className="flex flex-row text-sm bg-[#202d44] justify-between px-2 py-2 rounded-lg transform transition-all ease-in-out hover:cursor-pointer hover:bg-[#1c3047] hover:translate-x-2 duration-300"
                >
                  <div className="flex flex-row items-center gap-x-3 max-w-[75%]">
                    <RxDropdownMenu className="text-2xl text-[#a8d0f5]" />
                    <p className="font-semibold text-[#a2c5e0] font-poppins text-[13px]">
                      {subSection.title}
                    </p>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-2 text-slate-300"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({
                          ...subSection,
                          sectionId: section._id,
                        })
                      }
                      className="p-2 rounded-full bg-slate-500 bg-opacity-35"
                    >
                      <GrEdit className="text-lg hover:text-green-300" />
                    </button>

                    <button
                      className="p-2 rounded-full bg-slate-500 bg-opacity-35"
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Are You Sure to Delete This Sub-Section?",
                          text2: "This lecture will be deleted!",
                          btn1Text: "Delete Subsection",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(subSection._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <BsFillTrash2Fill className="text-lg transition-all duration-200 hover:text-pink-200 hover:scale-105" />
                    </button>
                  </div>
                </div>
              ))}
              {/* Add new lecture to subsection */}
              <button
                onClick={() => setAddSubSection(section._id)}
                className="flex items-center mt-3 text-teal-500 gap-x-1"
              >
                <FaPlus className="text-sm " />
                <p className="text-sm font-poppins">Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {/* Show the sub section adding lecture  */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Show Confirmation Modal  */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
    </>
  );
};

export default NestedView;
