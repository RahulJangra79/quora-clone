import "../css/SidebarOptions.css";
import { useEffect, useState } from "react";
import db from "../firebase";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CreateSpaceModal from "./CreateSpaceModal";

function SidebarOptions() {
  const [singleWordSpaces, setSingleWordSpaces] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const unsubscribe = db
  //     .collection("spaces")
  //     .orderBy("createdAt", "desc")
  //     .limit(20)
  //     .onSnapshot((snapshot) => {
  //       const filtered = snapshot.docs
  //         .map((doc) => ({ id: doc.id, ...doc.data() }))
  //         .filter(
  //           (space) =>
  //             space.title &&
  //             typeof space.title === "string" &&
  //             space.title.trim().split(/\s+/).length === 1
  //         );
  //       setSingleWordSpaces(filtered);
  //     });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection("spaces")
      .orderBy("createdAt", "desc")
      .limit(25) // fetch more for buffer
      .onSnapshot((snapshot) => {
        const filtered = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (space) =>
              space.title &&
              typeof space.title === "string" &&
              space.title.trim().split(/\s+/).length === 1
          )
          .slice(0, 7); // take first 7 matching single-word titles

        setSingleWordSpaces(filtered);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div className="sidebar-options">
      <button
        className="sidebar-create-space-btn"
        onClick={() => setShowModal(true)}
      >
        <Add />
        Create Space
      </button>

      {singleWordSpaces.map((space) => (
        <div
          key={space.id}
          className="sidebar-option"
          onClick={() => navigate(`/groups/${space.id}`)}
        >
          <img src={space.imageUrl} alt={space.title} />
          <p>{space.title}</p>
        </div>
      ))}

      {showModal && <CreateSpaceModal closeModal={() => setShowModal(false)} />}
    </div>
  );
}

export default SidebarOptions;
