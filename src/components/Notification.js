import React, { useEffect, useState } from "react";
import "../css/Notification.css";
import Avatar from "@mui/material/Avatar";
import db from "../firebase";
import { getAuth } from "firebase/auth";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = db
      .collection("notifications")
      .where("userId", "==", currentUser.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const notes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notes);
      });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="notification-page">
      <h2 className="notification-title">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="notification-empty">No new notifications yet.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((note) => (
            <div key={note.id} className="notification-card">
              <Avatar
                src={note.triggeredBy?.photo}
                className="notification-avatar"
              />
              <div className="notification-content">
                <p className="notification-message">{note.message}</p>
                <span className="notification-time">
                  {new Date(note.timestamp?.toDate()).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
