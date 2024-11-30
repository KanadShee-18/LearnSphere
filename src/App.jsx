import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";

import Catalog from "./pages/Catalog";
import Navbar from "./components/common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, Slide } from "react-toastify";
import ThemeContextProvider from "./context/ThemeContextProvider";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy, useEffect } from "react";
import Spinner from "./components/common/Spinner";
import { Toaster, toast } from "sonner";

// Lazy-loaded components
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const OpenRoute = lazy(() => import("./components/core/auth/OpenRoute"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const Error = lazy(() => import("./pages/Error"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivateRoute = lazy(() => import("./components/core/auth/PrivateRoute"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyProfile = lazy(() => import("./components/core/dashboard/MyProfile"));
const Settings = lazy(() =>
  import("./components/core/dashboard/Settings/Settings")
);
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Cart = lazy(() => import("../src/components/core/dashboard/Cart"));
const EnrolledCourses = lazy(() =>
  import("../src/components/core/dashboard/EnrolledCourses")
);
const Instructor = lazy(() =>
  import("./components/core/dashboard/InstructorDashboard/Instructor")
);
const AddCourse = lazy(() =>
  import("../src/components/core/dashboard/AddCourse")
);
const MyCourses = lazy(() =>
  import("../src/components/core/dashboard/MyCourses")
);
const EditCourse = lazy(() =>
  import("../src/components/core/dashboard/EditCourse")
);
const BackToLogin = lazy(() => import("./pages/BackToLogin"));
const ViewCourse = lazy(() => import("./pages/ViewCourse"));
const VideoDetails = lazy(() =>
  import("./components/core/ViewCourse/VideoDetails")
);
import { ACCOUNT_TYPE } from "./utils/constants";
import Offline from "./components/common/Offline";
import OnlineStatus from "./utils/OnlineStatus";
import Home from "./pages/Home";

function App() {
  // useEffect(() => {
  //   document.addEventListener("contextmenu", (e) => {
  //     e.preventDefault();
  //   });
  // }, []);
  const online = OnlineStatus();

  const { user } = useSelector((state) => state.profile);

  return (
    <>
      <ThemeContextProvider>
        <div className="relative flex flex-col w-screen min-h-screen dark:bg-custom-radial dark:bg-[rgb(3,2,37)] bg-[rgb(194,194,255)] font-inter selection:bg-cyan-700 bg-custom-linear">
          {/* Background overlay */}
          <Navbar />

          {!online && <Offline />}

          {/* Lazy-loaded routes */}
          <Suspense
            fallback={
              <div className="grid h-[60vh] place-items-center">
                <Spinner />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="catalog/:catalogName" element={<Catalog />} />
              <Route path="courses/:courseId" element={<CourseDetails />} />

              <Route
                path="/signup"
                element={
                  <OpenRoute>
                    <Signup />
                  </OpenRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <OpenRoute>
                    <Login />
                  </OpenRoute>
                }
              />

              <Route
                path="/revert-back"
                element={
                  <OpenRoute>
                    <BackToLogin />
                  </OpenRoute>
                }
              />

              <Route
                path="forgot-password"
                element={
                  <OpenRoute>
                    <ForgotPassword />
                  </OpenRoute>
                }
              />

              <Route
                path="verify-email"
                element={
                  <OpenRoute>
                    <VerifyEmail />
                  </OpenRoute>
                }
              />

              <Route
                path="update-password/:id"
                element={
                  <OpenRoute>
                    <UpdatePassword />
                  </OpenRoute>
                }
              />

              <Route
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              >
                <Route path="dashboard/my-profile" element={<MyProfile />} />
                <Route path="dashboard/settings" element={<Settings />} />

                {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                  <>
                    <Route path="dashboard/cart" element={<Cart />} />
                    <Route
                      path="dashboard/enrolled-courses"
                      element={<EnrolledCourses />}
                    />
                  </>
                )}

                {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                  <>
                    <Route
                      path="dashboard/instructor"
                      element={<Instructor />}
                    />
                    <Route
                      path="dashboard/add-course"
                      element={<AddCourse />}
                    />
                    <Route
                      path="dashboard/my-courses"
                      element={<MyCourses />}
                    />
                    <Route
                      path="dashboard/edit-course/:courseId"
                      element={<EditCourse />}
                    />
                  </>
                )}
              </Route>
              <Route
                element={
                  <PrivateRoute>
                    <ViewCourse />
                  </PrivateRoute>
                }
              >
                {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                  <>
                    <Route
                      path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                      element={<VideoDetails />}
                    />
                  </>
                )}
              </Route>

              <Route path="*" element={<Error />} />
            </Routes>
          </Suspense>
          <Toaster richColors position="bottom-right" className="font-inter" />
        </div>
      </ThemeContextProvider>
    </>
  );
}

export default App;
