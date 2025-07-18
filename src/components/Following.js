import "../css/Following.css";

const spaces = [
  {
    title: "Business & Marketing",
    followers: "328.3K",
    description: "Business Ideas, Small Business Start-ups, Invest and Earn, Buy and sell",
    icon: "📈",
  },
  {
    title: "Latest Technology",
    followers: "42.5K",
    description: "All about Latest Science and Technology",
    icon: "🔬",
  },
  {
    title: "Data Analytics Basics",
    followers: "79.6K",
    description: "Business-Statistics, Statistical-Modeling, Analytics-Tools",
    icon: "📊",
  },
  {
    title: "Computer science",
    followers: "152.5K",
    description: "A space for those who love computer science",
    icon: "💻",
  },
  {
    title: "The Marketing & Advertising",
    followers: "121.5K",
    description: "Everything about marketing and advertising",
    icon: "📣",
  },
  {
    title: "Artificial Intelligence Generative AI",
    followers: "3.9K",
    description: "Artificial intelligence (AI) is a wide-ranging branch of computer science",
    icon: "🤖",
  },
  {
    title: "Software",
    followers: "26.1K",
    description: "Useful software-related information",
    icon: "🧰",
  },
];

function Following() {
  return (
    <div className="following-page">
      <h2 className="following-title">Discover Spaces</h2>
      <div className="space-list">
        {spaces.map((space, index) => (
          <div key={index} className="space-card">
            <div className="space-icon">{space.icon}</div>
            <div className="space-details">
              <h3 className="space-title">{space.title}</h3>
              <p className="space-followers">{space.followers} followers</p>
              <p className="space-description">{space.description}</p>
            </div>
            <button className="follow-button">Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Following;