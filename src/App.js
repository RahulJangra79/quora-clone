// import { useDispatch, useSelector } from "react-redux";
// import "./App.css";
// import Quora from "./components/Quora";
// import { login, logout, selectUser } from "./features/userSlice";
// import Login from "./components/auth/Login";
// import { useEffect } from "react";
// import { auth } from "./firebase";

// function App() {
//   const user = useSelector(selectUser);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     auth.onAuthStateChanged((authUser) => {
//       if (authUser) {
//         dispatch(login({
//           uid: authUser.uid,
//           photo: authUser.photoURL,
//           display: authUser.displayName,
//           email: authUser.email
//         }));
//         console.log(authUser);
//       } else {
//         dispatch(logout());
//       }
//     });
//   }, [dispatch]);

//   return <div className="App">{user ? <Quora /> : <Login />}</div>;
// }

// export default App;




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
    // 🔄 Handles session persistence after user is already logged in
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          display: authUser.displayName,
          email: authUser.email
        }));
        console.log("Session restored:", authUser);
      } else {
        dispatch(logout());
      }
    });

    // 🚀 Handles mobile redirect sign-in on initial load
    auth.getRedirectResult()
      .then((result) => {
        if (result.user) {
          console.log("Signed in via redirect:", result.user);
          dispatch(login({
            uid: result.user.uid,
            photo: result.user.photoURL,
            display: result.user.displayName,
            email: result.user.email
          }));
        }
      })
      .catch((error) => {
        console.error("Redirect sign-in failed", error);
      });
  }, [dispatch]);

  return <div className="App">{user ? <Quora /> : <Login />}</div>;
}

export default App;