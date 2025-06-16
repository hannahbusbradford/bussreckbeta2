import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={pageStyle}>
      <h1>🚗 Mechanic Dashboard</h1>

      {user ? (
        <>
          <p>Welcome, <strong>{user.email}</strong></p>

          <div style={sectionWrapperStyle}>
            {/* Tow Section */}
            <div style={cardStyle}>
              <h2>🚙 Tow Jobs</h2>
              <Link to="/TowRequest">
                <button style={buttonStyle}>➕ New Tow Request</button>
              </Link>
              <Link to="/MapDashboard">
                <button style={buttonStyle}>🗺️ Tow Request Map</button>
              </Link>
              <Link to="/JobAssignment">
                <button style={buttonStyle}>🔧 My Tow Assignments</button>
              </Link>
            </div>

            {/* Maintenance Section */}
            <div style={cardStyle}>
              <h2>🧰 Maintenance Jobs</h2>
              <Link to="/MaintenanceRequests">
                <button style={buttonStyle}>📋 View All Requests</button>
              </Link>
              <Link to="/MyMaintenanceJobs">
                <button style={buttonStyle}>✅ My Assigned Jobs</button>
              </Link>
              <Link to="/SubmitQualifications">
                <button style={buttonStyle}>📄 Submit Qualifications</button>
              </Link>
            </div>
          </div>

          <button onClick={handleLogout} style={logoutButtonStyle}>
            🚪 Log Out
          </button>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

// 🎨 Styles
const pageStyle = {
  padding: "2rem",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
};

const sectionWrapperStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "2rem",
  marginTop: "2rem",
};

const cardStyle = {
  width: "300px",
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#f5f5f5",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  margin: "10px 0",
  borderRadius: "8px",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const logoutButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#d32f2f",
  marginTop: "2rem",
  maxWidth: "300px",
  marginLeft: "auto",
  marginRight: "auto",
};
