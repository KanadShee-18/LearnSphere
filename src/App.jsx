import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Homepage from "./components/pages/Homepage";
import Navbar from "./components/common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Catalog from "./components/pages/Catalog";
import CourseDetails from "./components/pages/CourseDetails";
import OpenRoute from "./components/core/auth/OpenRoute";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import VerifyEmail from "./components/pages/VerifyEmail";
import UpdatePassword from "./components/pages/UpdatePassword";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/dashboard/MyProfile";
import Settings from "./components/core/dashboard/Settings/Settings";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.profile);

    return (
        <div className="w-screen min-h-screen bg-custom-radial flex flex-col font-inter">
            <Navbar />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="catalog/:catalogName" element={<Catalog />} />
                <Route path="courses/:courseId" element={<CourseDetails />} />

                <Route
                    path="signup"
                    element={
                        <OpenRoute>
                            <Signup />
                        </OpenRoute>
                    }
                />

                <Route
                    path="login"
                    element={
                        <OpenRoute>
                            <Login />
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
            </Routes>
        </div>
    );
}

export default App;
