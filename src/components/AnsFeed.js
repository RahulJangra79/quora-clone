import { useEffect, useState } from "react";
import "../css/AnsFeed.css";
import { ArrowDownwardOutlined, MoreHorizOutlined } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import AnswerModal from "./AnsModal";
import { useNavigate } from "react-router-dom";
import db, { auth } from "../firebase";
import firebase from "firebase/compat/app";

function AnsFeed({ activeTab }) {
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [followMap, setFollowMap] = useState({});
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

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
      map[followeeId] = doc.id; // Store the doc ID to delete later
    });

    setFollowMap(map);
  };

  const handleFollowToggle = async (followeeId) => {
    if (!currentUser || !followeeId || currentUser.uid === followeeId) return;

    try {
      if (followMap[followeeId]) {
        // Unfollow
        await db.collection("follows").doc(followMap[followeeId]).delete();
        console.log("Unfollowed");
        const newMap = { ...followMap };
        delete newMap[followeeId];
        setFollowMap(newMap);
      } else {
        // Follow
        const docRef = await db.collection("follows").add({
          followerId: currentUser.uid,
          followeeId,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        console.log("Followed");
        setFollowMap({ ...followMap, [followeeId]: docRef.id });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  useEffect(() => {
    const unsubscribeQuestions = db
      .collection("questions")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const questionDocs = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setQuestions(questionDocs);
      });

    return () => unsubscribeQuestions();
  }, []);

  useEffect(() => {
    const unsubscribeAnswers = db
      .collection("answers")
      .onSnapshot((snapshot) => {
        const answerCounts = {};
        snapshot.docs.forEach((doc) => {
          const { questionId } = doc.data();
          if (questionId) {
            answerCounts[questionId] = (answerCounts[questionId] || 0) + 1;
          }
        });

        setQuestions((prevQuestions) =>
          prevQuestions.map((q) => ({
            ...q,
            data: {
              ...q.data,
              answers: answerCounts[q.id] || 0,
            },
          }))
        );
      });

    return () => unsubscribeAnswers();
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

      {questions.map(({ id, data }) => {
        const isSelf = currentUser?.uid === data.user?.uid;
        const isFollowing = followMap[data.user?.uid];

        return (
          <div key={id} className="ans-feed-question">
            <div className="question-body">
              <div className="question-body-user-info">
                <Avatar src={data.user?.photo} />
                <h5>{data.user?.display}</h5>
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
                <div className="question-icons">
                  <ArrowDownwardOutlined />
                  <MoreHorizOutlined />
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
