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

export default function MaintenanceRequests() {
  const [user, setUser] = useState(null);
  const [maintenanceJobs, setMaintenanceJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const q = query(
          collection(db, "mechanicRequests"),
          where("assignedMechanic.uid", "==", currentUser.uid)
        );

        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
          const jobs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMaintenanceJobs(jobs);
        });

        return () => unsubscribeFirestore();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteDoc(doc(db, "mechanicRequests", id));
      alert("✅ Deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Failed to delete job.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🧰 Assigned Maintenance Jobs</h2>

      <button onClick={() => navigate("/Dashboard")} style={backStyle}>
        🔙 Back to Dashboard
      </button>

      {maintenanceJobs.length === 0 ? (
        <p>No assigned maintenance jobs found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {maintenanceJobs.map((job) => (
            <li
              key={job.id}
              style={{
                backgroundColor: "#f4f4f4",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              <strong>Customer:</strong> {job.name || "N/A"} <br />
              <strong>Services:</strong> {job.selectedServices?.join(", ") || "N/A"} <br />
              <strong>Status:</strong> {job.status || "pending"} <br />
              <strong>Phone:</strong> {job.phone || "N/A"} <br />
              <button onClick={() => handleDelete(job.id)} style={deleteStyle}>
                🗑️ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const deleteStyle = {
  marginTop: "10px",
  padding: "8px 12px",
  backgroundColor: "#d32f2f",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const backStyle = {
  marginBottom: "20px",
  padding: "10px 16px",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
