// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { COURSE_STATUS } from "../../../../utils/constants";
// import ConfirmationModal from "../../../common/ConfirmationModal";
// import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
// import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
// import { RxTimer } from "react-icons/rx";
// import { SiTicktick } from "react-icons/si";
// import { LuFileEdit } from "react-icons/lu";
// import { HiTrash } from "react-icons/hi2";
// import {
//   deleteCourse,
//   fetchInstructorCourses,
// } from "../../../../services/operations/courseDetailsAPI";
// import { setCourse } from "../../../../slices/courseSlice";
// import { toast } from "react-toastify";

// const CourseTable = ({ courses, setCourses }) => {
//   const dispatch = useDispatch();
//   const { token } = useSelector((state) => state.auth);
//   const [loading, setLoading] = useState(false);
//   const [confirmationModal, setConfirmationModal] = useState(null);

//   const handleDeleteCourse = async (courseId) => {
//     setLoading(true);
//     await deleteCourse({ courseId: courseId }, token);
//     const result = await fetchInstructorCourses(token);
//     if (result) {
//       setCourse(result);
//     }
//     setConfirmationModal(null);
//     setLoading(false);
//     toast("Courses recently updated!", { position: "bottom-right" });
//   };

//   return (
//     <div>
//       <Table className="border-[1px] border-slate-500">
//         <Thead className="border-b-2 border-slate-500">
//           <Tr className="border-[1px] border-slate-400">
//             <Th className="border-[1px] border-slate-500">Courses</Th>
//             <Th className="border-[1px] border-slate-500">Duration</Th>
//             <Th className="border-[1px] border-slate-500">Price</Th>
//             <Th className="border-[1px] border-slate-500">Actions</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {courses.length === 0 ? (
//             <Tr>
//               <Td>No Courses Found</Td>
//             </Tr>
//           ) : (
//             courses.map((course) => (
//               <Tr
//                 key={course._id}
//                 className="flex p-8 gap-x-10 border-[1px] rounded border-slate-600 w-full justify-between"
//               >
//                 <Td
//                   className="flex lg:flex-row flex-col gap-x-4 w-[70%]"
//                   rowSpan={1}
//                 >
//                   <img
//                     src={course?.thumbnail}
//                     className="h-[150px] w-[220px] rounded-lg object-cover"
//                   />
//                   <div className="flex flex-col justify-between gap-y-2">
//                     <div className="flex flex-col">
//                       <h1 className="mb-2">{course.courseName}</h1>
//                       <p className="">{course.courseDescription}</p>
//                     </div>
//                     <p className="">Created:</p>
//                     <p className=""></p>
//                     {course.status === COURSE_STATUS.DRAFT ? (
//                       <p className="flex w-fit items-center px-3 py-1 text-sm text-pink-200 rounded-full bg-[#d0f0ff] font-semibold bg-opacity-90 shadow-sm shadow-pink-200 gap-x-2">
//                         <RxTimer className=" size-6" />
//                         DRAFTED
//                       </p>
//                     ) : (
//                       <p className="flex w-fit items-center px-3 py-1 text-sm bg-[#dbf4ff] bg-opacity-90 shadow-sm shadow-sky-500 font-semibold rounded-full gap-x-2 text-blue-200">
//                         <SiTicktick className="size-6" />
//                         PUBLISHED
//                       </p>
//                     )}
//                   </div>
//                 </Td>
//                 <Td cla>
//                   <p>2hr 30mins</p>
//                 </Td>
//                 <Td>
//                   {" "}
//                   <p>{course.price}</p>{" "}
//                 </Td>
//                 <Td>
//                   {" "}
//                   <div className="flex flex-row gap-x-3">
//                     <button className="" disabled={loading}>
//                       <LuFileEdit className="text-xl" />
//                     </button>
//                     <button
//                       className=""
//                       disabled={loading}
//                       onClick={() =>
//                         setConfirmationModal({
//                           text1: "Are You Sure?",
//                           text2: "This whole course content will be deleted!",
//                           btn1Text: "Delete",
//                           btn2Text: "Cancel",
//                           btn1Handler: !loading
//                             ? () => handleDeleteCourse(course._id)
//                             : () => {},
//                           btn2Handler: !loading
//                             ? () => setConfirmationModal(null)
//                             : () => {},
//                         })
//                       }
//                     >
//                       <HiTrash className="text-xl" />
//                     </button>
//                   </div>
//                 </Td>
//               </Tr>
//             ))
//           )}
//         </Tbody>
//       </Table>
//       {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
//     </div>
//   );
// };

// export default CourseTable;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { RxTimer } from "react-icons/rx";
import { SiTicktick } from "react-icons/si";
import { LuFileEdit } from "react-icons/lu";
import { HiTrash } from "react-icons/hi2";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../slices/courseSlice";
import { toast } from "react-toastify";

const CourseTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteCourse = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      dispatch(setCourse(result)); // Ensure you're dispatching the action properly
    }
    setConfirmationModal(null);
    setLoading(false);
    toast("Courses recently updated!", { position: "bottom-right" });
  };

  return (
    <div className="w-10/12 max-w-maxContent">
      <Table>
        <Thead className="border-b-2 border-slate-500">
          <Tr>
            <Th>Courses</Th>
            <Th>Duration</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.length === 0 ? (
            <Tr>
              <Td colSpan="4" className="text-center">
                No Courses Found
              </Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr
                key={course._id}
                className="border-[1px] rounded-md border-slate-400 p-4"
              >
                <Td className="flex items-center gap-x-4">
                  <img
                    src={course?.thumbnail}
                    alt={course.courseName}
                    className="h-[150px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col max-w-[70%]">
                    <h1 className="mb-2">{course.courseName}</h1>
                    <p className="max-w-xs truncate">
                      {course.courseDescription}
                    </p>
                    <p className="text-sm">Created</p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit items-center px-3 py-1 text-sm text-pink-200 rounded-full bg-[#d0f0ff] font-semibold bg-opacity-90 shadow-sm shadow-pink-200 gap-x-2">
                        <RxTimer className="size-6" />
                        DRAFTED
                      </p>
                    ) : (
                      <p className="flex w-fit items-center px-3 py-1 text-sm bg-[#dbf4ff] bg-opacity-90 shadow-sm shadow-sky-500 font-semibold rounded-full gap-x-2 text-blue-200">
                        <SiTicktick className="size-6" />
                        PUBLISHED
                      </p>
                    )}
                  </div>
                </Td>
                <Td className="text-center">2hr 30mins</Td>
                <Td className="text-center">{course.price}</Td>
                <Td className="text-center">
                  <div className="flex justify-center gap-x-3">
                    <button className="" disabled={loading}>
                      <LuFileEdit className="text-xl" />
                    </button>
                    <button
                      className=""
                      disabled={loading}
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Are You Sure?",
                          text2: "This whole course content will be deleted!",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: !loading
                            ? () => handleDeleteCourse(course._id)
                            : () => {},
                          btn2Handler: !loading
                            ? () => setConfirmationModal(null)
                            : () => {},
                        })
                      }
                    >
                      <HiTrash className="text-xl" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseTable;
