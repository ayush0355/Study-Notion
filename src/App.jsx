import { Route, Routes,} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./component/common/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./component/core/auth/OpenRoute"
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./component/core/auth/PrivateRoute"
import MyProfile from "./component/core/Dashboard/MyProfile";
import Settings from "./component/core/Dashboard/Settings/index"

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col relative font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<OpenRoute><Login/></OpenRoute>} />
        <Route path="signup" element={<OpenRoute><Signup/></OpenRoute>} />
        <Route path="forgot-password" element={<OpenRoute><ForgotPassword/></OpenRoute>} />
        <Route path="about" element={<About/>} />

        <Route path="update-password/:id" 
          element={
          <OpenRoute>
            <UpdatePassword />
          </OpenRoute>
        } />
        
        <Route path="verify-email"  
          element={
          <OpenRoute>
            <VerifyEmail />
          </OpenRoute>
        } />

        <Route 
          path="contact"

          element={
            <Contact />
          }
        />

        <Route
          
           element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>}
        >

        <Route path="dashboard/my-profile" element={<MyProfile />} />
        <Route path="dashboard/Settings" element={<Settings />} />

        </Route>

      </Routes>
    </div>
  );
}

export default App;
