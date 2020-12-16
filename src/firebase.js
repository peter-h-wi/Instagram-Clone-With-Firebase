import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBd-H69PilTMXfICXGL5o2K3yc8zICtIxA",
  authDomain: "instagram-clone-6e8df.firebaseapp.com",
  projectId: "instagram-clone-6e8df",
  storageBucket: "instagram-clone-6e8df.appspot.com",
  messagingSenderId: "641587343676",
  appId: "1:641587343676:web:ca669f0c893c3a96e1ee39"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };