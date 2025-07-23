import { useEffect, useState } from "react";
import "../css/User.css";
import Avatar from "@mui/material/Avatar";
import db from "../firebase";
import { useParams } from "react-router-dom";
import Post from "./Post";
import { getAuth } from "firebase/auth";

function User() {
  const { uid } = useParams();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      try {
        const userSnap = await db.collection("users").doc(uid).get();
        const user = userSnap.data();
        setUserData(user);
        setBio(user.bio || "");
        setLanguage(user.language || "");
        setContact(user.contact || "");
        setAddress(user.address || "");

        const postSnap = await db
          .collection("posts")
          .where("user.uid", "==", uid)
          .orderBy("timestamp", "desc")
          .get();

        setPosts(postSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        const followSnap = await db
          .collection("follows")
          .where("followeeId", "==", uid)
          .get();
        setFollowers(followSnap.docs.map((doc) => doc.data()));

        const followingSnap = await db
          .collection("follows")
          .where("followerId", "==", uid)
          .get();
        setFollowing(followingSnap.docs.map((doc) => doc.data()));

        const spaceSnap = await db
          .collection("spaces")
          .where("createdBy.uid", "==", uid)
          .get();
        setSpaces(spaceSnap.docs.map((doc) => doc.data()));
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchData();
  }, [uid]);

  const handleSaveProfile = async () => {
    try {
      await db.collection("users").doc(uid).set(
        {
          bio,
          language,
          contact,
          address,
        },
        { merge: true }
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  if (!userData) return <p>Loading profile...</p>;

  return (
    <div className="user-profile">
      <div className="user-header">
        <Avatar src={userData.photo} className="user-avatar" />
        <div className="user-info">
          <h2>{userData.display || userData.name}</h2>
          <div className="user-follow-stats">
            <span>{followers.length} Followers</span>
            <span>{following.length} Following</span>
          </div>
        </div>
      </div>

      <div className="user-highlights">
        {isEditing ? (
          <>
            <input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
            />
            <input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Language"
            />
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contact Number"
            />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </>
        ) : (
          <>
            <p>Language: {userData.language || "N/A"}</p>
            <p>Contact No: {userData.contact || "N/A"}</p>
            <p>Address: {userData.address || "N/A"}</p>
            <p>Bio: {userData.bio || "N/A"}</p>
          </>
        )}
        <p>{spaces.length} spaces followed</p>
        <p>
          Joined on{" "}
          {userData.timestamp
            ? new Date(userData.timestamp.toDate()).toDateString()
            : "Unknown"}
        </p>
        <strong>{userData.premium ? "Premium" : "Standard"} account</strong>
      </div>

      {currentUser?.uid === uid && (
        <div className="edit-profile">
          {isEditing ? (
            <button onClick={handleSaveProfile}>Save Profile</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      )}

      <div className="user-tabs">
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          Posts ({posts.length})
        </button>
      </div>

      {activeTab === "posts" && (
        <div className="user-posts">
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                post={post.post || post.text}
                imageUrl={post.imageUrl}
                timestamp={post.timestamp}
                user={post.user}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default User;
