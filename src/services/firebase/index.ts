// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9dlsH6LxeBs-3HCiFrWGTTQ8GMauUtjU",
  authDomain: "pagamentosmp-aa8bd.firebaseapp.com",
  projectId: "pagamentosmp-aa8bd",
  storageBucket: "pagamentosmp-aa8bd.firebasestorage.app",
  messagingSenderId: "323014655632",
  appId: "1:323014655632:web:4e07b764021f0128a4a215",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, app };
