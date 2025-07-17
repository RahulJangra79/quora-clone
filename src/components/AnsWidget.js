import "../css/AnsWidget.css";

function AnsWidget() {
    const topics = ["Guru Jambheshwar University of Science and Technology"];
  return (
    <div className="ans-widget-topics">
        <h4>Topics you know about</h4>
        <ul>
          {topics.map((topic, i) => (
            <li key={i}>{topic}</li>
          ))}
        </ul>
      </div>
  );
}

export default AnsWidget;