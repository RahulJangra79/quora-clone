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
import { useNavigate } from "react-router-dom";

function Navbar() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [ismodalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isQuoraPlusModalOpen, setIsQuoraPlusModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [showPostDropdown, setShowPostDropdown] = useState(false);

  const [showSearchBarTop, setShowSearchBarTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({
    questions: [],
    answers: [],
    spaces: [],
    users: [],
    posts: [],
  });
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const avatarDropdownRef = useRef(null);
  const [isQuoraPlusUser, setIsQuoraPlusUser] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setSearchTerm("");
        setShowSearchBarTop(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({
        questions: [],
        answers: [],
        spaces: [],
        users: [],
        posts: [],
      });
      return;
    }

    const runSearch = async () => {
      try {
        const lowerTerm = searchTerm.toLowerCase();

        const [questionsSnap, answersSnap, spacesSnap, usersSnap, postsSnap] =
          await Promise.all([
            db
              .collection("questions")
              .where("keywords", "array-contains", lowerTerm)
              .limit(5)
              .get(),

            db
              .collection("answers")
              .where("keywords", "array-contains", lowerTerm)
              .limit(5)
              .get(),

            db
              .collection("spaces")
              .where("titleLower", ">=", lowerTerm)
              .where("titleLower", "<=", lowerTerm + "\uf8ff")
              .limit(5)
              .get(),

            db
              .collection("users")
              .where("name", ">=", lowerTerm)
              .where("name", "<=", lowerTerm + "\uf8ff")
              .limit(5)
              .get(),

            db
              .collection("posts")
              .where("keywords", "array-contains", lowerTerm)
              .limit(5)
              .get(),
          ]);

        setSearchResults({
          questions: questionsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          answers: answersSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          spaces: spacesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          users: usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          posts: postsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        });
      } catch (error) {
        console.error("Error during search:", error);
      }
    };

    runSearch();
  }, [searchTerm]);

  useEffect(() => {
    if (showTranslator) {
      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,bn,ta,te,mr,gu,kn,ml,pa,ur,as,or,sa",
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
        <div
          className="navbar-quora-search-1"
          onClick={() => setShowSearchBarTop(true)}
        >
          <SearchOutlinedIcon />
          <p>Search</p>
        </div>
        {showSearchBarTop && (
          <div className="search-bar-top">
            <input
              type="text"
              placeholder="Search Quora"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button onClick={() => setShowSearchBarTop(false)}>Close</button>
          </div>
        )}

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
          <input
            type="text"
            placeholder="Search Quora"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && (
          <div className="search-overlay">
            <div className="search-results-box" ref={containerRef}>
              {searchResults.questions.map((q) => (
                <p
                  key={q.id}
                  onClick={() => {
                    navigate(`/question/${q.id}`);
                    setShowSearchBarTop(false);
                    setSearchTerm("");
                  }}
                >
                  🟦 Question: {q.question}
                </p>
              ))}

              {searchResults.answers.map((a) => (
                <p
                  key={a.id}
                  onClick={() => {
                    navigate(`/question/${a.questionId}`);
                    setShowSearchBarTop(false);
                    setSearchTerm("");
                  }}
                >
                  🟨 Answer: {a.answer}
                </p>
              ))}

              {searchResults.spaces.map((s) => (
                <p
                  key={s.id}
                  onClick={() => {
                    navigate(`/group/${s.id}`);
                    setShowSearchBarTop(false);
                    setSearchTerm("");
                  }}
                >
                  🟪 Space: {s.title}
                </p>
              ))}

              {searchResults.users.map((u) => (
                <p
                  key={u.uid}
                  onClick={() => {
                    navigate(`/user/${u.uid}`);
                    setShowSearchBarTop(false);
                    setSearchTerm("");
                  }}
                >
                  🟧 User: {u.name}
                </p>
              ))}

              {searchResults.posts.map((p) => (
                <p
                  key={p.id}
                  onClick={() => {
                    navigate(`/post/${p.id}`);
                    setShowSearchBarTop(false);
                    setSearchTerm("");
                  }}
                >
                  🟥 Post: {p.text || p.post}
                </p>
              ))}
            </div>
          </div>
        )}

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
                <li>
                  <Link
                    className="avatar-dropdown-link"
                    to={`/user/${user?.uid}`}
                    onClick={() => setIsAvatarDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="avatar-dropdown-link"
                    to={`/bookmarks/${user?.uid}`}
                    onClick={() => setIsAvatarDropdownOpen(false)}
                  >
                    Bookmarks
                  </Link>
                </li>
                {!isQuoraPlusUser ? (
                  <li
                    onClick={() => {
                      setIsQuoraPlusModalOpen(true);
                      setIsAvatarDropdownOpen(false);
                    }}
                  >
                    Try Quora+
                  </li>
                ) : (
                  <li
                    onClick={() => {
                      setIsQuoraPlusModalOpen(true);
                      setIsAvatarDropdownOpen(false);
                    }}
                  >
                    Quora+
                  </li>
                )}
                <li onClick={() => setShowTranslator(true)}>Languages</li>
                <li>
                  <Link
                    className="avatar-dropdown-link"
                    to="/help"
                    onClick={() => setIsAvatarDropdownOpen(false)}
                  >
                    Help
                  </Link>
                </li>{" "}
                <li onClick={() => auth.signOut()} className="logout">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        <div
          className="navbar-quora-icon navbar-language-icon"
          onClick={() => setShowTranslator(true)}
        >
          <LanguageIcon />
        </div>
        {showTranslator && (
          <div className="google-translate-popup">
            <div id="google_translate_element"></div>
            <button onClick={() => setShowTranslator(false)}>x</button>
          </div>
        )}

        <div className="navbar-quora-question-button">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setActiveTab("question");
            }}
            className="navbar-quora-question-btn"
          >
            Add Question
          </button>

          <div
            onClick={() => setShowPostDropdown((prev) => !prev)}
            className="navbar-quora-arrow"
          >
            <KeyboardArrowDownIcon />
          </div>

          {showPostDropdown && (
            <div className="navbar-quora-post-dropdown">
              <p
                onClick={() => {
                  setIsModalOpen(true);
                  setActiveTab("post");
                  setShowPostDropdown(false);
                }}
              >
                Post
              </p>
            </div>
          )}
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
