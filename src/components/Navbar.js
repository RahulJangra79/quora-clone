import { useState } from "react";
import "../css/Navbar.css";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Avatar from "@mui/material/Avatar";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import db, { auth } from "../firebase";
import firebase from "firebase/compat/app";
import AddQuePostModal from "./AddQuePostModal";

function Navbar() {
  const user = useSelector(selectUser);
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const questionName = input;

  const handleQuestion = (e) => {
    e.preventDefault();
    setIsModalOpen(false);

    if (questionName) {
      db.collection("questions").add({
        user: user,
        question: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    setInput("");
  };

  const handlePost = (e, imageUrl = "") => {
    e.preventDefault();
    setIsModalOpen(false);

    if (input) {
      db.collection("posts").add({
        user: user,
        post: input,
        imageUrl: imageUrl || "",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    setInput("");
  };

  return (
    <div className="navbar">
      <div className="navbar-quora-header-1">
        <div className="navbar-quora-search-1">
          <SearchOutlinedIcon />
          <p>Search</p>
        </div>

        <div className="navbar-quora-logo"></div>

        <div className="navbar-quora-add">
          <AddCircleOutlineOutlinedIcon />
          <p>Add</p>
        </div>
      </div>

      <div className="navbar-quora-header-2">
        <div className="navbar-quora-icon">
          <HomeIcon />
        </div>
        <div className="navbar-quora-icon">
          <ListAltRoundedIcon />
        </div>
        <div className="navbar-quora-icon">
          <AssignmentTurnedInOutlinedIcon />
        </div>
        <div className="navbar-quora-icon">
          <GroupsIcon />
        </div>
        <div className="navbar-quora-icon">
          <NotificationsNoneOutlinedIcon />
        </div>

        <div className="navbar-quora-search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search Quora" />
        </div>

        <button className="navbar-quora-try-quora-btn">Try Quora+</button>

        <div className="navbar-quora-avatar navbar-quora-icon">
          <Avatar onClick={() => auth.signOut()} src={user.photo} />
        </div>

        <div className="navbar-quora-icon">
          <LanguageIcon />
        </div>

        <div className="navbar-quora-question-button">
          <button
            onClick={() => setIsModalOpen(true)}
            className="navbar-quora-question-btn"
          >
            Add Question
          </button>
          <KeyboardArrowDownIcon />
        </div>

        <AddQuePostModal
            isOpen={ismodalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            user={user}
            input={input}
            setInput={setInput}
            handleQuestion={handleQuestion}
            handlePost={handlePost}
          />
      </div>
    </div>
  );
}

export default Navbar;
