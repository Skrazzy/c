import { useCallback, useEffect, useState } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

export const useProductActions = (page: any) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `ofertas-${page}`),
      (snapshot) => {
        const productList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = async (productData: any) => {
    try {
      const productRef = await addDoc(
        collection(db, `ofertas-${page}`),
        productData
      );
    } catch (err) {
      console.error("Error adding product: ", err);
    }
  };

  const getProductById = useCallback(async (productId: string) => {
    try {
      const productRef = doc(db, `ofertas-${page}`, productId);
      const productSnapshot = await getDoc(productRef);
      if (productSnapshot.exists()) {
        return { id: productSnapshot.id, ...productSnapshot.data() };
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }, []);

  const removeProduct = async (productId: string) => {
    try {
      const productDoc = doc(db, `ofertas-${page}`, productId);
      await deleteDoc(productDoc);
    } catch (err) {
      console.error("Error removing product: ", err);
    }
  };

  const createNewProductUpDoc = async (umid: string, value: any) => {
    try {
      const newDocRef = await addDoc(collection(db, `ofertas-${umid}`), value);
    } catch (err) {
      console.error("Error creating new document: ", err);
    }
  };

  return {
    products,
    addProduct,
    removeProduct,
    getProductById,
    createNewProductUpDoc,
  };
};
