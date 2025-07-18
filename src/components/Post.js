import "../css/Post.css";
import Avatar from "@mui/material/Avatar";
import {
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  ChatBubbleOutlineOutlined,
  RepeatOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import db from "../firebase";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Post({ id, post, imageUrl, timestamp, user }) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [upvoteCount, setUpvoteCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followDocId, setFollowDocId] = useState(null);

  // Load post data on mount
  useEffect(() => {
    const fetchPostData = async () => {
      const postRef = db.collection("posts").doc(id);
      const postDoc = await postRef.get();
      const data = postDoc.data();

      setUpvoteCount(data?.votes?.upvoteCount || 0);
      setShareCount(data?.shareCount || 0);
    };

    fetchPostData();
    fetchComments();
  }, [id]);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!currentUser || currentUser.uid === user?.uid) return;

      const snapshot = await db
        .collection("follows")
        .where("followerId", "==", currentUser.uid)
        .where("followeeId", "==", user.uid)
        .get();

      if (!snapshot.empty) {
        setIsFollowing(true);
        setFollowDocId(snapshot.docs[0].id);
      } else {
        setIsFollowing(false);
        setFollowDocId(null);
      }
    };

    fetchFollowStatus();
  }, [user?.uid, currentUser]);

  const handleToggleFollow = async () => {
    if (!currentUser || currentUser.uid === user?.uid) return;

    try {
      if (isFollowing && followDocId) {
        await db.collection("follows").doc(followDocId).delete();
        setIsFollowing(false);
        setFollowDocId(null);
      } else {
        const docRef = await db.collection("follows").add({
          followerId: currentUser.uid,
          followeeId: user.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setIsFollowing(true);
        setFollowDocId(docRef.id);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const fetchComments = async () => {
    const snapshot = await db
      .collection("comments")
      .where("postId", "==", id)
      .orderBy("timestamp", "asc")
      .get();

    const loadedComments = snapshot.docs.map((doc) => doc.data());
    setComments(loadedComments);
    setCommentCount(snapshot.size);
  };

  const handleVote = async (type) => {
    if (!currentUser) return;

    const postRef = db.collection("posts").doc(id);
    const postDoc = await postRef.get();
    const postData = postDoc.data();

    const userVotes = postData.votes?.userVotes || {};
    const previousVote = userVotes[currentUser.uid];

    let upvotes = postData.votes?.upvoteCount || 0;
    let downvotes = postData.votes?.downvoteCount || 0;

    if (type === "up") {
      if (previousVote === "down") downvotes--;
      if (previousVote !== "up") upvotes++;
      userVotes[currentUser.uid] = "up";
    } else if (type === "down") {
      if (previousVote === "up") upvotes--;
      if (previousVote !== "down") downvotes++;
      userVotes[currentUser.uid] = "down";
    }

    await postRef.update({
      votes: {
        upvoteCount: upvotes,
        downvoteCount: downvotes,
        userVotes,
      },
    });

    setUpvoteCount(upvotes);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !currentUser) return;

    await db.collection("comments").add({
      postId: id,
      comment: newComment.trim(),
      user: {
        uid: currentUser.uid,
        photo: currentUser.photoURL,
        display: currentUser.displayName,
      },
      timestamp: new Date(),
    });

    setNewComment("");
    fetchComments();
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(link);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Post link copied!",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

    const postRef = db.collection("posts").doc(id);
    await postRef.update({
      shareCount: shareCount + 1,
    });

    setShareCount((prev) => prev + 1);
  };

  return (
    <div className="post">
      <div className="post-info">
        <div className="post-info-avatar">
          <Avatar src={user.photo} />
        </div>
        <div className="post-info-detail">
          <div className="post-info-detail-1">
            <h5>{user.display}</h5>
            {currentUser?.uid !== user.uid && (
              <button className="post-follow-btn" onClick={handleToggleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
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
        {imageUrl && <img src={imageUrl} alt="Post" />}
      </div>

      <div className="post-footer">
        <div className="post-footer-left">
          <button
            className="post-footer-left-1"
            onClick={() => handleVote("up")}
          >
            <ArrowUpwardOutlined />
            Upvote · {upvoteCount}
          </button>
          <button
            className="post-footer-left-2"
            onClick={() => handleVote("down")}
          >
            <ArrowDownwardOutlined />
          </button>
        </div>

        <div className="post-footer-middle">
          <div className="post-footer-middle-1" onClick={handleShare}>
            <RepeatOutlined /> {shareCount}
          </div>
          <div
            className="post-footer-middle-1"
            onClick={() => setShowComments((prev) => !prev)}
          >
            <ChatBubbleOutlineOutlined /> {commentCount}
          </div>
        </div>

        <div className="post-footer-right">
          <MoreHorizOutlined />
        </div>
      </div>

      {showComments && (
        <div className="comment-section">
          <div className="comment-input">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>Post</button>
          </div>
          <div className="comments-list">
            {comments.map((c, index) => (
              <div key={index} className="single-comment">
                <Avatar src={c.user?.photo} />
                <div>
                  <p>
                    <strong>{c.user?.display}</strong>
                  </p>
                  <p>{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
