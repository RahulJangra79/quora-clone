import { useState, useRef, useEffect } from "react";
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
import { doc, getDoc } from "firebase/firestore";
import AddQuePostModal from "./AddQuePostModal";
import QuoraPlusModal from "./QuoraPlusModal";
import QuoraPlusStatusModal from "./QuoraPlusStatusModal";
import { Link } from "react-router-dom";

function Navbar() {
  const user = useSelector(selectUser);
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [isQuoraPlusModalOpen, setIsQuoraPlusModalOpen] = useState(false);
  const [showLangList, setShowLangList] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const avatarDropdownRef = useRef(null);
  const [isQuoraPlusUser, setIsQuoraPlusUser] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);

  useEffect(() => {
    if (showTranslator) {
      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi",
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            "google_translate_element"
          );
        };
      }

      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [showTranslator]);

  useEffect(() => {
    const checkQuoraPlusStatus = async () => {
      if (!user?.uid) return;

      const snapshot = await getDoc(doc(db, "users", user.uid));
      if (!snapshot.exists()) return;

      const data = snapshot.data();
      const { isQuoraPlus, subscriptionDate, subscriptionPlan } = data;

      if (!isQuoraPlus || !subscriptionDate || !subscriptionPlan) {
        setIsQuoraPlusUser(false);
        return;
      }

      const now = new Date();
      const subscribedOn = new Date(subscriptionDate);
      const expiry = new Date(subscribedOn);

      expiry.setDate(
        expiry.getDate() + (subscriptionPlan === "monthly" ? 30 : 365)
      );

      setIsQuoraPlusUser(expiry > now);
    };

    checkQuoraPlusStatus();
  }, [user?.uid]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }

      if (
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target)
      ) {
        setIsAvatarDropdownOpen(false);
      }
    }

    if (isLangDropdownOpen || isAvatarDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isLangDropdownOpen, isAvatarDropdownOpen]);

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

        {!isQuoraPlusUser ? (
          <button
            className="navbar-quora-try-quora-btn"
            onClick={() => setIsQuoraPlusModalOpen(true)}
          >
            Try Quora+
          </button>
        ) : (
          <button
            className="navbar-quora-try-quora-btn quora-plus-active"
            onClick={() => setShowStatusModal(true)}
          >
            Quora+
          </button>
        )}

        <div className="navbar-quora-avatar navbar-quora-icon">
          <Avatar
            onClick={() => setIsAvatarDropdownOpen((prev) => !prev)}
            src={user.photo}
          >
            {user.display?.charAt(0)}
          </Avatar>

          {isAvatarDropdownOpen && (
            <div ref={avatarDropdownRef} className="avatar-dropdown">
              <Avatar src={user.photo}>{user.display?.charAt(0)}</Avatar>
              <p className="dropdown-user-name">{user?.display}</p>
              <hr />
              <ul className="avatar-dropdown-list">
                <li>Messages</li>
                <li>Monetization</li>
                <li>Your content & stats</li>
                <li>Bookmarks</li>
                {!isQuoraPlusUser ? (
                  <li onClick={() => setIsQuoraPlusModalOpen(true)}>
                    Try Quora+
                  </li>
                ) : (
                  <li onClick={() => setShowStatusModal(true)}>Quora+</li>
                )}
                <li>Settings</li>
                <li
                  onClick={() => setShowLangList((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                >
                  Languages
                  <span style={{ float: "right" }}>
                    {showLangList ? "▲" : "▼"}
                  </span>
                  {showLangList && (
                    <ul className="language-sublist">
                      <li
                        className={activeLanguage === "en" ? "selected" : ""}
                        onClick={() => setActiveLanguage("en")}
                      >
                        English
                        {activeLanguage === "en" && (
                          <span className="checkmark">✔</span>
                        )}
                      </li>
                      <li
                        className={activeLanguage === "hi" ? "selected" : ""}
                        onClick={() => {
                          setActiveLanguage("hi");
                          setShowTranslator(true);
                        }}
                      >
                        हिन्दी
                        {activeLanguage === "hi" && (
                          <span className="checkmark">✔</span>
                        )}
                      </li>
                    </ul>
                  )}
                </li>

                <li>Help</li>
                <li onClick={() => auth.signOut()} className="logout">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        <div
          className="navbar-quora-icon navbar-language-icon"
          onClick={() => setIsLangDropdownOpen((prev) => !prev)}
        >
          <LanguageIcon />
          {isLangDropdownOpen && (
            <div ref={dropdownRef} className="language-dropdown">
              <h4>Languages</h4>
              <ul>
                <li
                  className={activeLanguage === "en" ? "selected" : ""}
                  onClick={() => {
                    setActiveLanguage("en");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span className="dot blue"></span> English{" "}
                  {activeLanguage === "en" && (
                    <span className="checkmark">✔</span>
                  )}
                </li>
                <li
                  className={activeLanguage === "hi" ? "selected" : ""}
                  onClick={() => {
                    setActiveLanguage("hi");
                    setShowTranslator(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <span className="dot green"></span> हिन्दी
                  {activeLanguage === "hi" && (
                    <span className="checkmark">✔</span>
                  )}
                </li>
              </ul>
            </div>
          )}

          {showTranslator && (
            <div className="google-translate-popup">
              <div id="google_translate_element"></div>
              <button onClick={() => setShowTranslator(false)}>Close</button>
            </div>
          )}
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

        <QuoraPlusModal
          isOpen={isQuoraPlusModalOpen}
          onClose={() => setIsQuoraPlusModalOpen(false)}
          user={user}
        />

        <QuoraPlusStatusModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          user={user}
        />
      </div>
    </div>
  );
}

export default Navbar;
