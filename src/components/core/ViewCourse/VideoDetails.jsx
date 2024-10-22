import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { BigPlayButton, Player } from "video-react";
import "video-react/dist/video-react.css"; // import css
import Spinner from "../../common/Spinner";

const VideoDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const { courseId, sectionId, subSectionId } = useParams();
  const playerRef = useRef(null);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!courseSectionData.length) return;
      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolled-courses");
      } else {
        // Note: All fields present
        const filteredSection = courseSectionData.filter(
          (course) => course._id === sectionId
        );

        const filteredExactVideo = filteredSection?.[0].subSection.filter(
          (subSection) => subSection._id === subSectionId
        );

        setVideoData(filteredExactVideo[0]);
        setVideoEnded(false);
      }
    };
    setVideoSpecificDetails();
  }, [courseEntireData, courseSectionData, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData?.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    } else {
      return false;
    }
  };
  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData?.findIndex(
      (data) => data._id === sectionId
    );

    const numberOfSubSections =
      courseSectionData[currentSectionIndex]?.subSection.length;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === numberOfSubSections - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  const toggleNextVideo = () => {
    const currentSectionIndex = courseSectionData?.findIndex(
      (data) => data._id === sectionId
    );

    const numberOfSubSections =
      courseSectionData[currentSectionIndex]?.subSection.length;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    //Note:  Move to next video of same section
    if (currentSubSectionIndex !== numberOfSubSections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex]?.subSection[
          currentSubSectionIndex + 1
        ]._id;
      // navigate to next video
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else {
      //Note: Go to next section first video
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const firstSubSectionOfNextSectionId =
        courseSectionData[currentSectionIndex + 1].subSection[0]._id;

      //  Navigate to firt video of next sub section
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${firstSubSectionOfNextSectionId}`
      );
    }
  };
  const togglePrevVideo = () => {
    const currentSectionIndex = courseSectionData?.findIndex(
      (data) => data._id === sectionId
    );

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndex !== 0) {
      // go to Prev video of same section
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndex - 1
        ]._id;

      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else {
      // Last video of another section
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;

      const numberOfSubSections =
        courseSectionData[currentSectionIndex - 1]?.subSection.length;

      const subSectionOfPrevSectionId =
        courseEntireData[currentSectionIndex - 1].subSection[
          numberOfSubSections - 1
        ]._id;

      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${subSectionOfPrevSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      {
        courseId: courseId,
        subSectionId: subSectionId,
      },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  return (
    <div>
      {!videoData ? (
        <div>No video is available.</div>
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render when video ends */}
          {videoEnded && (
            <div className="absolute bg-gradient-to-t from-slate-950 to-transparent backdrop-blur-sm inset-0 z-[100] grid w-full h-full place-content-center font-inter">
              {!completedLectures.includes(subSectionId) && (
                <button
                  disabled={loading}
                  onClick={() => handleLectureCompletion()}
                  className="px-4 py-2 mx-auto text-lg font-semibold bg-teal-500 rounded-md text-slate-900 max-w-max hover:bg-cyan-500"
                >
                  {!loading ? "Mark As Completed" : <Spinner />}
                </button>
              )}

              <button
                disabled={loading}
                onClick={() => {
                  if (playerRef?.current) {
                    playerRef.current?.seek(0);
                    setVideoEnded(false);
                    playerRef.current?.play();
                  }
                }}
                className="px-4 py-2 mx-auto mt-10 text-lg font-semibold rounded-md bg-slate-600 text-slate-200 max-w-max"
              >
                Rewatch
              </button>

              <div className="flex justify-center min-w-[250pxpx] mt-10 text-lg gap-x-4">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={togglePrevVideo}
                    className="px-4 py-2 mx-auto font-semibold rounded-md bg-slate-800 text-blue-50"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={toggleNextVideo}
                    className="px-4 py-2 mx-auto font-semibold rounded-md bg-slate-800 text-blue-50"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}
      <h1 className="mt-4 text-3xl font-semibold text-[#95a9d8]">
        {videoData?.title}
      </h1>
      <p className="pt-2 pb-6 font-medium text-slate-500 ">
        {videoData?.description}
      </p>
    </div>
  );
};

export default VideoDetails;
