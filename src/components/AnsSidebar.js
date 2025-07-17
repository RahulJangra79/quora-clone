import "../css/AnsSidebar.css";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DraftsIcon from "@mui/icons-material/Drafts";

const AnsSidebar = ({ activeTab, setActiveTab }) => {

  return (
    <div className="sidebar-dashboard">
      <div className="sidebar-header">Questions</div>
      <div className="sidebar-tabs">
        <div
          className={`tab-item ${activeTab === "questions" ? "active" : ""}`}
          onClick={() => setActiveTab("questions")}
        >
          <HelpOutlineIcon />
          <span>Questions for You</span>
        </div>
        <div
          className={`tab-item ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          <AssignmentTurnedInOutlinedIcon />
          <span>Answer Requests</span>
        </div>
        <div
          className={`tab-item ${activeTab === "drafts" ? "active" : ""}`}
          onClick={() => setActiveTab("drafts")}
        >
          <DraftsIcon />
          <span>Drafts</span>
        </div>
      </div>
    </div>
  );
};

export default AnsSidebar;
