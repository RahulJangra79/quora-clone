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
import GroupInfo from "./components/GroupInfo";
import AdModal from "./components/AdModal";
import User from "./components/User";
import Help from "./components/Help";
import Bookmarks from "./components/Bookmarks";
import PostItem from "./components/PostItem";

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
        {user ? (
          <>
            <Navbar />
            <AdModal />
            <Routes>
              <Route path="/" element={<Quora />} />
              <Route path="/following" element={<Following />} />
              <Route path="/answer" element={<Answer />} />
              <Route path="/question/:questionId" element={<AnswerPage />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/group/:groupId" element={<GroupInfo />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/user/:uid" element={<User />} />
              <Route path="/help" element={<Help />} />
              <Route path="/bookmarks/:uid" element={<Bookmarks />} />
              <Route path="/post/:postId" element={<PostItem />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
