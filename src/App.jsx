import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import OpenRoute from "./components/core/auth/OpenRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/dashboard/MyProfile";
import Settings from "./components/core/dashboard/Settings/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import Cart from "../src/components/core/dashboard/Cart";
import EnrolledCourses from "../src/components/core/dashboard/EnrolledCourses";
import Instructor from "./components/core/dashboard/InstructorDashboard/Instructor";
import AddCourse from "../src/components/core/dashboard/AddCourse";
import MyCourses from "../src/components/core/dashboard/MyCourses";
import EditCourse from "../src/components/core/dashboard/EditCourse";
import { ACCOUNT_TYPE } from "./utils/constants";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.profile);

    return (
        <div className="w-screen min-h-screen bg-custom-radial flex flex-col font-inter selection:bg-cyan-700">
            <Navbar />
            <Routes>
                <Route path="/" element={<Homepage />} />
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
                    path="update-password"
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
                />

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
            </Routes>
        </div>
    );
}

export default App;
