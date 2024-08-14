import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

import { Colors } from "@/types/colors";

const useColors = (page: any) => {
  const [colors, setColors] = useState<Colors>({
    main: "",
    main_segundary: "",
    text: "",
    text_segundary: "",
    formbackground: "",
    appbackground: "",
    pag: "",
  });

  useEffect(() => {
    const docRef = doc(db, `settings-${page}`, "colors");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setColors(doc.data() as Colors);
        console.log("Document data:", doc.data());

        const data = doc.data() as Colors;

        document.body.style.setProperty("--main", data.main);
        document.body.style.setProperty(
          "--main_segundary",
          data.main_segundary
        );
        document.body.style.setProperty("--text", data.text);
        document.body.style.setProperty(
          "--text_segundary",
          data.text_segundary
        );
        document.body.style.setProperty(
          "--formbackground",
          data.formbackground
        );
        document.body.style.setProperty("--appbackground", data.appbackground);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);

  const updateColor = async (colorName: string, colorValue: string) => {
    try {
      if (colors) {
        const updatedColors = { ...colors, [colorName]: colorValue };
        const docRef = doc(db, `settings-${page}`, "colors");
        await setDoc(docRef, updatedColors, { merge: true });
        setColors(updatedColors);
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const createNewColorDoc = async (umid: string, colors: any) => {
    try {
      const newDocRef = doc(db, `settings-${umid}`, "colors");
      await setDoc(newDocRef, colors);
    } catch (error) {
      console.error("Error creating new document: ", error);
    }
  };

  return { colors, updateColor, createNewColorDoc };
};

export default useColors;
