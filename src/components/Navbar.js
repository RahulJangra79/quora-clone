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
import AddQuePostModal from "./AddQuePostModal";
import { Link } from "react-router-dom";

function Navbar() {
  const user = useSelector(selectUser);
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

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
        <Link
          to="/"
          className={`navbar-quora-icon ${
            activeTab === "home" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("home")}
        >
          <HomeIcon />
        </Link>
        <Link
          to="/following"
          className={`navbar-quora-icon ${
            activeTab === "following" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("following")}
        >
          <ListAltRoundedIcon />
        </Link>
        <Link
          to="/answer"
          className={`navbar-quora-icon ${
            activeTab === "answer" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("answer")}
        >
          <AssignmentTurnedInOutlinedIcon />
        </Link>

        <Link
          to="/groups"
          className={`navbar-quora-icon ${
            activeTab === "groups" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("groups")}
        >
          <GroupsIcon />
        </Link>

        <Link
          to="/notification"
          className={`navbar-quora-icon ${
            activeTab === "notification" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("notification")}
        >
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
        />
      </div>
    </div>
  );
}

export default Navbar;
