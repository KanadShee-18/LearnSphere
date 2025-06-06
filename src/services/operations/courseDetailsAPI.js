import { toast } from "sonner";

import { updateCompletedLectures } from "../../slices/viewCourseSlice";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  MODIFY_RATING_API,
  DESTROY_RATING_API,
  LECTURE_COMPLETION_API,
  GET_TAGGED_COURSES,
} = courseEndpoints;

export const getTaggedCourses = async (searchQuery) => {
  // console.log("query in frontend: ", searchQuery);

  let result = [];
  try {
    const response = await apiConnector("GET", GET_TAGGED_COURSES, null, null, {
      searchQuery: searchQuery,
    });
    // console.log("TAG COURSES RESPONSE:", response);

    if (!response.data.success) {
      throw new Error("Could not fetch tagged courses.");
    }
    result = response.data.data;
  } catch (error) {
    // console.log("TAG COURSES ERROR", error);

    toast(error.response.data.message);
  }
  return result;
};

export const getAllCourses = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    //console.log("GET_ALL_COURSE_API API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

export const fetchCourseDetails = async (courseId) => {
  //   dispatch(setLoading(true));
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    //console.log("COURSE_DETAILS_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    //console.log("COURSE_DETAILS_API API ERROR............", error);
    result = error.response.data;
    // toast.error(error.response.data.message);
  }

  //   dispatch(setLoading(false));
  return result;
};

// fetching the available course categories
export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    //console.log("COURSE_CATEGORIES_API API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data;
  } catch (error) {
    //console.log("COURSE_CATEGORY_API API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

// add the course details
export const addCourseDetails = async (data, token) => {
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    //console.log("CREATE COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    toast.success("Course Details Added Successfully");
    result = response?.data?.courseData?.newCourse?.course;
  } catch (error) {
    //console.log("CREATE COURSE API ERROR............", error);
    toast.error(error.message);
  }

  //console.log("Course creation result: ", result);
  return result;
};

// edit the course details
export const editCourseDetails = async (data, token) => {
  let result = null;

  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    //console.log("EDIT COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }
    toast.success("Course Details Updated Successfully");
    result = response?.data?.data;
  } catch (error) {
    //console.log("EDIT COURSE API ERROR............", error);
    toast.error(error.message);
  }

  return result;
};

// create a section
export const createSection = async (data, token) => {
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    //console.log("CREATE SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section");
    }
    toast.success("Course Section Created");
    result = response?.data?.updatedCourse;
  } catch (error) {
    //console.log("CREATE SECTION API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

// create a subsection
export const createSubSection = async (data, token) => {
  let result = null;

  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    //console.log("CREATE SUB-SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture");
    }
    toast.success("Lecture Added");
    result = response?.data?.data;
  } catch (error) {
    //console.log("CREATE SUB-SECTION API ERROR............", error);
    toast.error(error.message);
  }

  return result;
};

// update a section
export const updateSection = async (data, token) => {
  let result = null;

  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    //console.log("UPDATE SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section");
    }
    toast.success("Course Section Updated");
    result = response?.data?.data?.updatedCourse;
  } catch (error) {
    //console.log("UPDATE SECTION API ERROR............", error);
    toast.error(error.message);
  }

  return result;
};

// update a subsection
export const updateSubSection = async (data, token) => {
  let result = null;

  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    //console.log("UPDATE SUB-SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture");
    }
    toast.success("Lecture Updated");
    result = response?.data?.data;
  } catch (error) {
    //console.log("UPDATE SUB-SECTION API ERROR............", error);
    toast.error(error.message);
  }

  return result;
};

// delete a section
export const deleteSection = async (data, token) => {
  let result = null;
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    //console.log("DELETE SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section");
    }
    toast.success("Course Section Deleted");
    result = response?.data?.data;
  } catch (error) {
    //console.log("DELETE SECTION API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};
// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null;
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    //console.log("DELETE SUB-SECTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture");
    }
    toast.success("Lecture Deleted");
    result = response?.data?.data;
  } catch (error) {
    //console.log("DELETE SUB-SECTION API ERROR............", error);
    toast.error(error.message);
  }

  return result;
};

// fetching all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    //console.log("INSTRUCTOR COURSES API RESPONSE............", response);
    if (!response?.data?.success) {
      toast.error("Some error occurred while fetching courses!");
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    //console.log("INSTRUCTOR COURSES API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

// delete a course
export const deleteCourse = async (data, token) => {
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    //console.log("DELETE COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course");
    }
    toast.success("Course Deleted Successfully!");
  } catch (error) {
    //console.log("DELETE COURSE API ERROR............", error);
    toast.error(error.message);
  }
};

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    // //console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.data;
  } catch (error) {
    // //console.log("COURSE_FULL_DETAILS_API API ERROR............", error);
    result = error.response.data;
    // toast.error(error.response.data.message);
  }
  return result;
};

// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null;
  // //console.log("mark complete data", data);

  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    // console.log(
    //   "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
    //   response
    // );

    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lecture Completed");
    result = true;
  } catch (error) {
    //console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error);
    toast.error(error.response.data.message);
    result = false;
  }

  return result;
};

// create a rating for course
export const createRating = async (data, token) => {
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    //console.log("CREATE RATING API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating");
    }
    toast.success("Rating Created");
    success = true;
  } catch (error) {
    success = false;
    //console.log("CREATE RATING API ERROR............", error);
    toast.error(error?.response?.data?.message);
  }

  return success;
};

// Edit a rating for course
export const modifyRating = async (data, token) => {
  let success = false;
  try {
    const response = await apiConnector("POST", MODIFY_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    // console.log("EDIT RATING API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could not update review!");
    } else {
      toast.success("Review Updated!");
    }
    success = true;
  } catch (error) {
    success = false;
    // console.log("EDIT RATING API ERROR............", error);
    toast.error(error?.response?.data?.message);
  }
  return success;
};

// Delete a REVIEW for course
export const destroyRating = async (data, token) => {
  let success = false;
  try {
    const response = await apiConnector("DELETE", DESTROY_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    // console.log("DELETE RATING API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could not delete review!");
    } else {
      toast.success("Review Deleted!");
    }
  } catch (error) {
    success = false;
    // console.log("DELETE RATING API ERROR............", error);
    toast.error(error?.response?.data?.message);
  }
  return success;
}