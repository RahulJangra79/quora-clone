import React from "react";
import "../css/SidebarOptions.css";
import historyImg from "../images/history.png";
import educationImg from "../images/education.jpg";
import businessImg from "../images/business.jpeg";
import cookingImg from "../images/cooking.jpeg";
import foodImg from "../images/food.jpg";
import musicImg from "../images/music.jpeg";
import scienceImg from "../images/science.jpeg";
import { Add } from "@mui/icons-material";

function SidebarOptions() {
  return (
    <div className="sidebar-options">
      <div className="sidebar-option">
        <Add />
        <p>Create Space</p>
      </div>
      <div className="sidebar-option">
        <img src={historyImg} alt="" />
        <p>History</p>
      </div>

      <div className="sidebar-option">
        <img src={educationImg} alt="" />
        <p>Education</p>
      </div>

      <div className="sidebar-option">
        <img src={businessImg} alt="" />
        <p>Business</p>
      </div>

      <div className="sidebar-option">
        <img src={cookingImg} alt="" />
        <p>Cooking</p>
      </div>

      <div className="sidebar-option">
        <img src={musicImg} alt="" />
        <p>Music</p>
      </div>

      <div className="sidebar-option">
        <img src={scienceImg} alt="" />
        <p>Science</p>
      </div>

      <div className="sidebar-option">
        <img src={foodImg} alt="" />
        <p>Food</p>
      </div>
    </div>
  );
}

export default SidebarOptions;
