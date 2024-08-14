import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { ProductOffer } from "@/types/product";

const useProductOffer = (page: any) => {
  const [productOffer, setProductOffer] = useState<ProductOffer>();

  useEffect(() => {
    const docRef = doc(db, `product-${page}`, "productOffer");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as ProductOffer;
        setProductOffer(data);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);

  const createNewProductOfferDoc = async (umid: string, value: any) => {
    try {
      const newDocRef = doc(db, `product-${umid}`, "productOffer");
      await setDoc(newDocRef, value);
    } catch (error) {
      console.error("Error creating new document: ", error);
    }
  };

  const updateProductOffer = (productOffer: ProductOffer) => {
    setProductOffer(productOffer);
    setDoc(doc(db, `product-${page}`, "productOffer"), productOffer);
  };

  return { productOffer, updateProductOffer, createNewProductOfferDoc };
};

export default useProductOffer;
