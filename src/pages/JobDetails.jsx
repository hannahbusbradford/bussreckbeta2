import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedIssue, setEditedIssue] = useState("");
  const [editedPhone, setEditedPhone] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      const jobRef = doc(db, "towRequests", id);
      const jobSnap = await getDoc(jobRef);
      if (jobSnap.exists()) {
        const data = jobSnap.data();
        setJob(data);
        setEditedIssue(data.issue || "");
        setEditedPhone(data.phone || "");
        setLoading(false);
      } else {
        alert("Job not found.");
        navigate("/dashboard");
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleSave = async () => {
    const jobRef = doc(db, "towRequests", id);
    await updateDoc(jobRef, {
      issue: editedIssue,
      phone: editedPhone,
    });
    alert("✅ Job updated.");
  };

  const handleComplete = async () => {
    const jobRef = doc(db, "towRequests", id);
    await updateDoc(jobRef, { status: "completed" });
    alert("✅ Marked as completed.");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteDoc(doc(db, "towRequests", id));
      alert("🗑️ Job deleted.");
      navigate("/dashboard");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🔧 Manage Job</h2>
      <p><strong>Name:</strong> {job.name}</p>
      <p>
        <strong>Phone:</strong>
        <input
          type="text"
          value={editedPhone}
          onChange={(e) => setEditedPhone(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </p>
      <p>
        <strong>Issue:</strong><br />
        <textarea
          value={editedIssue}
          onChange={(e) => setEditedIssue(e.target.value)}
          style={{ width: "80%", height: "80px" }}
        />
      </p>
      <p><strong>Status:</strong> {job.status}</p>

      <button onClick={handleSave} style={{ margin: "10px" }}>💾 Save</button>
      <button onClick={handleComplete} style={{ margin: "10px" }}>✅ Complete</button>
      <button onClick={handleDelete} style={{ margin: "10px", backgroundColor: "red", color: "white" }}>
        🗑️ Delete
      </button>
    </div>
  );
}
