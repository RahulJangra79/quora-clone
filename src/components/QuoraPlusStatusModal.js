import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";
import Avatar from "@mui/material/Avatar";
import "../css/QuoraPlusStatusModal.css";

function QuoraPlusStatusModal({ isOpen, onClose, user }) {
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    const fetchDaysLeft = async () => {
      if (!user?.uid) return;
      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const { subscriptionDate, subscriptionPlan } = data;

        if (!subscriptionDate || !subscriptionPlan) return;

        const start = new Date(subscriptionDate);
        const now = new Date();
        const expiry = new Date(start);
        expiry.setDate(expiry.getDate() + (subscriptionPlan === "monthly" ? 30 : 365));

        const remaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        setDaysLeft(remaining > 0 ? remaining : 0);
      }
    };
    fetchDaysLeft();
  }, [user?.uid]);

  if (!isOpen) return null;

  return (
    <div className="quora-plus-status-overlay" onClick={onClose}>
      <div className="quora-plus-status-modal" onClick={(e) => e.stopPropagation()}>
        <button className="status-close-btn" onClick={onClose}>✕</button>
        <div className="status-header">
          <Avatar src={user?.photo} className="status-avatar">
            {user?.display?.charAt(0)}
          </Avatar>
          <h3>{user?.display}</h3>
        </div>
        <p className="status-message">
          You have <strong>{daysLeft}</strong> day{daysLeft !== 1 ? "s" : ""} remaining in your Quora+ subscription.
        </p>
      </div>
    </div>
  );
}

export default QuoraPlusStatusModal;
