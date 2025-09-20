import React from "react";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import OtpVerification from "./components/OTP_verify.jsx";
import Form from "./pages/Form.jsx";
import Dashboard  from "./pages/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Features from "./pages/FeaturePage.jsx";
import AnonymousChat from "./components/anonymusChat.jsx";
import MotivationalProgram from "./components/YoutubeVideo.jsx";
import Community from "./components/Comunity.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/assessment" element={<Form />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/features" element={<Features />} />
        <Route path="/anonymous-chat" element={<AnonymousChat />} />
        <Route path="/motivational-program" element={<MotivationalProgram />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
}

export default App;