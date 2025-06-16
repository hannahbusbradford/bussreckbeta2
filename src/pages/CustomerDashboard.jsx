import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import logo from "../assets/bussreck-logo.png";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [mechanicJobs, setMechanicJobs] = useState([]);
  const [towJobs, setTowJobs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);

        const mechQuery = query(
          collection(db, "mechanicRequests"),
          where("uid", "==", u.uid)
        );

        const towQuery = query(
          collection(db, "towRequests"),
          where("uid", "==", u.uid)
        );

        const apptQuery = query(
          collection(db, "appointments"),
          where("customerId", "==", u.uid)
        );

        const unsubMech = onSnapshot(mechQuery, (snapshot) => {
          setMechanicJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        const unsubTow = onSnapshot(towQuery, (snapshot) => {
          setTowJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        const unsubAppt = onSnapshot(apptQuery, (snapshot) => {
          setAppointments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
          unsubMech();
          unsubTow();
          unsubAppt();
        };
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCancel = async (collectionName, id) => {
    if (!window.confirm("Cancel this request?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      alert("Request cancelled.");
    } catch (err) {
      console.error(err);
      alert("Error cancelling.");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="Bussreck logo" style={styles.logo} />
      <h2 style={styles.heading}>Welcome 👋</h2>

      <div style={styles.buttonGroup}>
        <button onClick={() => navigate("/towrequest")} style={styles.primaryBtn}>
          🚗 Request Tow
        </button>
        <button onClick={() => navigate("/auto-services")} style={styles.secondaryBtn}>
          🔧 Auto Repair & Maintenance
        </button>
        <button onClick={() => navigate("/create-appointment")} style={styles.secondaryBtn}>
          📅 Schedule Appointment
        </button>
      </div>

      <div style={styles.section}>
        <h3>📋 Your Jobs</h3>

        {towJobs.length > 0 && (
          <div>
            <h4>🚨 Tow Requests</h4>
            {towJobs.map((job) => (
              <div key={job.id} style={styles.card}>
                <p><strong>Issue:</strong> {job.issue}</p>
                <p><strong>Status:</strong> {job.status || "pending"}</p>
                <button onClick={() => handleCancel("towRequests", job.id)} style={styles.cancelBtn}>❌ Cancel</button>
              </div>
            ))}
          </div>
        )}

        {mechanicJobs.length > 0 && (
          <div>
            <h4>🧰 Maintenance</h4>
            {mechanicJobs.map((job) => (
              <div key={job.id} style={styles.card}>
                <p><strong>Services:</strong> {job.selectedServices?.join(", ")}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <button onClick={() => handleCancel("mechanicRequests", job.id)} style={styles.cancelBtn}>❌ Cancel</button>
              </div>
            ))}
          </div>
        )}

        {appointments.length > 0 && (
          <div>
            <h4>📅 Scheduled Appointments</h4>
            {appointments.map((appt) => (
              <div key={appt.id} style={styles.card}>
                <p><strong>Service:</strong> {appt.serviceType}</p>
                <p><strong>Mechanic:</strong> {appt.mechanicId}</p>
                <p><strong>Date:</strong> {new Date(appt.date.seconds * 1000).toLocaleString()}</p>
                <p><strong>Status:</strong> {appt.status}</p>
                <button onClick={() => handleCancel("appointments", appt.id)} style={styles.cancelBtn}>❌ Cancel</button>
              </div>
            ))}
          </div>
        )}

        {towJobs.length === 0 && mechanicJobs.length === 0 && appointments.length === 0 && (
          <p style={{ marginTop: "1rem" }}>No active jobs or appointments.</p>
        )}
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Log Out</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    textAlign: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  logo: {
    width: "120px",
    marginBottom: "1rem",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "30px",
  },
  primaryBtn: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  section: {
    textAlign: "left",
    marginTop: "2rem",
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    border: "1px solid #ddd",
  },
  cancelBtn: {
    marginTop: "8px",
    backgroundColor: "#d32f2f",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logoutBtn: {
    marginTop: "30px",
    padding: "10px 20px",
    fontSize: "14px",
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
