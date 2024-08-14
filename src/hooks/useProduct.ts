import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Product } from "@/types/product";

const useProduct = (page: any) => {
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    const docRef = doc(db, `product-${page}`, "product");

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as Product;
        setProduct(data);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);

  const createNewProductDoc = async (umid: string, value: any) => {
    try {
      const newDocRef = doc(db, `product-${umid}`, "product");
      await setDoc(newDocRef, value);
    } catch (error) {
      console.error("Error creating new document: ", error);
    }
  };

  const updateProduct = (product: Product) => {
    setProduct(product);
    setDoc(doc(db, `product-${page}`, "product"), product);
  };

  return { product, updateProduct, createNewProductDoc };
};

export default useProduct;
