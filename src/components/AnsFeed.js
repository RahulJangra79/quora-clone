import { useEffect, useState } from "react";
import "../css/AnsFeed.css";
import { ArrowDownwardOutlined, MoreHorizOutlined } from "@mui/icons-material";
import db from "../firebase";
import Avatar from "@mui/material/Avatar";
import AnswerModal from "./AnsModal";
import { useNavigate } from "react-router-dom";

function AnsFeed({ activeTab }) {
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const navigate = useNavigate();


  const handleOpenModal = (id) => {
    setSelectedQuestionId(id);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  // useEffect(() => {
  //   const unsubscribe = db
  //     .collection("questions")
  //     .orderBy("timestamp", "desc")
  //     .onSnapshot((snapshot) => {
  //       const questionData = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         data: doc.data(),
  //       }));
  //       setQuestions(questionData);
  //     });

  //   return () => unsubscribe();
  // }, []);

  //   useEffect(() => {
  //   const unsubscribe = db
  //     .collection("questions")
  //     .orderBy("timestamp", "desc")
  //     .onSnapshot(async (snapshot) => {
  //       const questionsData = await Promise.all(
  //         snapshot.docs.map(async (doc) => {
  //           const questionId = doc.id;

  //           // Count answers for this question
  //           const answersSnap = await db
  //             .collection("answers")
  //             .where("questionId", "==", questionId)
  //             .get();

  //           return {
  //             id: questionId,
  //             data: {
  //               ...doc.data(),
  //               answers: answersSnap.size, // count of answers
  //             },
  //           };
  //         })
  //       );

  //       setQuestions(questionsData);
  //     });

  //   return () => unsubscribe();
  // }, []);

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

  return (
    <div className="ans-feed">
      <h3 className="ans-feed-header">
        {activeTab === "questions"
          ? "Questions for You"
          : activeTab === "requests"
          ? "Answer Requests"
          : "Drafts"}
      </h3>

      {questions.map(({ id, data }) => (
        <div key={id} className="ans-feed-question">
          <div className="question-body">
            <div className="question-body-user-info">
              <Avatar src={data.user?.photo} />
              <h5>{data.user?.display}</h5>
            </div>
            <p className="question-text">{data.question}</p>

            <div className="question-meta">
              <span className="question-answers-no"   onClick={() => navigate(`/answer/${id}`)}
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
                <button className="follow-btn">Follow</button>
              </div>
              <div className="question-icons">
                <ArrowDownwardOutlined />
                <MoreHorizOutlined />
              </div>
            </div>
          </div>
        </div>
      ))}
      <AnswerModal
        open={openModal}
        handleClose={handleCloseModal}
        questionId={selectedQuestionId}
      />
    </div>
  );
}

export default AnsFeed;
