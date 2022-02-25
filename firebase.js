import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCsKKuEbiJZoi3k3UKf3IgdETimefWmRsI",
  authDomain: "signal-clone-d015b.firebaseapp.com",
  projectId: "signal-clone-d015b",
  storageBucket: "signal-clone-d015b.appspot.com",
  messagingSenderId: "230836216624",
  appId: "1:230836216624:web:8dc2b96b0c63564aee5ef5"
};

let app;

if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const database = firebase.database();

export { db, database, auth, storage };