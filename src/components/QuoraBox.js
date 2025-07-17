import React, { useState } from "react";
import "../css/QuoraBox.css";
import Avatar from "@mui/material/Avatar";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import AddQuePostModal from "./AddQuePostModal";
import { Link } from "react-router-dom";

function QuoraBox() {
  const user = useSelector(selectUser);
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("question");

  return (
    <div className="quora-box">
      <div className="quora-box-info">
        <Avatar src={user.photo} />
        <input
          type="text"
          readOnly
          placeholder="What do you want to ask or share?"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <div className="quora-box-options">
        <button
          className="quora-box-option"
          onClick={() => {
            setActiveTab("question");
            setIsModalOpen(true);
          }}
        >
          <LiveHelpOutlinedIcon />
          <p>Ask</p>
        </button>

        <p className="quora-box-option-pipe">|</p>

        <Link to="/answer" className="quora-box-option">
          <AssignmentTurnedInOutlinedIcon />
          <p>Answer</p>
        </Link>

        <p className="quora-box-option-pipe">|</p>

        <button
          className="quora-box-option"
          onClick={() => {
            setActiveTab("post");
            setIsModalOpen(true);
          }}
        >
          <EditOutlinedIcon />
          <p>Post</p>
        </button>
      </div>
      <AddQuePostModal
        isOpen={ismodalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        user={user}
        activeTab={activeTab}
      />
    </div>
  );
}

export default QuoraBox;
