import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Frete } from "@/types/logo";

const useFrete = (page: any) => {
  const [frete, setFrete] = useState<Frete>();

  useEffect(() => {
    const docRef = doc(db, `settings-${page}`, "frete");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as any;
        setFrete(data);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);

  const createNewFreteDoc = async (umid: string, value: any) => {
    try {
      const newDocRef = doc(db, `settings-${umid}`, "frete");
      await setDoc(newDocRef, value);
    } catch (error) {
      console.error("Error creating new document: ", error);
    }
  };

  const updateFrete = (frete: Frete) => {
    setFrete(frete);
    setDoc(doc(db, `settings-${page}`, "frete"), frete);
  };

  return { frete, updateFrete, createNewFreteDoc };
};

export default useFrete;
