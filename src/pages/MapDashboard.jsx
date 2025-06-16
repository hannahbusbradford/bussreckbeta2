import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function MapDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Only show tow requests that are pending AND unassigned
    const q = query(
      collection(db, "towRequests"),
      where("status", "==", "pending"),
      where("assignedMechanic", "==", null)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    });

    return () => unsub();
  }, []);

  const assignMechanic = async (id) => {
    const user = auth.currentUser;
    if (!user) return alert("❌ You must be logged in.");

    try {
      const reqRef = doc(db, "towRequests", id);
      await updateDoc(reqRef, {
        status: "assigned",
        assignedMechanic: {
          uid: user.uid,
          email: user.email,
        },
      });
      alert("✅ Assigned to you.");
    } catch (err) {
      console.error("Assignment error:", err);
      alert("❌ Could not assign job.");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={[29.7604, -95.3698]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {requests.map((req) =>
          req.location ? (
            <Marker key={req.id} position={[req.location.lat, req.location.lng]}>
              <Popup>
                <strong>{req.name}</strong><br />
                📞 {req.phone}<br />
                🚨 {req.issue}<br />
                <button onClick={() => assignMechanic(req.id)} style={{ marginTop: "6px" }}>
                  ✅ Assign Me
                </button>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
