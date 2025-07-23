import React, { useState } from "react";
import "../css/Help.css";

const faqs = [
  {
    question: "How do I ask a question?",
    answer:
      "Click on the 'Add Question' button in the navbar. A modal will open where you can enter your question and submit it.",
  },
  {
    question: "How do I save a post or question?",
    answer:
      "Click the bookmark icon next to any post or question. It will be saved to your Bookmarks.",
  },
  {
    question: "How can I edit or delete my content?",
    answer:
      "Visit your profile and click the three-dot menu on your post/question. You'll find edit and delete options there.",
  },
  {
    question: "What is Quora+?",
    answer:
      "Quora+ is a premium experience with exclusive content and features. You can try it by clicking 'Try Quora+' from the avatar dropdown.",
  },
  {
    question: "How do I change language?",
    answer:
      "Click the Languages option in your avatar dropdown, then select your preferred language.",
  },
];

function Help() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="help">
      <div className="help-container">
        <h2>Frequently Asked Questions</h2>
        <ul className="faq-list">
          {faqs.map((faq, index) => (
            <li key={index} className="faq-item">
              <h4 onClick={() => toggleFAQ(index)} className="faq-question">
                {faq.question}
                <span className="faq-toggle">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </h4>
              {activeIndex === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Help;
