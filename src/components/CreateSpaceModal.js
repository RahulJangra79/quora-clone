import React, { useState } from "react";
import "../css/CreateSpaceModal.css";
import firebase from "firebase/compat/app";
import db from "../firebase";
import { getAuth } from "firebase/auth";

function CreateSpaceModal({ closeModal, refreshSpaces }) {
  const [newSpace, setNewSpace] = useState({ title: "", description: "", category: "" });
  const [spaceImage, setSpaceImage] = useState(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleCreate = async () => {
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

      closeModal();
      refreshSpaces?.(); // optional callback
    } catch (error) {
      console.error("Error creating space:", error);
    }
  };

  return (
    <div className="create-space-modal">
      <h3>Create a New Space</h3>
      <input
        type="text"
        placeholder="Space Name"
        value={newSpace.title}
        onChange={(e) => setNewSpace({ ...newSpace, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={newSpace.description}
        onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSpaceImage(e.target.files[0])}
      />
      <select
        value={newSpace.category || ""}
        onChange={(e) => setNewSpace({ ...newSpace, category: e.target.value })}
      >
        <option value="">Select a category</option>
        <option value="Science & Technology">Science & Technology</option>
        <option value="Education & Learning">Education & Learning</option>
        <option value="Technology & Programming">Technology & Programming</option>
        <option value="Lifestyle & Culture">Lifestyle & Culture</option>
        <option value="Career & Business">Career & Business</option>
        <option value="Self-Improvement">Self-Improvement</option>
        <option value="Psychology">Psychology</option>
        <option value="Entertainment & Media">Entertainment & Media</option>
        <option value="News & Current Affairs">News & Current Affairs</option>
        <option value="Health & Fitness">Health & Fitness</option>
        <option value="Other">Other</option>
      </select>

      <div className="modal-actions">
        <button onClick={handleCreate}>Create</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}

export default CreateSpaceModal;
