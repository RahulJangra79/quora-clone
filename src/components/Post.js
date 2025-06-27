import React from "react";
import "../css/Post.css";
import Avatar from "@mui/material/Avatar";
import { ArrowUpwardOutlined, ArrowDownwardOutlined, ChatBubbleOutlineOutlined, RepeatOutlined, ShareOutlined, MoreHorizOutlined } from "@mui/icons-material";
import Image from '../images/history.png';


function Post() {
  return (
    <div className="post">
      <div className="post-info">
        <Avatar />
        <h5>Username </h5>
        <small>Timestamp</small>
      </div>

      <div className="post-body">
        <div className="post-que">
          <p>Question</p>
          <button className="post-que-ans">Answer</button>
        </div>
        <div className="post-ans">
          <p></p>
        </div>
        <img
          src={Image}
          alt=""
        />
      </div>
      <div className="post-footer">
        <div className="post-footer-action">
          <ArrowUpwardOutlined />
          <ArrowDownwardOutlined />
        </div>
        
        <RepeatOutlined />
        <ChatBubbleOutlineOutlined />

        <div className="post-footer-left">
          <ShareOutlined />
          <MoreHorizOutlined />
        </div>
      </div>
    </div>
  );
}

export default Post;
