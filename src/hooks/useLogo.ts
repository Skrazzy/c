import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Logo } from "@/types/logo";

const useLogo = (page: any) => {
  const [logoUrl, setLogoUrl] = useState<Logo>();

  useEffect(() => {
    const docRef = doc(db, `settings-${page}`, "logo");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as any;
        setLogoUrl(data);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);

  const updateLogo = (logo: Logo) => {
    setLogoUrl(logo);
    setDoc(doc(db, `settings-${page}`, "logo"), logo);
  };

  const createNewLogoDoc = async (umid: string, logo: any) => {
    try {
      const newDocRef = doc(db, `settings-${umid}`, "logo");
      await setDoc(newDocRef, { logo: logo });
    } catch (error) {
      console.error("Error creating new document: ", error);
    }
  };

  return { logoUrl, updateLogo, createNewLogoDoc };
};

export default useLogo;
