import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
require("firebase/auth");
const firebaseConfig = {
  apiKey: "AIzaSyCWmABhwGN4Sya5K0WJDLAGk1oplthAkAo",
  authDomain: "appchat-52263.firebaseapp.com",
  projectId: "appchat-52263",
  storageBucket: "appchat-52263.appspot.com",
  messagingSenderId: "858824310178",
  appId: "1:858824310178:web:535230b4b78fe66398c6fb"
};
firebase.initializeApp(firebaseConfig);
export default firebase;
