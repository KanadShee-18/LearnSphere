import "./App.css";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/pages/Homepage";

function App() {
    return (
        <div className="w-screen min-h-screen bg-custom-radial flex flex-col">
            <Routes>
                <Route path="/" element={<Homepage />} />
            </Routes>
        </div>
    );
}

export default App;
