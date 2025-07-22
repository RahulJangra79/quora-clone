import React, { useEffect, useState } from "react";
import "../css/User.css";
import Avatar from "@mui/material/Avatar";
import db from "../firebase";
import { useParams, useNavigate } from "react-router-dom";

function User() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (!uid) return;

    const fetchAllData = async () => {
      try {
        const userSnap = await db.collection("users").doc(uid).get();
        if (userSnap.exists) {
          const data = userSnap.data();
          setUserData(data);
          setBio(data.bio || "");
          setLanguage(data.language || "");
          setContact(data.contact || "");
          setAddress(data.address || "");
        }

        const postSnap = await db
          .collection("posts")
          .where("user.uid", "==", uid)
          .orderBy("timestamp", "desc")
          .get();
        setPosts(postSnap.docs.map((doc) => doc.data()));

        const answerSnap = await db
          .collection("answers")
          .where("user.uid", "==", uid)
          .orderBy("timestamp", "desc")
          .get();
        setAnswers(answerSnap.docs.map((doc) => doc.data()));

        const questionsSnap = await db
          .collection("questions")
          .where("user.uid", "==", uid)
          .orderBy("timestamp", "desc")
          .get();
        setQuestions(questionsSnap.docs.map((doc) => doc.data()));

        const followersSnap = await db
          .collection("follows")
          .where("followeeId", "==", uid)
          .get();
        const followerList = followersSnap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: d.followerId,
            display: d.followerDisplay,
            photo: d.followerPhoto,
          };
        });
        setFollowers(followerList);

        const followingSnap = await db
          .collection("follows")
          .where("followerId", "==", uid)
          .get();
        const followingList = followingSnap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: d.followeeId,
            display: d.followeeDisplay,
            photo: d.followeePhoto,
          };
        });
        setFollowing(followingList);

        const spaceSnap = await db
          .collection("spaces")
          .where("createdBy.uid", "==", uid)
          .get();
        setSpaces(spaceSnap.docs.map((doc) => doc.data()));
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchAllData();
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
      console.error("Profile update error:", err);
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
        <p>Total {spaces.length} spaces followed</p>
        <p>
          Joined on{" "}
          {userData.timestamp
            ? new Date(userData.timestamp.toDate()).toDateString()
            : "Unknown"}
        </p>
        <p>{userData.premium ? "Premium" : "Standard"} account</p>
      </div>

      <div className="edit-profile">
        {isEditing ? (
          <button onClick={handleSaveProfile}>Save Profile</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>

      <div className="user-tabs">
        <button
          className={activeTab === "answers" ? "active" : ""}
          onClick={() => setActiveTab("answers")}
        >
          Answers ({answers.length})
        </button>
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          Posts ({posts.length})
        </button>
        <button
          className={activeTab === "followers" ? "active" : ""}
          onClick={() => setActiveTab("followers")}
        >
          Followers ({followers.length})
        </button>
        <button
          className={activeTab === "following" ? "active" : ""}
          onClick={() => setActiveTab("following")}
        >
          Following ({following.length})
        </button>
        <button
          className={activeTab === "spaces" ? "active" : ""}
          onClick={() => setActiveTab("spaces")}
        >
          Spaces ({spaces.length})
        </button>
        <button
          className={activeTab === "questions" ? "active" : ""}
          onClick={() => setActiveTab("questions")}
        >
          Questions ({questions.length})
        </button>{" "}
      </div>

      {activeTab === "posts" && (
        <div className="user-posts">
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            posts.map((post, index) => (
              <div key={index} className="user-post-card">
                <h4>{post.space || "General"}</h4>
                <p>{post.text || post.post}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "answers" && (
        <div className="user-answers">
          {answers.length === 0 ? (
            <p>No answers yet.</p>
          ) : (
            answers.map((answer, index) => (
              <div key={index} className="user-answer-card">
                <p>{answer.answer}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "questions" && (
        <div className="question-section">
          {questions.length === 0 ? (
            <p>No questions found.</p>
          ) : (
            questions.map((q, index) => (
              <div key={index} className="user-question-card">
                <h4>{q.space || "General"}</h4>
                <p>{q.question}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "followers" && (
        <div className="follower-section">
          {followers.length === 0 ? (
            <p>No followers yet.</p>
          ) : (
            followers.map((f) => (
              <div
                key={f.id}
                className="follower-card"
                onClick={() => navigate(`/user/${f.id}`)}
              >
                <Avatar src={f.photo} />
                <p>{f.display}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "following" && (
        <div className="following-section">
          {following.length === 0 ? (
            <p>Not following anyone.</p>
          ) : (
            following.map((f) => (
              <div
                key={f.id}
                className="following-card"
                onClick={() => navigate(`/user/${f.id}`)}
              >
                <Avatar src={f.photo} />
                <p>{f.display}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "spaces" && (
        <div className="space-section">
          {spaces.length === 0 ? (
            <p>No spaces followed yet.</p>
          ) : (
            spaces.map((s, index) => (
              <div key={index} className="space-card">
                <h4>{s.groupTitle}</h4>
                <p>{s.groupDescription}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default User;
