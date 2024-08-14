"use client";

import { Frete } from "@/types/logo";
import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  offer: boolean;
  setOffer: (value: boolean) => void;
  isLoading: boolean;
  setLoading: (value: boolean) => void;
  isFrete: Frete;
  setIsFrete: (value: any) => void;
  total: number;
  setTotal: (value: number) => void;
  hasPix: boolean;
  setHasPix: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [offer, setOffer] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFrete, setIsFrete] = useState<any | null>();
  const [total, setTotal] = useState<number>(0);
  const [hasPix, setHasPix] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        offer,
        setOffer,
        isLoading,
        setLoading,
        isFrete,
        setIsFrete,
        total,
        setTotal,
        hasPix,
        setHasPix,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
