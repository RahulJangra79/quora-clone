import React from "react";
import "../css/Notification.css";
import Avatar from "@mui/material/Avatar";

const notifications = [
  {
    id: 1,
    type: "answer",
    message: "Rahul answered your question",
    time: "2 hours ago",
    userPhoto: "https://example.com/avatar1.png",
  },
  {
    id: 2,
    type: "follow",
    message: "Arjun started following you",
    time: "1 day ago",
    userPhoto: "https://example.com/avatar2.png",
  },
  {
    id: 3,
    type: "upvote",
    message: "Priya upvoted your answer",
    time: "3 days ago",
    userPhoto: "https://example.com/avatar3.png",
  },
];

function Notification() {
  return (
    <div className="notification-page">
      <h2 className="notification-title">Notifications</h2>
      <div className="notification-list">
        {notifications.map((note) => (
          <div key={note.id} className="notification-card">
            <Avatar src={note.userPhoto} className="notification-avatar" />
            <div className="notification-content">
              <p className="notification-message">{note.message}</p>
              <span className="notification-time">{note.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notification;