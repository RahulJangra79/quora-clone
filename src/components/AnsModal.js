import React, { useState } from "react";
import "../css/AnsModal.css";
import db from "../firebase";
import Modal from "@mui/material/Modal";
import { Box, TextField, Button } from "@mui/material";
import { getAuth } from "firebase/auth";

function AnswerModal({ open, handleClose, questionId }) {
  const [answer, setAnswer] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    await db.collection("answers").add({
      questionId,
      answer,
      timestamp: new Date(),
      user: {
        display: user?.displayName,
        email: user?.email,
        photo: user?.photoURL,
        uid: user?.uid,
      },
    });

    setAnswer("");
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="answer-modal-box">
        <h2>Write your answer</h2>
        <TextField
          multiline
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here"
          fullWidth
        />
        <Button onClick={submitAnswer} variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
}

export default AnswerModal;
