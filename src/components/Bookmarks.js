import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase";
import { useNavigate } from "react-router-dom";
import "../css/Bookmarks.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const Bookmarks = () => {
  const user = useSelector(selectUser);
  const uid = user?.uid;
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) return;

    const fetchBookmarks = async () => {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.warn("User document not found!");
          return;
        }

        const rawBookmarks = userSnap.data().bookmarks || [];

        const fetchItem = async (item) => {
          const ref = doc(db, item.type === "post" ? "posts" : "questions", item.id);
          const snap = await getDoc(ref);
          return snap.exists()
            ? { id: item.id, type: item.type, ...snap.data() }
            : null;
        };

        const results = await Promise.all(rawBookmarks.map(fetchItem));
        setBookmarkedItems(results.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [uid]);

  if (loading) return <div className="loader">Loading bookmarks...</div>;

  return (
    <div className="bookmark">
      <div className="bookmark-container">
        <h2 className="bookmark-title">Your Bookmarks</h2>
        {bookmarkedItems.length === 0 ? (
          <p className="bookmark-empty">No bookmarks found.</p>
        ) : (
          <ul className="bookmark-list">
            {bookmarkedItems.map((item) => (
              <li
                key={item.id}
                className="bookmark-item"
                onClick={() => navigate(`/${item.type}/${item.id}`)}
              >
                <strong>{item.type === "question" ? "Question" : "Post"}:</strong>{" "}
                {item.question || item.post || item.text || "[No preview]"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
