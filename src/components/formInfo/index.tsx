"use client";

import React, { forwardRef, useState } from "react";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  Controller,
} from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/inputField";
import SelectField from "@/components/selectField";

import { ContactIcon } from "lucide-react";
import { useStepper } from "../ui/stepper";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import useFrete from "@/hooks/useFrete";
import { useAppContext } from "@/context/app";
import useFetchAddress from "@/hooks/useFetchFrete";

const schema = z.object({
  billingAddress: z
    .string({ message: "Insira o endereço de cobrança" })
    .min(1, { message: "Endereço é obrigatório" }),
  billingCountry: z
    .string({ message: "Selecione o país" })
    .min(1, { message: "País é obrigatório" }),
  billingState: z
    .string({ message: "Selecione o estado" })
    .min(1, { message: "Estado é obrigatório" }),
  billingCity: z
    .string({ message: "Insira a cidade" })
    .min(1, { message: "Cidade é obrigatória" }),
  billingPostalCode: z
    .string({ message: "Insira o código postal" })
    .min(1, { message: "Código postal é obrigatório" }),
  billingBairro: z
    .string({ message: "Insira o bairro" })
    .min(1, { message: "Bairro é obrigatório" }),
  billingNumero: z
    .string({ message: "Insira o numero" })
    .min(1, { message: "numero é obrigatório" }),
  billingComplement: z
    .string({ message: "Insira o complemento" })
    .min(1, { message: "Complemento é obrigatório" }),
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  billingAddress: "",
  billingCountry: "brasil",
  billingState: "BA",
  billingCity: "",
  billingPostalCode: "",
  billingComplement: "",
  billingBairro: "",
  billingNumero: "",
};

interface FormProps {
  onSubmitSuccess: () => void;
}

const FormShipping = forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmitSuccess }, ref) => {
    const methods = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues,
    });

    const params = useParams();
    const loja = params.loja;

    const { nextStep } = useStepper();
    const { isFrete, setIsFrete, total } = useAppContext();
    const { fetchAddress } = useFetchAddress();

    const [calculating, setCalculating] = React.useState(false);
    const [hasCep, setHasCep] = React.useState(false);

    const { frete } = useFrete(loja);

    const handleSave = (data: any) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("ship", JSON.stringify(data));
      }
    };

    const onSubmit = (data: FormData) => {
      onSubmitSuccess();
      handleSave(data);
      nextStep();
    };

    const handleCepChange = async (cep: string) => {
      const cleanedCep = cep.replace(/\D/g, "");

      if (cleanedCep.length < 8) {
        setHasCep(false);
        setCalculating(false);
      }

      if (cleanedCep.length === 8) {
        const address = await fetchAddress(cleanedCep);
        if (address) {
          methods.setValue("billingAddress", address.logradouro);
          methods.setValue("billingCity", address.localidade);
          methods.setValue("billingState", address.uf);
          methods.setValue("billingBairro", address.bairro);
        }
        methods.clearErrors();
        setHasCep(true);
      }
    };

    return (
      <FormProvider {...methods}>
        <form
          ref={ref}
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid grid-cols-2 w-full h-auto  auto-rows-min app_sm:!center-col bg-gray-300"
        >
          {/* <div className="col-span-2 center !justify-start space-x-4 my-3 mt-2">
            <ContactIcon
              className="text-main_segundary"
              size={32}
              strokeWidth={1}
            />
            <h1 className="font-poppins_light text-text font-[300]">Entrega</h1>
          </div> */}
          {/* <InputField
            name="billingPostalCode"
            label="Código Postal"
            className="app_sm:col-span-2"
            mask="_____-___"
            validationSchema={schema.shape.billingPostalCode}
          /> */}

          <Controller
            name="billingPostalCode"
            control={methods.control}
            render={({ field }) => (
              <InputField
                {...field}
                label="CEP"
                className="app_sm:col-span-2"
                mask="_____-___"
                placeholder="12345-678"
                validationSchema={schema.shape.billingPostalCode}
                onChange={(value) => handleCepChange(value)}
              />
            )}
          />

          <InputField
            name="billingAddress"
            placeholder="Rua, Avenida, Alameda"
            label="Endereço"
            className="app_sm:col-span-2"
            validationSchema={schema.shape.billingAddress}
          />

          <InputField
            name="billingNumero"
            placeholder="123"
            label="Numero"
            validationSchema={schema.shape.billingNumero}
            className="app_sm:col-span-2"
          />

          <InputField
            name="billingComplement"
            placeholder="Apartamento, prédio, andar, etc."
            label="Complemento"
            validationSchema={schema.shape.billingComplement}
            className="app_sm:col-span-2"
          />

          <InputField
            name="billingBairro"
            placeholder="Centro"
            label="Bairro"
            validationSchema={schema.shape.billingBairro}
            className="app_sm:col-span-2"
          />

          <InputField
            name="billingCity"
            placeholder="São Paulo"
            label="Cidade"
            validationSchema={schema.shape.billingCity}
            className="app_sm:col-span-2"
          />

          <SelectField
            name="billingState"
            label="Estado"
            options={[
              { value: "AC", label: "Acre" },
              { value: "AL", label: "Alagoas" },
              { value: "AP", label: "Amapá" },
              { value: "AM", label: "Amazonas" },
              { value: "BA", label: "Bahia" },
              { value: "CE", label: "Ceará" },
              { value: "DF", label: "Distrito Federal" },
              { value: "ES", label: "Espírito Santo" },
              { value: "GO", label: "Goiás" },
              { value: "MA", label: "Maranhão" },
              { value: "MT", label: "Mato Grosso" },
              { value: "MS", label: "Mato Grosso do Sul" },
              { value: "MG", label: "Minas Gerais" },
              { value: "PA", label: "Pará" },
              { value: "PB", label: "Paraíba" },
              { value: "PR", label: "Paraná" },
              { value: "PE", label: "Pernambuco" },
              { value: "PI", label: "Piauí" },
              { value: "RJ", label: "Rio de Janeiro" },
              { value: "RN", label: "Rio Grande do Norte" },
              { value: "RS", label: "Rio Grande do Sul" },
              { value: "RO", label: "Rondônia" },
              { value: "RR", label: "Roraima" },
              { value: "SC", label: "Santa Catarina" },
              { value: "SP", label: "São Paulo" },
              { value: "SE", label: "Sergipe" },
              { value: "TO", label: "Tocantins" },
            ]}
            validationSchema={schema.shape.billingState}
          />

          <SelectField
            name="billingCountry"
            label="País"
            options={[{ value: "brasil", label: "Brasil" }]}
            validationSchema={schema.shape.billingCountry}
          />

          {hasCep && (
            <div className="h-full center !items-end w-full">
              <Button
                onClick={(ev) => {
                  ev.preventDefault();
                  setCalculating(true);
                }}
                className="h-[50px] w-full col-span-2"
              >
                Calcular Frete
              </Button>
            </div>
          )}

          {calculating && (
            <div className="col-span-2 mt-4 space-y-3 app_sm:w-full">
              <h1>Opções de frete:</h1>
              <Card
                onClick={() =>
                  setIsFrete({
                    tipo: "Gratis",
                    tempo: "10 a 15 dias",
                    price: 0,
                  })
                }
                className="shadow-sm center cursor-pointer transition-all hover:brightness-[0.9] !justify-between font-poppins_light"
              >
                <CardHeader>
                  <CardTitle>Frete Gratis</CardTitle>
                </CardHeader>
                <CardContent className="center space-x-3 p-0 pr-3">
                  <span>10 a 15 Dias</span>
                  <span className="text-[#2fad24] font-poppins">Gratis</span>
                </CardContent>
              </Card>
              <Card
                onClick={() =>
                  setIsFrete({
                    tipo: frete?.tipo,
                    tempo: frete?.tempo,
                    price: frete?.price,
                  })
                }
                className="shadow-sm center cursor-pointer transition-all hover:brightness-[0.9] !justify-between font-poppins_light"
              >
                <CardHeader>
                  <CardTitle>{frete?.tipo}</CardTitle>
                </CardHeader>
                <CardContent className="center  space-x-3 p-0 pr-3">
                  <span>{frete?.tempo}</span>
                  <span className="text-[#2fad24] font-poppins">
                    {frete?.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      </FormProvider>
    );
  }
);

export default FormShipping;
