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
  apiKey: "AIzaSyC_u3-dtchGrrTyKWMy5zpSTC2_Anh0gTs",
  authDomain: "checkout-59398.firebaseapp.com",
  projectId: "checkout-59398",
  storageBucket: "checkout-59398.appspot.com",
  messagingSenderId: "117638816087",
  appId: "1:117638816087:web:c8976001c3cf770089de12",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, app };
