import React from "react";
import "../css/QuoraBox.css";
import Avatar from "@mui/material/Avatar";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

function QuoraBox() {
  const user = useSelector(selectUser);

  return (
    <div className="quora-box">
      <div className="quora-box-info">
        <Avatar src={user.photo} />
        <input type="text" placeholder="What do you want to ask or share?" />
      </div>

      <div className="quora-box-options">
        <button className="quora-box-option">
          <LiveHelpOutlinedIcon />
          <p>Ask</p>
        </button>

        <p className="quora-box-option-pipe">|</p>

        <button className="quora-box-option">
          <AssignmentTurnedInOutlinedIcon />
          <p>Answer</p>
        </button>

        <p className="quora-box-option-pipe">|</p>

        <button className="quora-box-option">
          <EditOutlinedIcon />
          <p>Post</p>
        </button>
      </div>
    </div>
  );
}

export default QuoraBox;
