import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../firebase";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "../css/GroupInfo.css";
import Avatar from "@mui/material/Avatar";

function GroupInfo() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followDocId, setFollowDocId] = useState(null);
  const [followerCount, setFollowerCount] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchGroup = async () => {
      const doc = await db.collection("spaces").doc(groupId).get();
      setGroup(doc.exists ? doc.data() : null);
    };

    fetchGroup();

    const unsubscribeFollowerCount = db
      .collection("groupfollows")
      .where("groupId", "==", groupId)
      .onSnapshot((snapshot) => {
        setFollowerCount(snapshot.size);
      });

    const unsubscribeFollowStatus = db
      .collection("groupfollows")
      .where("userId", "==", currentUser?.uid || "")
      .where("groupId", "==", groupId)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          setIsFollowing(true);
          setFollowDocId(snapshot.docs[0].id);
        } else {
          setIsFollowing(false);
          setFollowDocId(null);
        }
      });

    return () => {
      unsubscribeFollowerCount();
      unsubscribeFollowStatus();
    };
  }, [groupId, currentUser]);

  const handleToggleFollow = async () => {
    if (!group || !currentUser) return;

    try {
      if (isFollowing && followDocId) {
        await db.collection("groupfollows").doc(followDocId).delete();
        setIsFollowing(false);
        setFollowDocId(null);
      } else {
        const docRef = await db.collection("groupfollows").add({
          groupId,
          userId: currentUser.uid,
          ownerId: group.createdBy.uid,
          user: {
            uid: currentUser.uid,
            display: currentUser.displayName,
            photo: currentUser.photoURL,
            email: currentUser.email,
          },
          groupTitle: group.title,
          groupImage: group.imageUrl || "",
          groupDescription: group.description || "",
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setIsFollowing(true);
        setFollowDocId(docRef.id);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (!group) return <p>Loading group info...</p>;

  return (
    <div className="group-info-page">
      <div className="group-main">
        <img src={group.imageUrl} alt={group.title} className="group-banner" />
        <div className="group-info">
          <h2>{group.title}</h2>
          <p>
            {group.description}.{" "}
            <span className="group-followers">{followerCount} Followers</span>
          </p>

          {currentUser?.uid && (
            <button className="follow-btn" onClick={handleToggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div className="group-admin">
        <div className="admin-info">
          <h5>Admin</h5>
          <p className="group-admin-security">
            Admins can manage submissions, content, and settings
          </p>
          <div className="admin-detail">
            <Avatar src={group.createdBy.photo}>
              {group.createdBy?.name.charAt(0)}
            </Avatar>
            <p className="group-admin-name">{group.createdBy.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupInfo;
