import React, { useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  { name: "Oil Change", price: "$45" },
  { name: "Brake Pads Replacement", price: "$120" },
  { name: "Battery Replacement", price: "$95" },
  { name: "Check Engine Light Diagnosis", price: "$60" },
  { name: "AC Recharge", price: "$100" },
  { name: "Alternator Repair", price: "$250" },
  { name: "Transmission Fluid Change", price: "$130" },
  { name: "Belt or Hose Replacement", price: "$75" },
];

export default function AutoServices() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    if (selectedServices.length === 0) return alert("Select at least one service.");

    try {
      setLoading(true);
      await addDoc(collection(db, "mechanicRequests"), {
        uid: user.uid,
        selectedServices,
        notes,
        status: "pending",
        timestamp: new Date(),
      });
      alert("✅ Request submitted!");
      navigate("/customer");
    } catch (err) {
      console.error("❌ Error submitting request:", err);
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔧 Automotive Services</h2>
      <p>Select services you need below:</p>

      <ul style={styles.list}>
        {SERVICES.map((service) => (
          <li key={service.name} style={styles.listItem}>
            <label>
              <input
                type="checkbox"
                checked={selectedServices.includes(service.name)}
                onChange={() => handleToggleService(service.name)}
              />
              {" "}
              <strong>{service.name}</strong> — <span>{service.price}</span>
            </label>
          </li>
        ))}
      </ul>

      <textarea
        style={styles.textarea}
        placeholder="Describe the issue, symptoms, or any details..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={handleSubmit} style={styles.submitBtn} disabled={loading}>
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  list: {
    textAlign: "left",
    listStyle: "none",
    paddingLeft: 0,
    marginBottom: "20px",
  },
  listItem: {
    marginBottom: "10px",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
  },
  submitBtn: {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
