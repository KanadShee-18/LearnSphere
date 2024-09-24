import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courseSectionData: [],
    courseEntireData: [],
    completedLectures: [],
    totalNoOfLectures: 0,
};

const viewCourseSlice = createSlice({
    name: "viewCourse",
    initialState: initialState,
    reducers: {
        setCourseSectionData: (state, action) => {
            state.courseSectionData = action.payload;
        },
        setCourseEntireData: (state, action) => {
            state.courseEntireData = action.payload;
        },
        setCompletedLectures: (state, action) => {
            state.completedLectures = action.payload;
        },
        setTotalNoOfLectures: (state, action) => {
            state.totalNoOfLectures = action.payload;
        },
        updateCompletedLectures: (state, action) => [
            ...state.completedLectures,
            action.payload,
        ],
    },
});

export const {
    setCourseSectionData,
    setCourseEntireData,
    setCompletedLectures,
    setTotalNoOfLectures,
    updateCompletedLectures,
} = viewCourseSlice.actions;

export default viewCourseSlice.reducer;
