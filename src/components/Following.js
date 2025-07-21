import "../css/Following.css";
import { useEffect, useState } from "react";
import db from "../firebase";
import { getAuth } from "firebase/auth";
import Avatar from "@mui/material/Avatar";

function Following() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [followedGroups, setFollowedGroups] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [followsMap, setFollowsMap] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserFollows = async () => {
      const snapshot = await db
        .collection("follows")
        .where("followerId", "==", currentUser.uid)
        .get();

      const users = [];
      const userMap = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.followeeId) {
          users.push({
            id: data.followeeId,
            displayName: data.followeeDisplay,
            photoURL: data.followeePhoto || "",
          });
          userMap[data.followeeId] = doc.id;
        }
      });

      setFollowedUsers(users);
      setFollowsMap((prev) => ({ ...prev, ...userMap }));
    };

    const fetchGroupFollows = async () => {
      const snapshot = await db
        .collection("groupfollows")
        .where("userId", "==", currentUser.uid)
        .get();

      const groups = [];
      const groupMap = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        groups.push({
          id: data.groupId,
          title: data.groupTitle,
          imageUrl: data.groupImage,
          description: data.groupDescription || "",
        });
        groupMap[data.groupId] = doc.id;
      });

      setFollowedGroups(groups);
      setFollowsMap((prev) => ({ ...prev, ...groupMap }));
    };

    fetchUserFollows();
    fetchGroupFollows();
  }, [currentUser]);

  const handleUnfollow = async (id) => {
    const followDocId = followsMap[id];
    if (!followDocId) return;

    const isGroup = followedGroups.some((g) => g.id === id);

    try {
      const collectionName = isGroup ? "groupfollows" : "follows";
      await db.collection(collectionName).doc(followDocId).delete();

      if (isGroup) {
        setFollowedGroups((prev) => prev.filter((g) => g.id !== id));
      } else {
        setFollowedUsers((prev) => prev.filter((u) => u.id !== id));
      }

      const updated = { ...followsMap };
      delete updated[id];
      setFollowsMap(updated);
    } catch (error) {
      console.error("Error unfollowing:", error);
    }
  };

  return (
    <div className="following-page">
      <h2 className="following-title">Users You Follow</h2>
      <div className="user-list">
        {followedUsers.length === 0 ? (
          <p>You aren’t following any users yet.</p>
        ) : (
          followedUsers.map((user) => (
            <div key={user.id} className="user-card">
              <Avatar src={user.photoURL}>{user.displayName?.charAt(0)}</Avatar>
              <div className="user-info">
                <h4>{user.displayName}</h4>
              </div>
              <button
                className="follow-button"
                onClick={() => handleUnfollow(user.id)}
              >
                Unfollow
              </button>
            </div>
          ))
        )}
      </div>

      <h2 className="following-title">Spaces You Follow</h2>
      <div className="space-list">
        {followedGroups.length === 0 ? (
          <p>You haven’t followed any spaces yet.</p>
        ) : (
          followedGroups.map((group) => (
            <div key={group.id} className="space-card">
              <div className="space-icon">
                {group.imageUrl ? (
                  <img src={group.imageUrl} alt={group.title} />
                ) : (
                  <span>🌀</span>
                )}
              </div>
              <div className="space-details">
                <h3 className="space-title">{group.title}</h3>
                <p className="space-description">{group.description}</p>
              </div>
              <button
                className="follow-button"
                onClick={() => handleUnfollow(group.id)}
              >
                Unfollow
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Following;
