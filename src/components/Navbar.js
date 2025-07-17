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
import { auth } from "../firebase";
// import db, { auth } from "../firebase";
// import firebase from "firebase/compat/app";
import AddQuePostModal from "./AddQuePostModal";
import { Link } from "react-router-dom";

function Navbar() {
  const user = useSelector(selectUser);
  const [ismodalOpen, setIsModalOpen] = useState(false);
  // const [input, setInput] = useState("");
  // const questionName = input;

  // const handleQuestion = (e) => {
  //   e.preventDefault();
  //   setIsModalOpen(false);

  //   if (questionName) {
  //     db.collection("questions").add({
  //       user: user,
  //       question: input,
  //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //     });
  //   }

  //   setInput("");
  // };

  // const handlePost = (e, imageUrl = "") => {
  //   e.preventDefault();
  //   setIsModalOpen(false);

  //   if (input) {
  //     db.collection("posts").add({
  //       user: user,
  //       post: input,
  //       imageUrl: imageUrl || "",
  //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //     });
  //   }

  //   setInput("");
  // };

  return (
    <div className="navbar">
      <div className="navbar-quora-header-1">
        <div className="navbar-quora-search-1">
          <SearchOutlinedIcon />
          <p>Search</p>
        </div>

        <div className="navbar-quora-logo"></div>

        <div className="navbar-quora-add" onClick={() => setIsModalOpen(true)}>
          <AddCircleOutlineOutlinedIcon />
          <p>Add</p>
        </div>
      </div>

      <div className="navbar-quora-header-2">
          <Link to="/" className="navbar-quora-icon">
            <HomeIcon />
          </Link>
          <Link to="/following" className="navbar-quora-icon">
            <ListAltRoundedIcon />
          </Link>
          <Link to="/answer" className="navbar-quora-icon">
            <AssignmentTurnedInOutlinedIcon />
          </Link>

          <Link to="/groups" className="navbar-quora-icon">
          <GroupsIcon />
          </Link>

          <Link to="/notification" className="navbar-quora-icon">
          <NotificationsNoneOutlinedIcon />
          </Link>

        <div className="navbar-quora-search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search Quora" />
        </div>

        <button className="navbar-quora-try-quora-btn">Try Quora+</button>

        <div className="navbar-quora-avatar navbar-quora-icon">
          <Avatar onClick={() => auth.signOut()} src={user.photo} />
        </div>

          <Link to="/language" className="navbar-quora-icon">
          <LanguageIcon />
          </Link>

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
        />
        {/* <AddQuePostModal
            isOpen={ismodalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            user={user}
            input={input}
            setInput={setInput}
            handleQuestion={handleQuestion}
            handlePost={handlePost}
          /> */}
      </div>
    </div>
  );
}

export default Navbar;
