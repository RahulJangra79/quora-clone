import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChb6BzlkH2CpR97OuToDYUji4V4GBEMRw",
  authDomain: "quora-c47d7.firebaseapp.com",
  projectId: "quora-c47d7",
  // storageBucket: "quora-c47d7.firebasestorage.app",
  storageBucket: "quora-c47d7.appspot.com",

  messagingSenderId: "20169921250",
  appId: "1:20169921250:web:d0f940a6b4e85a31a444bb",
  measurementId: "G-4YLZY6G9WS",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebaseApp.firestore();

const storage = firebase.storage();

export { auth, provider, storage };
export default db;
