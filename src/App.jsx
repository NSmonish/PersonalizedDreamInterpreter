import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Intro from "./pages/Intro";
import ToDream from "./pages/ToDream";
import Features from "./pages/Features";
import ContactUs from "./pages/ContactUs";
import Welcome from "./pages/Welcome";
import EnterDream from "./pages/EnterDream";
import Calendar from "./pages/Calendar";
import SubmitAnalysis from "./pages/SubmitAnalysis";

const Home = () => {
  return (
    <>
      <Intro />
      <ToDream />
      <Features />
      <ContactUs />
    </>
  );
};
const Dreams = ({ userName }) => {
  return (
    <>
      <Welcome userName={userName} />
      <EnterDream userName={userName} />
      <Calendar userName={userName} />
      <SubmitAnalysis userName={userName} />
    </>
  );
};
const App = () => {
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "Guest"
  );

  useEffect(() => {
    const updateUserName = () => {
      setUserName(localStorage.getItem("userName") || "Guest");
    };
    window.addEventListener("storage", updateUserName);

    return () => {
      window.removeEventListener("storage", updateUserName);
    };
  }, []);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login setUserName={setUserName} />} />
        <Route path="/signup" element={<Signup setUserName={setUserName} />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/dreams"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Dreams userName={userName} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
