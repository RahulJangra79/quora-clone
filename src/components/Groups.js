import React from "react";
import "../css/Groups.css";

const spaces = [
  {
    title: "Latest Technology",
    description: "All about Latest Science and Technology.",
    icon: "🔬",
  },
  {
    title: "Software",
    description: "Useful software-related information.",
    icon: "🧰",
  },
  {
    title: "Mathematics",
    description: "Here, we discuss all things related to mathematics.",
    icon: "📐",
  },
  {
    title: "Dropshipping",
    description: "Start your dropshipping business and become an online entrepreneur.",
    icon: "📦",
  },
  {
    title: "Mission UPSC",
    description: "All about UPSC.",
    icon: "🎓",
  },
  {
    title: "Artificial Intelligence Generative AI",
    description: "All about AI.",
    icon: "🤖",
  },
  {
    title: "All About CA",
    description: "A chill space to talk taxes.",
    icon: "📊",
  },
  {
    title: "NEET/JEE ASPIRANTS",
    description: "Knowledge bank for India’s top exams.",
    icon: "📘",
  },
];

function Groups() {
  return (
    <div className="groups-page">
      <div className="groups-banner">
        <h1>Welcome to Spaces!</h1>
        <div className="groups-actions">
          <button className="create-space-btn">Create a Space</button>
          <button className="discover-space-btn">Discover Spaces</button>
        </div>
      </div>

      <h2 className="groups-section-title">Discover Spaces</h2>
      <p className="groups-subtitle">Spaces you might like</p>

      <div className="groups-list">
        {spaces.map((space, index) => (
          <div key={index} className="groups-card">
            <div className="groups-icon">{space.icon}</div>
            <div className="groups-info">
              <h3 className="groups-title">{space.title}</h3>
              <p className="groups-description">{space.description}</p>
            </div>
            <button className="follow-btn">Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;