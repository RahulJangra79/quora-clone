import { useEffect, useState } from "react";
import "../css/AnsFeed.css";
import { ArrowDownwardOutlined, MoreHorizOutlined } from "@mui/icons-material";
import db from "../firebase";
import Avatar from "@mui/material/Avatar";

function AnsFeed({ activeTab }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("questions")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const questionData = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setQuestions(questionData);
      });

    return () => unsubscribe();
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
              <span>
                {data.answers || 0} Answer{data.answers === 1 ? "" : "s"}
              </span>
              <span className="question-date">
                {new Date(data.timestamp?.toDate()).toDateString()}
              </span>
            </div>

            <div className="question-actions">
              <div className="question-buttons">
                <button className="answer-btn">Answer</button>
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
    </div>
  );
}

export default AnsFeed;
