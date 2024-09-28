// import React, { useEffect, useState } from "react";
// import ProgressBar from "@ramonak/react-progress-bar";
// import { useSelector } from "react-redux";
// import { getUserEnrolledCourses } from "../../../services/operations/profileApi";
// import Spinner from "../../common/Spinner";

// const EnrolledCourses = () => {
//   const { token } = useSelector((state) => state.auth);
//   const [enrolledCourses, setEnrolledCourses] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const getEnrolledCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await getUserEnrolledCourses(token);
//       setEnrolledCourses(response);
//       setLoading(false);
//     } catch (error) {
//       console.log("Unable to set enrolled courses.");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getEnrolledCourses();
//   }, []);

//   return (
//     <div>
//       <div>Enrolled Courses</div>

//       {!enrolledCourses ? (
//         <div>
//           <Spinner />
//         </div>
//       ) : !enrolledCourses.length ? (
//         <p>You have not enrolled in any courses.</p>
//       ) : (
//         <div>
//           <div>
//             <p>Course Name</p>
//             <p>Duration</p>
//             <p>Progress</p>
//           </div>
//           {/* Courses card */}

//           {enrolledCourses.map((course, index) => (
//             <div
//               key={index}
//               className="flex flex-col justify-around md:flex-row md:justify-between"
//             >
//               <div className="flex flex-row gap-x-3">
//                 <img
//                   src={course.thumbnail}
//                   alt={course.name}
//                   className="object-cover rounded-md"
//                 />
//                 <div className="flex flex-col">
//                   <p>{course.name}</p>
//                   <p>{course.description}</p>
//                 </div>
//               </div>
//               <div>{course?.totalDuration}</div>
//               <div>
//                 <p>Progress: {course.progressPercentage || 0}%</p>
//                 <ProgressBar
//                   completed={course.progressPercentage || 0}
//                   height="8px"
//                   isLabelVisible={false}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnrolledCourses;

import React, { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileApi";
import Spinner from "../../common/Spinner";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [loading, setLoading] = useState(false);

  const getEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Unable to set enrolled courses.");
    } finally {
      setLoading(false); // Ensure loading is false after the request completes
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div>
      <div>Enrolled Courses</div>

      {loading ? (
        <Spinner />
      ) : !enrolledCourses || !enrolledCourses.length ? (
        <p>You have not enrolled in any courses.</p>
      ) : (
        <div>
          <div>
            <p>Course Name</p>
            <p>Duration</p>
            <p>Progress</p>
          </div>
          {/* Courses card */}
          {enrolledCourses.map((course, index) => (
            <div
              key={index}
              className="flex flex-col justify-around md:flex-row md:justify-between"
            >
              <div className="flex flex-row gap-x-3">
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <p>{course.name}</p>
                  <p>{course.description}</p>
                </div>
              </div>
              <div>{course?.totalDuration}</div>
              <div>
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
