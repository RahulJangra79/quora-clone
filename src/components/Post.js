import "../css/Post.css";
import Avatar from "@mui/material/Avatar";
import {
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  ChatBubbleOutlineOutlined,
  RepeatOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";

function Post({ id, post, imageUrl, timestamp, user }) {
  return (
    <div className="post">
      <div className="post-info">
        <div className="post-info-avatar">
          <Avatar src={user.photo} />
        </div>

        <div className="post-info-detail">
          <div className="post-info-detail-1">
            <h5> {user.display} </h5>
            <small>Follow</small>
          </div>
          <div className="post-info-detail-2">
            <p>
            {new Date(timestamp?.toDate()).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </p>
          </div>
        </div>
      </div>

      <div className="post-body">
        <div className="post-que">
          <p>{post}</p>
        </div>
        <img src={imageUrl} alt="" />
      </div>
      <div className="post-footer">
        <div className="post-footer-left">
          <button className="post-footer-left-1">
            <ArrowUpwardOutlined />
            Upvote &nbsp;·&nbsp; {"335"}

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
