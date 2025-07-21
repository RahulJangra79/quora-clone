import { useEffect, useState } from "react";
import "../css/Groups.css";
import db from "../firebase";
// import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
import CreateSpaceModal from "./CreateSpaceModal";


function Groups() {
  const [spaces, setSpaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // const [newSpace, setNewSpace] = useState({ title: "", description: "" });
  // const [spaceImage, setSpaceImage] = useState(null);
  // const auth = getAuth();
  // const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db
      .collection("spaces")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const loadedSpaces = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSpaces(loadedSpaces);
      });

    return () => unsubscribe();
  }, []);

  const handleViewGroup = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const categorizeSpaces = () => {
    const categoryMap = {};

    spaces.forEach((space) => {
      const category = space.category || "General";
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(space);
    });

    return categoryMap;
  };

  return (
    <div className="groups-page">
      <div className="groups-banner">
        <h1>Welcome to Spaces!</h1>
        <div className="groups-actions">
          <button
            className="create-space-btn"
            onClick={() => setShowModal(true)}
          >
            Create a Space
          </button>
          <button disabled className="discover-space-btn">
            Discover Spaces
          </button>
        </div>
      </div>

      <h2 className="groups-section-title">Discover Spaces</h2>

      {Object.entries(categorizeSpaces()).map(([category, items]) => (
        <div key={category}>
          <h3 className="category-header">{category}</h3>
          <div className="groups-list">
            {items.map((space) => (
              <div key={space.id} className="groups-card">
                <div
                  className="groups-icon"
                  onClick={() => handleViewGroup(space.id)}
                >
                  {space.imageUrl ? (
                    <img
                      src={space.imageUrl}
                      alt={space.title}
                      className="space-logo"
                    />
                  ) : (
                    <span>🌀</span>
                  )}
                </div>
                <div
                  className="groups-info"
                  onClick={() => handleViewGroup(space.id)}
                >
                  <h3 className="groups-title">{space.title}</h3>
                  <p className="groups-description">{space.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showModal && <CreateSpaceModal closeModal={() => setShowModal(false)} />}
    </div>
  );
}

export default Groups;
