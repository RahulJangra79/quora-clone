import { useState } from "react";
import "./Login.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import db, { auth, provider } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import Swal from "sweetalert2";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  const handlePasswordReset = async (emailForReset) => {
    try {
      await auth.sendPasswordResetEmail(emailForReset);
      Swal.fire({
        icon: "success",
        title: "Reset Email Sent",
        text: "Check your inbox to reset your password!",
        confirmButtonColor: "#1a5aff",
      });
      setShowResetModal(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        confirmButtonColor: "#1a5aff",
      });
    }
  };

  function ForgotPasswordModal({ isOpen, onClose, onReset }) {
    const [resetEmail, setResetEmail] = useState("");

    if (!isOpen) return null;

    return (
      <div className="modal__backdrop">
        <div className="modal__content">
          <h3>Reset Your Password</h3>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <button onClick={() => onReset(resetEmail)}>Send Reset Link</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }

  const signIn = async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        const userData = {
          name: user.displayName || "",
          email: user.email,
          contact: "",
          address: "",
          isQuoraPlus: false,
          uid: user.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          photo: user.photoURL || "",
          language: user.language || "",
        };
        await setDoc(userRef, userData);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const authResult = await auth.signInWithEmailAndPassword(email, password);
      const user = authResult.user;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        const userData = {
          name: user.displayName || "",
          email: user.email,
          contact: "",
          address: "",
          isQuoraPlus: false,
          uid: user.uid,
        };

        await setDoc(userRef, userData);
        console.log("User document created on login:", userData);
      } else {
        console.log("User already exists:", docSnap.data());
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const registerSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        name: user.displayName || "",
        email: user.email,
        contact: "",
        address: "",
        isQuoraPlus: false,
        uid: user.uid,
      };

      await setDoc(doc(db, "users", user.uid), userData);
      console.log("User document created:", userData);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__logo"></div>
        <div className="login__desc">
          <p>A place to share knowledge and better understand the world</p>
        </div>
        <div className="login__auth">
          <div className="login__authOptions">
            <div className="login__authDesc">
              <p>
                By continuing you indicate that you have read and agree to
                Quora's
                <span style={{ color: "blue", cursor: "pointer" }}>
                  Terms of Service{" "}
                </span>
                and{" "}
                <span style={{ color: "blue", cursor: "pointer" }}>
                  Privacy Policy
                </span>
                .
              </p>
            </div>
            <div className="login__authOption">
              <img
                className="login__googleAuth"
                src="https://media-public.canva.com/MADnBiAubGA/3/screen.svg"
                alt=""
              />
              <p onClick={signIn}>Continue With Google</p>
            </div>
          </div>
          <div className="login__emailPass">
            <div className="login__label">
              <h5>Login</h5>
            </div>
            <div className="login__inputFields">
              <div className="login__inputField">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email"
                />
              </div>
              <div className="login__inputField">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="login__forgButt">
              <small
                style={{ cursor: "pointer", color: "#1a5aff" }}
                onClick={() => setShowResetModal(true)}
              >
                Forgot Password?
              </small>
              {/* Add this right before your closing div tag */}
              <ForgotPasswordModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                onReset={handlePasswordReset}
              />{" "}
              <button onClick={handleSignIn}>Login</button>
            </div>
            <button onClick={registerSignIn}>Sign up</button>
            <div className="login__logoutMsg">
              <p>
                You are now logged out of this browser, but are still logged in
                with other browsers.{" "}
                <span
                  style={{
                    color: "#1a5aff",
                    fontWeight: "350",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Log out of all browsers.
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="login__lang">
          <p>हिन्दी</p>
          <ArrowForwardIosIcon fontSize="small" />
        </div>
        <div className="login__footer">
          <p>About</p>
          <p>Languages</p>
          <p>Careers</p>
          <p>Businesses</p>
          <p>Privacy</p>
          <p>Terms</p>
          <p>Contact</p>
          <p>&copy; Quora, Inc. 2025</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
