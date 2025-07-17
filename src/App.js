import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Quora from "./components/Quora";
import Answer from "./components/Answer";
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import { login, logout, selectUser } from "./features/userSlice";
import { useEffect } from "react";
import { auth } from "./firebase";

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
            <Routes>
              <Route path="/" element={<Quora />} />
              <Route path="/following" element={<Answer />} />
              <Route path="/answer" element={<Answer />} />
              <Route path="/groups" element={<Answer />} />
              <Route path="/notification" element={<Answer />} />
              <Route path="/language" element={<Answer />} />
            </Routes>
          </>
        ) : (
          <Login />
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
