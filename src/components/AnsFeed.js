import { useEffect, useRef, useState } from "react";
import "../css/AnsFeed.css";
import { MoreHorizOutlined } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import AnswerModal from "./AnsModal";
import { useNavigate } from "react-router-dom";
import db, { auth } from "../firebase";
import firebase from "firebase/compat/app";
import Swal from "sweetalert2";

function AnsFeed({ activeTab }) {
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [followMap, setFollowMap] = useState({});
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const dropdownRef = useRef(null);
  const [hiddenQuestions, setHiddenQuestions] = useState([]);

  useEffect(() => {
    const fetchHiddenQuestions = async () => {
      if (!currentUser) return;
      const userDoc = await db.collection("users").doc(currentUser.uid).get();
      const userData = userDoc.data();
      if (userData?.hiddenQuestions) {
        setHiddenQuestions(userData.hiddenQuestions);
      }
    };

    fetchHiddenQuestions();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBookmark = async (id) => {
    if (!currentUser) return;

    const bookmarkItem = {
        id,
        type: "question",
      };

    await db
      .collection("users")
      .doc(currentUser.uid)
      .set(
        {
          bookmarks: firebase.firestore.FieldValue.arrayUnion(bookmarkItem),
        },
        { merge: true }
      );

    Swal.fire("Bookmarked!", "Saved for later.", "success");
    setActiveDropdownId(null);
  };

  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(link);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Link copied!",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    setActiveDropdownId(null);
  };

  const handleNotInterested = async (questionId) => {
    if (!currentUser) return;

    await db
      .collection("users")
      .doc(currentUser.uid)
      .set(
        {
          hiddenQuestions: firebase.firestore.FieldValue.arrayUnion(questionId),
        },
        { merge: true }
      );

    setHiddenQuestions((prev) => [...prev, questionId]); // update local state
    Swal.fire("Got it!", "This question will be hidden.", "info");
    setActiveDropdownId(null);
  };

  const handleOpenModal = (id) => {
    setSelectedQuestionId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const fetchFollowMap = async () => {
    if (!currentUser) return;
    const snapshot = await db
      .collection("follows")
      .where("followerId", "==", currentUser.uid)
      .get();

    const map = {};
    snapshot.docs.forEach((doc) => {
      const { followeeId } = doc.data();
      map[followeeId] = doc.id;
    });
    setFollowMap(map);
  };

  const handleFollowToggle = async (followeeId) => {
    if (!currentUser || currentUser.uid === followeeId) return;
    try {
      if (followMap[followeeId]) {
        await db.collection("follows").doc(followMap[followeeId]).delete();
        const updated = { ...followMap };
        delete updated[followeeId];
        setFollowMap(updated);
      } else {
        const docRef = await db.collection("follows").add({
          followerId: currentUser.uid,
          followeeId,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setFollowMap({ ...followMap, [followeeId]: docRef.id });
      }
    } catch (err) {
      console.error("Follow toggle failed:", err);
    }
  };

  useEffect(() => {
    const unsubQ = db
      .collection("questions")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const docs = snap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setQuestions(docs);
      });
    return () => unsubQ();
  }, []);

  useEffect(() => {
    const unsubA = db.collection("answers").onSnapshot((snap) => {
      const counts = {};
      snap.docs.forEach((doc) => {
        const qId = doc.data().questionId;
        counts[qId] = (counts[qId] || 0) + 1;
      });
      setQuestions((prev) =>
        prev.map((q) => ({
          ...q,
          data: { ...q.data, answers: counts[q.id] || 0 },
        }))
      );
    });
    return () => unsubA();
  }, []);

  useEffect(() => {
    fetchFollowMap();
  }, [questions]);

  return (
    <div className="ans-feed">
      <h3 className="ans-feed-header">
        {activeTab === "questions"
          ? "Questions for You"
          : activeTab === "requests"
          ? "Answer Requests"
          : "Drafts"}
      </h3>

      {questions
        .filter(({ id }) => !hiddenQuestions.includes(id))
        .map(({ id, data }) => {
          const isSelf = currentUser?.uid === data.user?.uid;
          const isFollowing = followMap[data.user?.uid];

          return (
            <div key={id} className="ans-feed-question">
              <div className="question-body">
                <div className="question-body-user-info">
                  <Avatar src={data.user?.photo} />
                  <h5
                    onClick={() => navigate(`/user/${data.user.uid}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {data.user?.display}
                  </h5>
                </div>

                <p className="question-text">{data.question}</p>

                <div className="question-meta">
                  <span
                    className="question-answers-no"
                    onClick={() => navigate(`/answer/${id}`)}
                  >
                    {data.answers || 0} Answer{data.answers === 1 ? "" : "s"}
                  </span>
                  <span className="question-date">
                    {new Date(data.timestamp?.toDate()).toDateString()}
                  </span>
                </div>

                <div className="question-actions">
                  <div className="question-buttons">
                    <button
                      className="answer-btn"
                      onClick={() => handleOpenModal(id)}
                    >
                      Answer
                    </button>
                    {!isSelf && (
                      <button
                        className="follow-btn"
                        onClick={() => handleFollowToggle(data.user?.uid)}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  </div>
                  <div
                    className="question-icons"
                    style={{ position: "relative" }}
                  >
                    <MoreHorizOutlined
                      onClick={() =>
                        setActiveDropdownId((prev) => (prev === id ? null : id))
                      }
                      style={{ cursor: "pointer" }}
                    />
                    {activeDropdownId === id && (
                      <div className="post-dropdown" ref={dropdownRef}>
                        <p onClick={() => handleBookmark(id)}>Bookmark</p>
                        <p onClick={() => handleCopyLink(id)}>Copy link</p>
                        <p onClick={() => handleNotInterested(id)}>
                          Not interested
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <AnswerModal
        open={openModal}
        handleClose={handleCloseModal}
        questionId={selectedQuestionId}
      />
    </div>
  );
}

export default AnsFeed;
