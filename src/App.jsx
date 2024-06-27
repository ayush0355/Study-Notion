import { Route, Routes,} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./component/common/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./component/core/auth/OpenRoute"


function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<OpenRoute><Login/></OpenRoute>} />
        <Route path="/signup" element={<OpenRoute><Signup/></OpenRoute>} />
        <Route path="/forgot-password" element={<OpenRoute><ForgotPassword/></OpenRoute>} />

      </Routes>
    </div>
  );
}

export default App;
