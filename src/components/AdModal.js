import React, { useEffect, useState } from "react";
import "../css/AdModal.css";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import QuoraPlusModal from "./QuoraPlusModal";
import ad1 from "../images/Quora-logo.png";
import ad2 from "../images/Quora-logo.png";
import ad3 from "../images/Quora-logo.png";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

function AdModal() {
  const user = useSelector(selectUser);

  const [showAd, setShowAd] = useState(false);
  const [isQuoraPlusUser, setIsQuoraPlusUser] = useState(false);
  const [isQuoraPlusModalOpen, setIsQuoraPlusModalOpen] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const delays = [120000, 240000];
  const [cycleIndex, setCycleIndex] = useState(0);

  const adQueue = [
    {
      title: "Join Quora+",
      description: "Unlock exclusive answers from top experts.",
      imageUrl: ad1,
      ctaText: "Try Quora+",
      onClick: () => setIsQuoraPlusModalOpen(true),
    },
    {
      title: "Explore Tech Spaces",
      description: "Follow developers, designers, and tech thinkers.",
      imageUrl: ad2,
      ctaText: "Browse Spaces",
      onClick: () => setIsQuoraPlusModalOpen(true),
    },
    {
      title: "Upgrade Your Content",
      description: "Access deeper insights with a Quora+ subscription.",
      imageUrl: ad3,
      ctaText: "Get Premium",
      onClick: () => setIsQuoraPlusModalOpen(true),
    },
  ];

  useEffect(() => {
    const fetchUserStatus = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const ref = doc(db, "users", user.uid);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) return;

      const data = snapshot.data();
      const { isQuoraPlus, subscriptionDate, subscriptionPlan } = data;

      if (!isQuoraPlus || !subscriptionDate || !subscriptionPlan) return;

      const now = new Date();
      const subscribed = new Date(subscriptionDate);
      const expiry = new Date(subscribed);
      expiry.setDate(
        expiry.getDate() + (subscriptionPlan === "monthly" ? 30 : 365)
      );

      setIsQuoraPlusUser(expiry > now);
    };

    fetchUserStatus();
  }, []);

  useEffect(() => {
    if (isQuoraPlusUser) return;

    const triggerAd = () => {
      setShowAd(true);
      setShowCloseButton(false);

      setTimeout(() => {
        setShowCloseButton(true);
      }, 15000); // show close button after 15s

      setCurrentAdIndex((prev) => (prev + 1) % adQueue.length);

      setCycleIndex((prev) => (prev + 1) % delays.length);
      setTimeout(triggerAd, delays[cycleIndex]);
    };

    const initialTimer = setTimeout(triggerAd, delays[cycleIndex]);

    return () => clearTimeout(initialTimer);
  }, [isQuoraPlusUser, cycleIndex]);

  if (!showAd || isQuoraPlusUser) return null;

  const { title, description, imageUrl, ctaText, onClick } =
    adQueue[currentAdIndex];

  return (
    <div className="ad-modal-backdrop">
      <div className="ad-modal">
        <img src={imageUrl} alt={title} className="ad-img" />
        <div className="ad-text">
          <h3>{title}</h3>
          <p>{description}</p>
          <button onClick={onClick}>{ctaText}</button>
        </div>
        {showCloseButton && (
          <button className="ad-close" onClick={() => setShowAd(false)}>
            ×
          </button>
        )}
      </div>
      <QuoraPlusModal
        isOpen={isQuoraPlusModalOpen}
        onClose={() => setIsQuoraPlusModalOpen(false)}
        user={user}
      />
    </div>
  );
}

export default AdModal;
