import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 🆕 for back navigation
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate(); // 🆕 navigate hook

  useEffect(() => {
    const q = query(
      collection(db, "mechanicRequests"),
      where("status", "==", "pending")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(list);
    });

    return () => unsub();
  }, []);

  const handleAssign = async (id) => {
    const user = auth.currentUser;
    if (!user) return alert("Not signed in.");

    try {
      await updateDoc(doc(db, "mechanicRequests", id), {
        status: "assigned",
        assignedMechanic: {
          uid: user.uid,
          email: user.email,
        },
      });
      alert("✅ Assigned to you.");
    } catch (err) {
      console.error("Error assigning job:", err);
      alert("❌ Failed to assign job.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/Dashboard")} // 🔙 Back button
        style={{
          marginBottom: "16px",
          padding: "10px 16px",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        🔙 Back to Dashboard
      </button>

      <h2>🧰 Unassigned Maintenance Requests</h2>

      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {requests.map((req) => (
            <li
              key={req.id}
              style={{
                backgroundColor: "#f1f1f1",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "12px",
                border: "1px solid #ccc",
              }}
            >
              <strong>Services:</strong> {req.selectedServices?.join(", ") || "N/A"}<br />
              <strong>Notes:</strong> {req.notes || "None"}<br />
              <strong>Status:</strong> {req.status}
              <br />
              <button
                onClick={() => handleAssign(req.id)}
                style={{
                  marginTop: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ✅ Assign Me
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
