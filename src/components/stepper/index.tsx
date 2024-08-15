"use client";

import React, { use, useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";

import {
  Step,
  Stepper,
  useStepper,
  type StepItem,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import FormComponent from "@/components/form";
import CardForm from "@/components/formCard";

const steps = [
  { label: "Step 1", description: "Step 1 description" },
  { label: "Step 2", description: "Step 2 description" },
  { label: "Step 3", description: "Step 2 description" },
] satisfies StepItem[];

import animationData from "../../../public/gifs/loading.json";
import { useAppContext } from "@/context/app";
import FormShipping from "../formInfo";
import OffertAdd from "../ofertaadd";
import { useProductActions } from "@/hooks/useProductSell";
import axios from "axios";
import { useRouter } from "next/navigation";

const StepperComponent = ({ loja }: any) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const formRef = useRef<HTMLFormElement>(null);
  const cardFormRef = useRef<HTMLFormElement>(null);
  const formShippingRef = useRef<HTMLFormElement>(null);

  const handleNextStep = () => {
    console.log("Next Step");
  };

  const { isLoading } = useAppContext();

  return (
    <div className="flex w-full relative h-full flex-col gap-4">
      {isLoading && (
        <div className="w-full h-[80%] app_sm:h-full text-text bg-[#030303c7] backdrop-blur-[1px] rounded-[8px] transition-all center-col absolute top-0 z-[9999]">
          <Lottie options={defaultOptions} height={100} width={350} />
          <h2>Fazendo Pagamento</h2>
        </div>
      )}
      <Stepper className="p-2" initialStep={0} steps={steps} responsive={false}>
        <Step label="Dados">
          <FormComponent onSubmitSuccess={handleNextStep} ref={formRef} />
        </Step>

        <Step label="Entrega">
          <FormShipping
            onSubmitSuccess={handleNextStep}
            ref={formShippingRef}
          />
        </Step>

        <Step label="Pagamento">
          <CardForm onSubmitSuccess={handleNextStep} ref={cardFormRef} />
        </Step>

        <Footer
          firstFormRef={formRef}
          cardFormRef={cardFormRef}
          formShippingRef={formShippingRef}
          loja={loja}
        />
      </Stepper>
    </div>
  );
};

const Footer = ({ firstFormRef, cardFormRef, formShippingRef, loja }: any) => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
    currentStep,
  } = useStepper();

  const { hasPix, setLoading } = useAppContext();
  const { products } = useProductActions(loja);
  const router = useRouter();

  const handleNextStep = () => {
    if (currentStep.label === "Step 1") {
      if (firstFormRef.current) {
        firstFormRef.current.requestSubmit();
      }
    }

    if (currentStep.label === "Step 2") {
      if (formShippingRef.current) {
        formShippingRef.current.requestSubmit();
      }
    }

    if (currentStep.label === "Step 3") {
      if (cardFormRef.current) {
        cardFormRef.current.requestSubmit();
      }
    }
  };

  const submitApi = async (product: any) => {
    const localUser = localStorage.getItem("user");
    const localShip = localStorage.getItem("ship");
    const localCard = localStorage.getItem("card");

    if (!localUser || !localShip || !localCard) return;

    const userData = JSON.parse(localUser);
    const shipData = JSON.parse(localShip);
    const cardData = JSON.parse(localCard);

    const [month, year] = cardData.expiryDate.split("/");

    const ta = {
      amount: product.price,
      customer: {
        name: userData.billingFirstName,
        email: userData.billingEmail,
        phone: userData.billingPhoneNumber.replace(/[\s()-]/g, ""),
        docType: "cpf",
        docNumber: userData.billingCPF.replace(/[.-]/g, ""),
        ip: "string",
        fingerprint: "string",
      },
      address: {
        country: shipData.billingCountry,
        state: shipData.billingState,
        city: shipData.billingCity,
        zipcode: shipData.billingPostalCode,
        street: shipData.billingAddress,
        complement: "",
        number: null,
      },
      items: [
        {
          title: product.name,
          unitPrice: product.price,
          quantity: 1,
          tangible: false,
          externalRef: "188390",
        },
      ],
      expiresInDays: 3,
      card: {
        externalToken: "token",
        number: cardData.cardNumber,
        holderName: cardData.cardHolderName,
        expMonth: month,
        expYear: year,
        cvv: cardData.securityCode,
      },
      paymentMethod: "credit_card",
      installments: 1,
    };

    try {
      const response = await axios.post(
        `https://pagamentoseguro.vercel.app/api/submit`,
        ta,
        {
          timeout: 30000,
        }
      );

      console.log(response.data);
      setLoading(false);
      nextStep();
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleNotOffert = (product: any) => {
    submitApi(product);
    router.replace(loja + "/product/" + products[1].id);
  };

  const handleGetOffert = async (product: any) => {
    setLoading(true);

    await submitApi(product);
    router.replace("/concluido");
  };

  return (
    <>
      {hasCompletedAllSteps && (
        <div className="py-6 flex items-center justify-center flex-col my-2 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl text-[#0a0a0a]">Pagamento Efetuado 🎉</h1>
          {products.length > 0 && (
            <OffertAdd
              data={products[0]}
              onClick={handleGetOffert}
              onClickRemove={handleNotOffert}
            />
          )}
        </div>
      )}
      {!hasPix && (
        <div className="w-full center-col !px-3 !flex-col-reverse bg-white py-4 pr-3 app_sm:pr-0 rounded-[8px] mt-[-30px] flex justify-end gap-2">
          {hasCompletedAllSteps ? (
            <Button size="sm" disabled onClick={resetSteps}>
              Concluido
            </Button>
          ) : (
            <>
              {!isDisabledStep && (
                <Button
                  disabled={isDisabledStep}
                  onClick={prevStep}
                  size="sm"
                  variant="secondary"
                  className="hover:!bg-white h-[55px] text-[20px] w-[97%]"
                >
                  Voltar
                </Button>
              )}
              <Button
                size="sm"
                className="w-[97%] h-[55px] text-[20px]"
                type="submit"
                onClick={() => handleNextStep()}
              >
                {isLastStep
                  ? "Finalizar Compra"
                  : isOptionalStep
                  ? "Skip"
                  : "Proximo"}
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default StepperComponent;
