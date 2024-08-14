import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Text } from "@/types/logo";

const useText = (page: any) => {
  const [text, setText] = useState<Text>();

  useEffect(() => {
    const docRef = doc(db, `settings-${page}`, "text");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as any;
        setText(data);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);

  const updateText = (text: Text) => {
    setText(text);
    setDoc(doc(db, `settings-${page}`, "text"), text);
  };

  const createNewTextDoc = async (umid: string, text: any) => {
    try {
      const newDocRef = doc(db, `settings-${umid}`, "text");
      await setDoc(newDocRef, { text: text });
    } catch (error) {
      console.error("Error creating new document: ", error);
    }
  };

  return { text, updateText, createNewTextDoc };
};

export default useText;
