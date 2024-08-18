"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCardIcon, CopyIcon } from "lucide-react";
import { useTimer } from "react-timer-hook";

import UpsellItem from "@/components/upsell";
import InputField from "@/components/inputField";
import { useStepper } from "../ui/stepper";
import useProduct from "@/hooks/useProduct";
import { useAppContext } from "@/context/app";
import useProductOffer from "@/hooks/useProductOffer";

import { DialogContent, Dialog } from "../ui/dialog";

import { QRCodeSVG } from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from "../ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import SelectField from "../selectField";

const schema = z.object({
  cardNumber: z
    .string({ message: "Insira o número do cartão" })
    .min(1, { message: "Número do cartão é obrigatório" }),
  cardHolderName: z
    .string({ message: "Insira o nome e sobrenome do titular do cartão" })
    .min(1, { message: "Nome do titular é obrigatório" }),
  expiryDate: z
    .string({ message: "Insira a data de vencimento" })
    .min(1, { message: "Data de vencimento é obrigatória" }),
  securityCode: z
    .string({ message: "Insira o código de segurança" })
    .min(1, { message: "Código de segurança é obrigatório" }),
  par: z
    .string({ message: "Selecione a parcela" })
    .min(1, { message: "Parcela é obrigatório" }),
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  cardNumber: "",
  par: "1",
  cardHolderName: "",
  expiryDate: "",
  securityCode: "",
};

interface CardFormProps {
  onSubmitSuccess: () => void;
}

type CardFormPropsWithRef = CardFormProps &
  React.RefAttributes<HTMLFormElement>;

function ExpireCodeTimer({ expiryTimestamp }: any) {
  const { seconds, minutes, isRunning, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("Tempo expirado"),
  });

  return (
    <p>
      Código expira em:{" "}
      <span className="text-[#fc4c4c]">
        {" "}
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </p>
  );
}

const CardForm = forwardRef<HTMLFormElement, CardFormPropsWithRef>(
  ({ onSubmitSuccess }, ref) => {
    const methods = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues,
    });

    const params = useParams();
    const loja = params.loja;

    const { nextStep } = useStepper();
    const { product } = useProduct(loja);
    const { offer, isLoading, setLoading, total, hasPix, setHasPix } =
      useAppContext();
    const { productOffer } = useProductOffer(loja);

    const discountAmount = (total * 10) / 100;
    const finalPrice = total - discountAmount;

    const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
    const [showQRCodeCard, setShowQRCodeCard] = useState(false);
    const [copy, setCopy] = useState(false);

    const [recused, setRecused] = useState(false);

    if (!product || !productOffer) return null;

    const submitApi = async (data: FormData) => {
      const localUser = localStorage.getItem("user");
      const localShip = localStorage.getItem("ship");

      if (!localUser || !localShip) return;

      const userData = JSON.parse(localUser);
      const shipData = JSON.parse(localShip);
      const [month, year] = data.expiryDate.split("/");

      const ta = {
        amount: total,
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
          state: shipData.par,
          city: shipData.billingCity,
          zipcode: shipData.billingPostalCode,
          street: shipData.billingAddress,
          complement: "",
          number: null,
        },
        items: [
          {
            title: product.name,
            unitPrice: total,
            quantity: 1,
            tangible: false,
            externalRef: "188390",
          },
        ],
        installments: +data.par,
        expiresInDays: 3,
        card: {
          externalToken: "token",
          number: data.cardNumber,
          holderName: data.cardHolderName,
          expMonth: month,
          expYear: year,
          cvv: data.securityCode,
        },
        paymentMethod: "credit_card",
      };

      try {
        const response = await axios.post(
          `https://pagamentoseguro.vercel.app/api/submit`,
          ta,
          {
            timeout: 30000,
          }
        );

        if (
          response.data.data.data.reason !==
          "Pagamento recusado, por favor tente novamente com outro cartão ou meio de pagamento"
        ) {
          setRecused(true);
        }

        setLoading(false);
        nextStep();
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const onSubmitPix = async () => {
      const localUser = localStorage.getItem("user");
      const localShip = localStorage.getItem("ship");

      if (!localUser || !localShip) return;

      const userData = JSON.parse(localUser);
      const shipData = JSON.parse(localShip);

      const ta = {
        amount: total.toFixed(1),
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
          complement: "Casa",
          number: 123,
        },

        items: [
          {
            title: product.name,
            unitPrice: total.toFixed(1),
            quantity: 1,
            tangible: false,
            externalRef: "188390",
          },
        ],
        paymentMethod: "pix",
      };

      try {
        const response = await axios.post(
          `https://pagamentoseguro.vercel.app/api/submitPix`,
          ta,
          {
            timeout: 30000,
          }
        );

        setQrCodeValue(response.data.data.data.pix.qrCode);
        setShowQRCodeCard(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const handleSave = (data: any) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("card", JSON.stringify(data));
      }
    };

    const onSubmit = (data: FormData) => {
      setLoading(true);
      handleSave(data);
      submitApi(data);

      onSubmitSuccess();
    };

    const handleOpenChange = () => {
      setCopy(false);
      setShowQRCodeCard(!showQRCodeCard);
    };

    const handleOpenRecusedChange = () => {
      setRecused(false);
    };

    const handleTab = (value: string) => {
      if (value === "card") {
        setHasPix(false);
      } else if (value === "pix") {
        setHasPix(true);
      }
    };

    const time = new Date();
    time.setSeconds(time.getSeconds() + 600);

    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          ref={ref}
          className="grid grid-cols-2 relative w-full [&>.input]:!py-3 [&>.input]:!px-1 [&>.input_label]:top-[28px] [&>.input_label]:text-[#888888]"
        >
          <h1>Pagamento</h1>
          <Tabs
            defaultValue="card"
            className="w-auto col-span-2 config"
            onValueChange={handleTab}
          >
            <TabsList className="grid w-full grid-cols-2 bg-transparent grid-rows-1 h-auto space-x-2 !center">
              <TabsTrigger
                value="card"
                className="h-[57px] w-[100px] tabsoption text-[#759ef7] fill-[#759ef7] !shadow-none border-transparent border-[#759ef7] border-[1px] border-solid data-[state=active]:!border-[#f7d032]"
              >
                <svg
                  width="32"
                  height="23"
                  viewBox="0 0 32 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.9995 15.3532C21.3367 15.3532 20.7995 15.8886 20.7995 16.5491C20.7995 17.2095 21.3367 17.7449 21.9995 17.7449H25.9995C26.6622 17.7449 27.1995 17.2095 27.1995 16.5491C27.1995 15.8886 26.6622 15.3532 25.9995 15.3532H21.9995ZM3.66667 0.205811C1.64162 0.205811 0 1.84175 0 3.85979V19.1401C0 21.1581 1.64162 22.794 3.66667 22.794H28.3333C30.3584 22.794 32 21.1581 32 19.1401V3.85979C32 1.84175 30.3584 0.205811 28.3333 0.205811H3.66667ZM2 19.1401V8.84249H30V19.1401C30 20.0574 29.2538 20.801 28.3333 20.801H3.66667C2.74619 20.801 2 20.0574 2 19.1401ZM2 6.84941V3.85979C2 2.9425 2.74619 2.19889 3.66667 2.19889H28.3333C29.2538 2.19889 30 2.9425 30 3.85979V6.84941H2Z"
                    fill="#5B8DE8"
                  ></path>
                </svg>
              </TabsTrigger>
              <TabsTrigger
                value="pix"
                className="h-[57px] w-[100px] pixoption tabsoption border-transparent border-[1px] border-solid border-[#759ef7] data-[state=active]:!border-[#f7d032]"
              >
                <svg
                  width="56"
                  height="21"
                  viewBox="0 0 56 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_1193_2161)">
                    <path
                      d="M23.1182 19.1341V7.7101C23.1182 5.6045 24.8206 3.9021 26.9262 3.9021H30.2974C32.3918 3.9021 34.083 5.6045 34.083 7.6989V10.1293C34.083 12.2349 32.3806 13.9373 30.275 13.9373H25.515"
                      stroke="#939598"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M35.0234 3.91333H36.4906C37.353 3.91333 38.0474 4.60773 38.0474 5.47013V14.0045"
                      stroke="#939598"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M37.7341 2.59174L37.0733 1.93094C36.9053 1.76294 36.9053 1.49414 37.0733 1.33734L37.7341 0.676537C37.9021 0.508537 38.1709 0.508537 38.3277 0.676537L38.9885 1.33734C39.1565 1.50534 39.1565 1.77414 38.9885 1.93094L38.3277 2.59174C38.1597 2.74854 37.8909 2.74854 37.7341 2.59174Z"
                      fill="#32BCAD"
                    ></path>
                    <path
                      d="M40.8477 3.9021H42.2925C43.0429 3.9021 43.7485 4.1933 44.2861 4.7309L47.6797 8.1245C48.1165 8.5613 48.8333 8.5613 49.2701 8.1245L52.6525 4.7421C53.1789 4.2157 53.8957 3.9133 54.6461 3.9133H55.8221"
                      stroke="#939598"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M40.8477 13.9262H42.2925C43.0429 13.9262 43.7485 13.635 44.2861 13.0974L47.6797 9.70382C48.1165 9.26702 48.8333 9.26702 49.2701 9.70382L52.6525 13.0862C53.1789 13.6126 53.8957 13.915 54.6461 13.915H55.8221"
                      stroke="#939598"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M14.4714 16.0877C13.7434 16.0877 13.0602 15.8077 12.545 15.2925L9.76739 12.5149C9.57699 12.3245 9.22979 12.3245 9.03939 12.5149L6.2506 15.3037C5.7354 15.8189 5.05219 16.0989 4.32419 16.0989H3.77539L7.30339 19.6269C8.40099 20.7245 10.193 20.7245 11.2906 19.6269L14.8298 16.0877H14.4714Z"
                      fill="#32BCAD"
                    ></path>
                    <path
                      d="M4.31293 6.25403C5.04093 6.25403 5.72413 6.53403 6.23933 7.04923L9.02813 9.83803C9.22973 10.0396 9.55453 10.0396 9.75613 9.83803L12.5449 7.06043C13.0601 6.54523 13.7433 6.26523 14.4713 6.26523H14.8073L11.2681 2.72603C10.1705 1.62843 8.37853 1.62843 7.28093 2.72603L3.75293 6.25403H4.31293Z"
                      fill="#32BCAD"
                    ></path>
                    <path
                      d="M17.7308 9.18849L15.5916 7.04929C15.5468 7.07169 15.4908 7.08289 15.4348 7.08289H14.4604C13.9564 7.08289 13.4636 7.28449 13.1164 7.64289L10.3388 10.4205C10.0812 10.6781 9.73404 10.8125 9.39804 10.8125C9.05084 10.8125 8.71483 10.6781 8.45723 10.4205L5.66844 7.63169C5.31004 7.27329 4.81724 7.07169 4.32444 7.07169H3.12604C3.07004 7.07169 3.02524 7.06049 2.98044 7.03809L0.830036 9.18849C-0.267564 10.2861 -0.267564 12.0781 0.830036 13.1757L2.96923 15.3149C3.01403 15.2925 3.05884 15.2813 3.11484 15.2813H4.31323C4.81723 15.2813 5.31003 15.0797 5.65723 14.7213L8.44604 11.9325C8.95004 11.4285 9.83484 11.4285 10.3388 11.9325L13.1164 14.7101C13.4748 15.0685 13.9676 15.2701 14.4604 15.2701H15.4348C15.4908 15.2701 15.5356 15.2813 15.5916 15.3037L17.7308 13.1645C18.8284 12.0669 18.8284 10.2861 17.7308 9.18849Z"
                      fill="#32BCAD"
                    ></path>
                    <path
                      d="M26.0075 18.1599C25.8507 18.1599 25.6715 18.1934 25.4811 18.2382V18.9326C25.6043 18.9774 25.7499 18.9998 25.8843 18.9998C26.2315 18.9998 26.3995 18.8766 26.3995 18.5742C26.4107 18.2942 26.2763 18.1599 26.0075 18.1599ZM25.3691 19.459V18.0814H25.4699L25.4811 18.1374C25.6379 18.1038 25.8619 18.0479 26.0299 18.0479C26.1643 18.0479 26.2875 18.0703 26.3883 18.1486C26.5115 18.2494 26.5451 18.4062 26.5451 18.5742C26.5451 18.7534 26.4891 18.9214 26.3211 19.0222C26.2091 19.0894 26.0523 19.1118 25.9179 19.1118C25.7723 19.1118 25.6379 19.0894 25.5035 19.0446V19.4478H25.3691V19.459Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M27.4182 18.1599C27.071 18.1599 26.9142 18.2718 26.9142 18.5742C26.9142 18.8766 27.071 18.9998 27.4182 18.9998C27.7654 18.9998 27.9222 18.8878 27.9222 18.5854C27.911 18.2942 27.7654 18.1599 27.4182 18.1599ZM27.8662 19.011C27.7542 19.0894 27.5974 19.123 27.4182 19.123C27.239 19.123 27.0822 19.1006 26.9702 19.011C26.847 18.9214 26.791 18.7758 26.791 18.5854C26.791 18.4062 26.847 18.2494 26.9702 18.1599C27.0822 18.0815 27.239 18.0479 27.4182 18.0479C27.5974 18.0479 27.7542 18.0703 27.8662 18.1599C28.0006 18.2494 28.0454 18.4062 28.0454 18.5854C28.0454 18.7646 27.9894 18.9214 27.8662 19.011Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M29.5131 19.0893L29.1211 18.2493H29.1099L28.7291 19.0893H28.6283L28.2139 18.0813H28.3483L28.6955 18.9213H28.7067L29.0763 18.0813H29.1883L29.5691 18.9213H29.5803L29.9163 18.0813H30.0395L29.6251 19.0893H29.5131Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M30.7904 18.1599C30.4656 18.1599 30.3536 18.3055 30.3424 18.5071H31.2496C31.2272 18.2831 31.1152 18.1599 30.7904 18.1599ZM30.7792 19.1119C30.5888 19.1119 30.4656 19.0895 30.3648 18.9999C30.2416 18.8991 30.208 18.7535 30.208 18.5855C30.208 18.4287 30.264 18.2495 30.3984 18.1599C30.5104 18.0815 30.6448 18.0591 30.7904 18.0591C30.9248 18.0591 31.0704 18.0703 31.1936 18.1599C31.3392 18.2607 31.3728 18.4287 31.3728 18.6191H30.3424C30.3424 18.8319 30.4096 19.0111 30.8016 19.0111C30.992 19.0111 31.16 18.9775 31.3168 18.9551V19.0559C31.1488 19.0783 30.9584 19.1119 30.7792 19.1119Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M31.6973 19.0894V18.0815H31.7981L31.8093 18.1374C32.0221 18.0815 32.1229 18.0479 32.3133 18.0479H32.3245V18.1599H32.2909C32.1341 18.1599 32.0333 18.1823 31.8205 18.2383V19.0782L31.6973 19.0894Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M33.0072 18.1599C32.6824 18.1599 32.5704 18.3055 32.5592 18.5071H33.4664C33.444 18.2831 33.332 18.1599 33.0072 18.1599ZM32.996 19.1119C32.8056 19.1119 32.6824 19.0895 32.5816 18.9999C32.4584 18.8991 32.4248 18.7535 32.4248 18.5855C32.4248 18.4287 32.4808 18.2495 32.6152 18.1599C32.7272 18.0815 32.8616 18.0591 33.0072 18.0591C33.1416 18.0591 33.2872 18.0703 33.4104 18.1599C33.556 18.2607 33.5896 18.4287 33.5896 18.6191H32.5592C32.5592 18.8319 32.6264 19.0111 33.0184 19.0111C33.2088 19.0111 33.3768 18.9775 33.5336 18.9551V19.0559C33.3656 19.0783 33.1752 19.1119 32.996 19.1119Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M34.8673 18.227C34.7441 18.1822 34.5984 18.1598 34.464 18.1598C34.1169 18.1598 33.9489 18.283 33.9489 18.5854C33.9489 18.8766 34.0833 18.9998 34.352 18.9998C34.5088 18.9998 34.6881 18.9662 34.8784 18.9214V18.227H34.8673ZM34.8896 19.0894L34.8784 19.0334C34.7217 19.067 34.4976 19.123 34.3296 19.123C34.1952 19.123 34.0721 19.1006 33.9713 19.0222C33.8481 18.9214 33.8145 18.7646 33.8145 18.5966C33.8145 18.4174 33.8705 18.2494 34.0385 18.1598C34.1505 18.0926 34.3072 18.0702 34.4416 18.0702C34.576 18.0702 34.7216 18.0926 34.856 18.1374V17.6782H34.9793V19.1118L34.8896 19.0894Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M36.7146 18.1597C36.5578 18.1597 36.3786 18.1933 36.1882 18.2381V18.9325C36.3114 18.9773 36.457 18.9997 36.5914 18.9997C36.9386 18.9997 37.1066 18.8765 37.1066 18.5741C37.1066 18.2941 36.9722 18.1597 36.7146 18.1597ZM37.017 19.0221C36.905 19.0893 36.7482 19.1117 36.6138 19.1117C36.4682 19.1117 36.3114 19.0893 36.1658 19.0333L36.1546 19.0781H36.0762V17.6445H36.1994V18.1261C36.3562 18.0925 36.5802 18.0477 36.737 18.0477C36.8714 18.0477 36.9946 18.0701 37.0954 18.1485C37.2186 18.2493 37.2522 18.4061 37.2522 18.5741C37.241 18.7645 37.1738 18.9325 37.017 19.0221Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M37.3871 19.4703V19.3583C37.4431 19.3695 37.4991 19.3695 37.5327 19.3695C37.6783 19.3695 37.7679 19.3247 37.8463 19.1567L37.8799 19.0783L37.3535 18.0703H37.4879L37.9359 18.9439H37.9471L38.3727 18.0703H38.5071L37.9359 19.2015C37.8351 19.4031 37.7231 19.4703 37.5103 19.4703C37.4879 19.4815 37.4431 19.4815 37.3871 19.4703Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M40.1426 18.5069H39.7506V18.8653H40.1426C40.4114 18.8653 40.5122 18.8317 40.5122 18.6861C40.5234 18.5293 40.3778 18.5069 40.1426 18.5069ZM40.0754 17.9357H39.7618V18.2941H40.0866C40.3554 18.2941 40.4562 18.2605 40.4562 18.1149C40.445 17.9581 40.3106 17.9357 40.0754 17.9357ZM40.6802 18.9885C40.5346 19.0781 40.3666 19.0893 40.0418 19.0893H39.4482V17.7229H40.0306C40.2994 17.7229 40.4674 17.7229 40.613 17.8125C40.7138 17.8685 40.7474 17.9693 40.7474 18.0813C40.7474 18.2269 40.6914 18.3165 40.5346 18.3837V18.3949C40.7138 18.4397 40.8258 18.5293 40.8258 18.7197C40.8258 18.8429 40.781 18.9325 40.6802 18.9885Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M42.0239 18.6638C41.9007 18.6526 41.7887 18.6526 41.6655 18.6526C41.4639 18.6526 41.3855 18.6974 41.3855 18.787C41.3855 18.8766 41.4415 18.9214 41.5983 18.9214C41.7327 18.9214 41.8895 18.8878 42.0239 18.8654V18.6638ZM42.0799 19.0894L42.0687 19.0334C41.9007 19.0782 41.6991 19.123 41.5199 19.123C41.4079 19.123 41.2959 19.1118 41.2175 19.0446C41.1391 18.9886 41.1055 18.899 41.1055 18.7982C41.1055 18.6862 41.1503 18.5742 41.2735 18.5294C41.3743 18.4846 41.5199 18.4734 41.6543 18.4734C41.7551 18.4734 41.9007 18.4846 42.0239 18.4846V18.4622C42.0239 18.3054 41.9231 18.2494 41.6319 18.2494C41.5199 18.2494 41.3855 18.2606 41.2623 18.2718V18.0703C41.4079 18.0591 41.5647 18.0479 41.6991 18.0479C41.8783 18.0479 42.0575 18.0591 42.1695 18.1374C42.2815 18.2158 42.3039 18.3278 42.3039 18.4846V19.0782L42.0799 19.0894Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M43.6141 19.0895V18.5295C43.6141 18.3503 43.5245 18.2831 43.3565 18.2831C43.2333 18.2831 43.0765 18.3167 42.9421 18.3503V19.0895H42.6621V18.0815H42.8861L42.8973 18.1487C43.0765 18.1039 43.2669 18.0591 43.4349 18.0591C43.5581 18.0591 43.6813 18.0815 43.7821 18.1599C43.8605 18.2271 43.8941 18.3279 43.8941 18.4735V19.0895H43.6141Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M44.6895 19.1119C44.5551 19.1119 44.4207 19.0895 44.3199 19.0111C44.1967 18.9103 44.1631 18.7535 44.1631 18.5855C44.1631 18.4287 44.2191 18.2495 44.3647 18.1599C44.4879 18.0815 44.6447 18.0591 44.8127 18.0591C44.9247 18.0591 45.0367 18.0703 45.1711 18.0815V18.2943C45.0703 18.2831 44.9471 18.2719 44.8463 18.2719C44.5775 18.2719 44.4543 18.3503 44.4543 18.5855C44.4543 18.7983 44.5439 18.8991 44.7679 18.8991C44.8911 18.8991 45.0479 18.8767 45.1935 18.8431V19.0559C45.0255 19.0783 44.8463 19.1119 44.6895 19.1119Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M46.0109 18.2607C45.7421 18.2607 45.6301 18.3391 45.6301 18.5743C45.6301 18.7983 45.7421 18.8991 46.0109 18.8991C46.2797 18.8991 46.3917 18.8207 46.3917 18.5855C46.3917 18.3615 46.2797 18.2607 46.0109 18.2607ZM46.4925 19.0111C46.3693 19.0895 46.2125 19.1119 46.0109 19.1119C45.8093 19.1119 45.6525 19.0895 45.5293 19.0111C45.3949 18.9215 45.3389 18.7647 45.3389 18.5855C45.3389 18.4063 45.3837 18.2495 45.5293 18.1599C45.6525 18.0815 45.8093 18.0591 46.0109 18.0591C46.2125 18.0591 46.3693 18.0815 46.4925 18.1599C46.6269 18.2495 46.6829 18.4063 46.6829 18.5855C46.6829 18.7647 46.6269 18.9215 46.4925 19.0111Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M48.3062 19.1118C48.1382 19.1118 47.9478 19.0894 47.8134 18.9662C47.6454 18.8318 47.6006 18.619 47.6006 18.395C47.6006 18.1934 47.6678 17.9582 47.8806 17.8126C48.0486 17.7006 48.2502 17.6782 48.463 17.6782C48.6198 17.6782 48.7654 17.6894 48.9446 17.7006V17.947C48.799 17.9358 48.6198 17.9246 48.4854 17.9246C48.0934 17.9246 47.9366 18.0702 47.9366 18.3838C47.9366 18.7086 48.0934 18.8542 48.3734 18.8542C48.5638 18.8542 48.7654 18.8206 48.9782 18.7758V19.0222C48.7542 19.067 48.5302 19.1118 48.3062 19.1118Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M49.7844 18.227C49.5492 18.227 49.4596 18.3054 49.4484 18.4622H50.1316C50.1204 18.3054 50.0196 18.227 49.7844 18.227ZM49.7396 19.1118C49.5716 19.1118 49.426 19.0894 49.314 18.9998C49.1908 18.899 49.1572 18.7534 49.1572 18.5742C49.1572 18.4174 49.202 18.2494 49.3476 18.1486C49.4708 18.0591 49.6276 18.0479 49.7844 18.0479C49.93 18.0479 50.098 18.0591 50.2212 18.1486C50.378 18.2606 50.4004 18.4398 50.4004 18.6414H49.4484C49.4596 18.7982 49.538 18.899 49.818 18.899C49.9972 18.899 50.1876 18.8766 50.3556 18.843V19.0446C50.154 19.0782 49.9412 19.1118 49.7396 19.1118Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M51.6561 19.0895V18.5295C51.6561 18.3503 51.5665 18.2831 51.3985 18.2831C51.2753 18.2831 51.1185 18.3167 50.9841 18.3503V19.0895H50.7041V18.0815H50.9281L50.9393 18.1487C51.1185 18.1039 51.3089 18.0591 51.4769 18.0591C51.6001 18.0591 51.7233 18.0815 51.8241 18.1599C51.9025 18.2271 51.9361 18.3279 51.9361 18.4735V19.0895H51.6561Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M52.7308 19.1118C52.5964 19.1118 52.4732 19.0782 52.406 18.9662C52.3612 18.899 52.3276 18.7982 52.3276 18.6638V18.283H52.126V18.0702H52.3276L52.3612 17.7678H52.6076V18.0702H52.9996V18.283H52.6076V18.6078C52.6076 18.6862 52.6188 18.7534 52.63 18.7982C52.6636 18.8654 52.7308 18.8878 52.8092 18.8878C52.8764 18.8878 52.9548 18.8766 53.0108 18.8654V19.067C52.9324 19.1006 52.8204 19.1118 52.7308 19.1118Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M53.2803 19.0895V18.0815H53.5043L53.5155 18.1487C53.7059 18.0927 53.8403 18.0591 54.0195 18.0591H54.0531V18.2943H53.9523C53.8179 18.2943 53.7059 18.3055 53.5603 18.3503V19.0895H53.2803Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M55.0713 18.6638C54.9481 18.6526 54.8361 18.6526 54.7129 18.6526C54.5113 18.6526 54.4329 18.6974 54.4329 18.787C54.4329 18.8766 54.4889 18.9214 54.6457 18.9214C54.7801 18.9214 54.9369 18.8878 55.0713 18.8654V18.6638ZM55.1385 19.0894L55.1273 19.0334C54.9593 19.0782 54.7577 19.123 54.5785 19.123C54.4665 19.123 54.3545 19.1118 54.2761 19.0446C54.1977 18.9886 54.1641 18.899 54.1641 18.7982C54.1641 18.6862 54.2089 18.5742 54.3321 18.5294C54.4329 18.4846 54.5785 18.4734 54.7129 18.4734C54.8137 18.4734 54.9593 18.4846 55.0825 18.4846V18.4622C55.0825 18.3054 54.9817 18.2494 54.6905 18.2494C54.5785 18.2494 54.4441 18.2606 54.3209 18.2718V18.0703C54.4665 18.0591 54.6233 18.0479 54.7577 18.0479C54.9369 18.0479 55.1161 18.0591 55.2281 18.1374C55.3401 18.2158 55.3625 18.3278 55.3625 18.4846V19.0782L55.1385 19.0894Z"
                      fill="#939598"
                    ></path>
                    <path
                      d="M55.7207 17.6558H56.0007V19.0894H55.7207V17.6558Z"
                      fill="#939598"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_1193_2161">
                      <rect
                        width="56"
                        height="19.9136"
                        fill="white"
                        transform="translate(0 0.543213)"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="card" className="w-full">
              <div className="center-col col-span-2 bg-[#F8F8F8] py-3">
                <span className="text-[12px] font-thin opacity-80 rounded-[6px]">
                  Parcele em <strong>até 12x</strong> nos cartões:
                </span>
                <img src="https://res.cloudinary.com/dmceve2cp/image/upload/v1723527194/Screenshot_1_bp1iov.png" />
              </div>
              <InputField
                name="cardNumber"
                label="Número do Cartão"
                mask="____ ____ ____ ____"
                placeholder="1234 5678 9101 1123"
                className="col-span-2"
                validationSchema={schema.shape.cardNumber}
              />
              <InputField
                name="cardHolderName"
                label="Nome e sobrenome"
                className="col-span-2"
                placeholder="Johnny Bastos"
                validationSchema={schema.shape.cardHolderName}
              />
              <InputField
                name="expiryDate"
                label="Data de Vencimento"
                mask="__/__"
                placeholder="01/22"
                className="app_sm:col-span-2"
                validationSchema={schema.shape.expiryDate}
              />
              <SelectField
                name="par"
                label="Parcele em"
                options={[
                  {
                    value: "1",
                    label: `1x de ${(total / 1).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "2",
                    label: `2x de ${(total / 2).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "3",
                    label: `3x de ${(total / 3).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "4",
                    label: `4x de ${(total / 4).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "5",
                    label: `5x de ${(total / 5).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "6",
                    label: `6x de ${(total / 6).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "7",
                    label: `7x de ${(total / 7).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "8",
                    label: `8x de ${(total / 8).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "9",
                    label: `9x de ${(total / 9).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "10",
                    label: `10x de ${(total / 10).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "11",
                    label: `11x de ${(total / 11).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                  {
                    value: "12",
                    label: `12x de ${(total / 12).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`,
                  },
                ]}
                validationSchema={schema.shape.par}
              />
              <InputField
                name="securityCode"
                label="Código de Segurança"
                mask="___"
                placeholder="123"
                className="app_sm:col-span-2"
                validationSchema={schema.shape.securityCode}
              />

              <UpsellItem />
            </TabsContent>
            <TabsContent value="pix" className="w-full">
              <div className="w-full opacity-80 border border-solid pb-6 px-4 py-2 rounded-[6px] border-gray-300 col-span-2 center-col">
                <div className="center desconto my-3">
                  <span className="off center">10% OFF</span>
                  <p className="off-info">
                    Garanta{" "}
                    <span className="font-bold text-[#1FBB70]">
                      {discountAmount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>{" "}
                    de desconto pagando via pix
                  </p>
                </div>
                <span className="font-poppins opacity-85 mt-3">
                  Ao selecionar o Pix, você será encaminhado para um ambiente
                  seguro para finalizar seu pagamento.
                </span>
              </div>
              <UpsellItem />
              <Button
                className="static w-full col-span-2 mt-3 bg-[#1FBB70] !rounded-[3px] font-[900] tracking-wider right-5 h-[54px] app_sm:static app_sm:w-full app_sm:col-span-2 app_sm:mt-3"
                onClick={(ev) => {
                  ev.preventDefault();
                  onSubmitPix();
                }}
              >
                GERAR PIX
              </Button>
            </TabsContent>
          </Tabs>
        </form>

        {showQRCodeCard && qrCodeValue && (
          <Dialog open={showQRCodeCard} onOpenChange={handleOpenChange}>
            <DialogContent className="center-col font-poppins rounded-lg py-10 shadow-lg">
              <div className="w-full border-solid px-4 py-2 border-[1px] border-transparent border-b-gray-200 text-center">
                <h1 className="font-bold">
                  Falta pouco! Para finalizar a compra, efetue o pagamento com
                  PIX!
                </h1>
              </div>

              <div className="center-col space-y-2 border w-[270px] pt-0 border-solid  py-2 rounded-[6px] border-gray-200">
                <div className="w-full center border border-solid border-transparent py-2 px-1 border-b-gray-200">
                  <ExpireCodeTimer expiryTimestamp={time} />
                </div>
                <QRCodeSVG value={qrCodeValue} size={236} />
              </div>

              <CopyToClipboard
                text={qrCodeValue}
                onCopy={() => {
                  setCopy(true);
                }}
              >
                <div className=" center-col space-y-2 w-full">
                  <p className="text-center max-w-[66%] my-3 mx-auto">
                    Copie a chave abaixo e utilize a opção{" "}
                    <strong>Pix Copiar e Cola</strong>
                  </p>
                  <input
                    disabled
                    className=" border-[1px] w-full rounded-[8px] min-h-[45px] border-[#afafaf] border-solid px-3"
                    value={qrCodeValue.substring(0, 42) + "..."}
                  />
                  <Button className="h-full bg-[#1FBB70] min-h-[45px] w-full">
                    <CopyIcon size={18} className="mr-2" />
                    {copy ? "Copiado!" : "Copiar"}
                  </Button>
                </div>
              </CopyToClipboard>
              <p className="text-[18px] font-[400] text-[#292929]">
                Valor a ser pago:{" "}
                <span className="font-[500] text-[#318d29]">
                  {finalPrice?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </p>
            </DialogContent>
          </Dialog>
        )}

        {recused && (
          <Dialog open={recused} onOpenChange={handleOpenRecusedChange}>
            <DialogContent className="center-col font-poppins rounded-lg py-10 shadow-lg">
              <div className="w-full border-solid px-4 py-2 border-[1px] border-transparent border-b-gray-200 text-center">
                <h1 className="font-bold">Pagamento recusado</h1>
              </div>
              <p className="text-sm text-center mt-2">
                Infelizmente o pagamento por cartão o foi recusado. Tente
                novamente com outro cartão o ou escolha a opção de pagamento via
                Pix.
              </p>
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleOpenRecusedChange}
                  className="w-[48%] h-full bg-[#1FBB70] !rounded-[3px] font-[900] tracking-wider right-5"
                >
                  Pagar com Pix
                </Button>
                <Button
                  onClick={handleOpenRecusedChange}
                  className="w-[48%] h-full bg-[#1FBB70] !rounded-[3px] font-[900] tracking-wider left-5"
                >
                  Tentar com outro cartão
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </FormProvider>
    );
  }
);

export default CardForm;
