import React from "react";
import "../css/Feed.css";
import QuoraBox from "./QuoraBox";
import Post from "./Post";

function Feed() {
  return (
    <div className="feed">
      <QuoraBox />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
    </div>
  );
}

export default Feed;
