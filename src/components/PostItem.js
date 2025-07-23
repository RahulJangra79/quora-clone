import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../firebase";
import Post from "./Post";

const PostItem = () => {
  const { postId } = useParams();
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const doc = await db.collection("posts").doc(postId).get();
        if (doc.exists) {
          setPostData({ id: doc.id, ...doc.data() });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!postData) return <div>Loading post...</div>;

  return (
    <Post
      id={postData.id}
      post={postData.post}
      imageUrl={postData.imageUrl}
      timestamp={postData.timestamp}
      user={postData.user}
    />
  );
};

export default PostItem;
