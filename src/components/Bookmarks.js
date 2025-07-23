import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import db from '../firebase';
import '../css/Bookmarks.css';

const Bookmarks = ({ uid }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setBookmarks(data.bookmarks || []);
        } else {
          console.warn('No such user document!');
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [uid]);

  if (loading) return <div className="loader">Loading bookmarks...</div>;

  return (
    <div className='bookmark'>
        <div className="bookmark-container">
      <h2 className="bookmark-title">Your Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p className="bookmark-empty">No bookmarks found.</p>
      ) : (
        <ul className="bookmark-list">
          {bookmarks.map((id) => (
            <li key={id} className="bookmark-item">
              {id}
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default Bookmarks;
