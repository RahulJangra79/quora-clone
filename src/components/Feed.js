import React, { useEffect, useState } from "react";
import "../css/Feed.css";
import QuoraBox from "./QuoraBox";
import Post from "./Post";
import db from "../firebase";
import { getAuth } from "firebase/auth";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [hiddenPosts, setHiddenPosts] = useState([]);

  useEffect(() => {
    const fetchHiddenPosts = async () => {
      const auth = getAuth();
      
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = db.collection("users").doc(currentUser.uid);
      const docSnap = await userRef.get();
      if (docSnap.exists) {
        const data = docSnap.data();
        setHiddenPosts(data.hiddenPosts || []);
      }
    };

    fetchHiddenPosts();
  }, []);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const firebaseData = snapshot.docs.map((doc) => ({
          id: doc.id,
          posts: doc.data(),
        }));

        setPosts(firebaseData);
      });
  }, []);

  return (
    <div className="feed">
      <QuoraBox />

      {posts
        .filter(({ id }) => !hiddenPosts.includes(id))
        .map(({ id, posts }) => (
          <Post
            key={id}
            id={id}
            post={posts.post}
            imageUrl={posts.imageUrl}
            timestamp={posts.timestamp}
            user={posts.user}
          />
        ))}
    </div>
  );
}

export default Feed;
