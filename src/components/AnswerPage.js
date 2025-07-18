import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../firebase";
import "../css/AnswerPage.css"

function AnswerPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const questionDoc = await db.collection("questions").doc(questionId).get();
      setQuestion(questionDoc.data());

      const answersSnap = await db
        .collection("answers")
        .where("questionId", "==", questionId)
        .orderBy("timestamp", "desc")
        .get();

      setAnswers(answersSnap.docs.map(doc => doc.data()));
    };

    fetchData();
  }, [questionId]);

  return (
    <div className="answer-page">
      {question && (
        <div className="question-details">
          <h2>{question.question}</h2>
          <p>Asked by: {question.user?.display}</p>
        </div>
      )}

      <div className="answers-list">
        <h3>{answers.length} Answer{answers.length === 1 ? "" : "s"}</h3>
        {answers.map((ans, index) => (
          <div key={index} className="single-answer">
            <p>{ans.answer}</p>
            <span>— {ans.user?.display || "Anonymous"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnswerPage;