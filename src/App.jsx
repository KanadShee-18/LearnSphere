import "./App.css";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/pages/Homepage";
import Navbar from "./components/common/Navbar";

function App() {
    return (
        <div className="w-screen min-h-screen bg-custom-radial flex flex-col font-inter">
            <Navbar />
            <Routes>
                <Route path="/" element={<Homepage />} />
            </Routes>
        </div>
    );
}

export default App;
