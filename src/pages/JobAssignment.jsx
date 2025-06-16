import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function JobAssignment() {
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "towRequests"),
        where("assignedMechanic.uid", "==", user.uid) // ✅ updated here
      );

      const unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const jobs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAssignedJobs(jobs);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching jobs:", err);
          setError("Failed to fetch assigned jobs.");
          setLoading(false);
        }
      );

      return () => unsubscribeFirestore();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const jobRef = doc(db, "towRequests", jobId);
      await updateDoc(jobRef, { status: newStatus });
      console.log("✅ Status updated to:", newStatus);
    } catch (err) {
      console.error("❌ Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading jobs...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🔧 Assigned Tow Jobs</h1>
      {assignedJobs.length === 0 ? (
        <p>No jobs assigned yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {assignedJobs.map((job) => (
            <li
              key={job.id}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <strong>Name:</strong> {job.name}<br />
              <strong>Phone:</strong> {job.phone}<br />
              <strong>Issue:</strong> {job.issue}<br />
              <strong>Location:</strong> {job.location?.lat}, {job.location?.lng}<br />
              <strong>Status:</strong>{" "}
              <select
                value={job.status || ""}
                onChange={(e) => handleStatusChange(job.id, e.target.value)}
                style={{ marginTop: "5px", padding: "5px" }}
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <br />
              <button
                style={{ marginTop: "10px" }}
                onClick={() => navigate(`/job/${job.id}`)}
              >
                Manage Job
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
