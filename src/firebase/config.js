// import firebase from 'firebase/app'
// import 'firebase/firestore'
// import 'firebase/auth'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAUjJQm1RoJ8dj4tQ0K_o7X9QdD-mrlqmY",
  authDomain: "pellel-malal.firebaseapp.com",
  projectId: "pellel-malal",
  storageBucket: "pellel-malal.appspot.com",
  messagingSenderId: "980853041249",
  appId: "1:980853041249:web:af856db0fa45d96c0f6220"
};

// init firebase
firebase.initializeApp(firebaseConfig)

const projectAuth = firebase.auth()
const projectFirestore = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp
const db = firebase.firestore()

export { projectAuth, projectFirestore, timestamp, db }