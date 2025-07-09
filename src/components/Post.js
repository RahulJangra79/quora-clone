import React from "react";
import "../css/Post.css";
import Avatar from "@mui/material/Avatar";
import {
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  ChatBubbleOutlineOutlined,
  RepeatOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import Image from "../images/history.png";

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
          <p>
            Question nidjcs ciunsd csdcnsdc sdjcsd fdc d efe fodnfd woifn fwfwf
            wfw fwfwfwfwe fewfwf wqefwef we fwrf wfwf wrf wr ?
          </p>
          <button className="post-que-ans">Answer</button>
        </div>
        <div className="post-ans">
          <p></p>
        </div>
        <img src={Image} alt="" />
      </div>
      <div className="post-footer">
        <div className="post-footer-left">
          <button className="post-footer-left-1">
            <ArrowUpwardOutlined />
            Upvote . {"335"}
          </button>

          <button className="post-footer-left-2">
            <ArrowDownwardOutlined />
          </button>
        </div>

        <div className="post-footer-middle">
          <div className="post-footer-middle-1">
            <RepeatOutlined /> {"37"}
          </div>
          <div className="post-footer-middle-1">
            <ChatBubbleOutlineOutlined /> {"4"}
          </div>
        </div>

        <div className="post-footer-right">
          <MoreHorizOutlined />
        </div>
      </div>
    </div>
  );
}

export default Post;
