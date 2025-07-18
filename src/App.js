import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Quora from "./components/Quora";
import Answer from "./components/Answer";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import Groups from "./components/Groups";
import Following from "./components/Following";
import Login from "./components/auth/Login";
import { login, logout, selectUser } from "./features/userSlice";
import { useEffect } from "react";
import { auth } from "./firebase";
import AnswerPage from "./components/AnswerPage";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            display: authUser.displayName,
            email: authUser.email,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        {user && <Navbar />}
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Quora />} />
              <Route path="/following" element={<Following />} />
              <Route path="/answer" element={<Answer />} />
              <Route path="/answer/:questionId" element={<AnswerPage />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/notification" element={<Notification />} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
