import React from "react";
import "../css/WidgetContent.css";
import { useEffect, useState } from "react";
import db from "../firebase";
import { Link, useNavigate } from "react-router-dom";

function WidgetContent() {
  const [spaces, setSpaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db
      .collection("spaces")
      .orderBy("createdAt", "desc")
      .limit(9)
      .onSnapshot((snapshot) => {
        const fetchedSpaces = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSpaces(fetchedSpaces);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div className="widget__contents">
      {spaces.map((space) => (
        <div
          key={space.id}
          className="widget__content"
          onClick={() => navigate(`/group/${space.id}`)}
        >
          <img src={space.imageUrl} alt={space.title} />
          <div className="widget__contentTitle">
            <h5>{space.title}</h5>
            <p>{space.description?.slice(0, 50) || "No description..."}</p>
          </div>
        </div>
      ))}
      <button className="widgets__view__more__btn">
        <Link to="/groups" className="widgets__view__more">
          View More{" "}
        </Link>
      </button>
    </div>
  );
}

export default WidgetContent;
