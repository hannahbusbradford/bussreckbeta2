import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx"; // ✅ ADDED HOMEPAGE
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TowRequest from "./pages/TowRequest.jsx";
import SubmitQualifications from "./pages/SubmitQualifications.jsx";
import JobAssignment from "./pages/JobAssignment.jsx";
import MechanicProfile from "./pages/MechanicProfile.jsx";
import MechanicDirectory from "./pages/MechanicDirectory.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import MapDashboard from "./pages/MapDashboard.jsx";
import UserProfileSetup from "./pages/UserProfileSetup.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import AutoServices from "./pages/AutoServices";
import MaintenanceRequests from "./pages/MaintenanceRequests";
import MyMaintenanceJobs from "./pages/MyMaintenanceJobs";
import CreateAppointment from "./pages/CreateAppointment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ Homepage is now default */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/towrequest" element={<TowRequest />} />
        <Route path="/submitqualifications" element={<SubmitQualifications />} />
        <Route path="/jobassignment" element={<JobAssignment />} />
        <Route path="/mechanicprofile" element={<MechanicProfile />} />
        <Route path="/mechanicdirectory" element={<MechanicDirectory />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/MapDashboard" element={<MapDashboard />} />
        <Route path="/setup-profile" element={<UserProfileSetup />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/auto-services" element={<AutoServices />} />
        <Route path="/MaintenanceRequests" element={<MaintenanceRequests />} />
        <Route path="/MyMaintenanceJobs" element={<MyMaintenanceJobs />} />
        <Route path="/create-appointment" element={<CreateAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;
