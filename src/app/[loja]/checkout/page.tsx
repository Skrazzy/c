"use client";

import React from "react";

import Layout from "@/components/layout";
import StepperComponent from "@/components/stepper";
import Cart from "@/components/cart";
import useColors from "@/hooks/useColors";
import Header from "@/components/header";

export default function Page({ params }: any) {
  useColors(params.loja);

  console.log(params.loja);

  return (
    <main className="w-full pb-10 max-w-[1440px] overflow-y-hidden bg-appbackground mx-auto font-poppins">
      <Header loja={params.loja} />
      <Layout>
        <StepperComponent loja={params.loja} />
        <Cart loja={params.loja} />
      </Layout>
    </main>
  );
}
