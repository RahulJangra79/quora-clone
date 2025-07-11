import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Quora from "./components/Quora";
import { login, logout, selectUser } from "./features/userSlice";
import Login from "./components/auth/Login";
import { useEffect } from "react";
import { auth } from "./firebase";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          display: authUser.displayName,
          email: authUser.email
        }));
        console.log(authUser);
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return <div className="App">{user ? <Quora /> : <Login />}</div>;
}

export default App;
