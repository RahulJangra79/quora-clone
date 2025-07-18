import React, { useEffect, useState } from "react";
import "../css/Feed.css";
import QuoraBox from "./QuoraBox";
import Post from "./Post";
import db from "../firebase";

function Feed() {
  const [posts, setPosts] = useState([]);

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

      {posts.map(({ id, posts }) => (
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
