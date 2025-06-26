import React from "react";
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
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-quora-header-1">
        <div className="navbar-quora-search-1">
          <SearchOutlinedIcon />
          <p>Search</p>
        </div>

        <div className="navbar-quora-logo">
          
        </div>

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
          <Avatar />
        </div>

        <div className="navbar-quora-icon">
          <LanguageIcon />
        </div>

        <div className="navbar-quora-question-button">
          <button className="navbar-quora-question-btn">Add Question</button>
          <KeyboardArrowDownIcon />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
