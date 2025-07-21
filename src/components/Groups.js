import React, { useEffect, useState } from "react";
import "../css/Groups.css";
import db from "../firebase";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

function Groups() {
  const [spaces, setSpaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSpace, setNewSpace] = useState({ title: "", description: "" });
  const [spaceImage, setSpaceImage] = useState(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;
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

  const handleCreateSpace = async () => {
    if (!newSpace.title.trim()) return;

    try {
      let imageUrl = "";

      if (spaceImage) {
        const data = new FormData();
        data.append("file", spaceImage);
        data.append("upload_preset", "quora-clone");
        data.append("cloud_name", "dmjuvhepw");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dmjuvhepw/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const file = await res.json();
        imageUrl = file.secure_url;
      }

      await db.collection("spaces").add({
        title: newSpace.title,
        description: newSpace.description,
        imageUrl,
        category: newSpace.category || "General",
        createdBy: {
          name: currentUser.displayName,
          photo: currentUser.photoURL,
          email: currentUser.email,
        },
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setNewSpace({ title: "", description: "" });
      setSpaceImage(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error creating space:", error);
    }
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

      {showModal && (
        <div className="create-space-modal">
          <h3>Create a New Space</h3>
          <input
            type="text"
            placeholder="Space Name"
            value={newSpace.title}
            onChange={(e) =>
              setNewSpace({ ...newSpace, title: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            value={newSpace.description}
            onChange={(e) =>
              setNewSpace({ ...newSpace, description: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSpaceImage(e.target.files[0])}
          />
          <select
            value={newSpace.category || ""}
            onChange={(e) =>
              setNewSpace({ ...newSpace, category: e.target.value })
            }
          >
            <option value="">Select a category</option>
            <option value="Science & Technology">Science & Technology</option>
            <option value="Education & Learning">Education & Learning</option>
            <option value="Technology & Programming">
              Technology & Programming
            </option>
            <option value="Lifestyle & Culture">Lifestyle & Culture</option>
            <option value="Career & Business">Career & Business</option>
            <option value="Self-Improvement">Self-Improvement</option>
            <option value="Psychology">Psychology</option>
            <option value="Entertainment & Media">Entertainment & Media</option>
            <option value="News & Current Affairs">
              News & Current Affairs
            </option>
            <option value="Health & Fitness">Health & Fitness</option>
            <option value="Other">Other</option>
          </select>

          <div className="modal-actions">
            <button onClick={handleCreateSpace}>Create</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
