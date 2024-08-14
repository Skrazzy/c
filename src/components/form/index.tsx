"use client";

import React, { forwardRef } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/inputField";
import SelectField from "@/components/selectField";

import { ContactIcon } from "lucide-react";
import { useStepper } from "../ui/stepper";

import { CheckIcon, BadgeCheckIcon } from "lucide-react";

const schema = z.object({
  billingFirstName: z
    .string({ message: "Insira o nome do titular da cobrança" })
    .min(1, { message: "Nome é obrigatório" }),
  billingCPF: z
    .string({ message: "Insira o CPF do titular da cobrança" })
    .min(1, { message: "CPF é obrigatório" }),
  billingEmail: z
    .string({ message: "Insira o email do titular da cobrança" })
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Endereço de email inválido" }),
  billingPhoneNumber: z
    .string({ message: "Insira o número de telefone" })
    .min(1, { message: "Número de telefone é obrigatório" }),
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  billingFirstName: "",
  billingCPF: "",
  billingEmail: "",
  billingPhoneNumber: "",
};

interface FormProps {
  onSubmitSuccess: () => void;
}

const FormComponent = forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmitSuccess }, ref) => {
    const methods = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues,
    });

    const { nextStep } = useStepper();

    const handleSave = (data: any) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data));
      }
    };

    const onSubmit = (data: FormData) => {
      onSubmitSuccess();
      handleSave(data);
      nextStep();
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
            <h1 className="font-poppins_light text-text font-[300]">
              Informações de Pessoais
            </h1>
          </div> */}
          <InputField
            name="billingFirstName"
            label="Nome e Sobrenome"
            placeholder="Nome Completo"
            validationSchema={schema.shape.billingFirstName}
          />

          <InputField
            name="billingCPF"
            label="CPF"
            mask="___.___.___-__"
            placeholder="123.456.789.12"
            className="app_sm:col-span-2"
            validationSchema={schema.shape.billingCPF}
          />
          <InputField
            name="billingEmail"
            label="Email"
            placeholder="email@email.com"
            className="app_sm:col-span-2"
            validationSchema={schema.shape.billingEmail}
          />

          <InputField
            name="billingPhoneNumber"
            label="Número de Telefone"
            placeholder="(99) 99999-9999"
            mask="(__) _____-____"
            className="app_sm:col-span-2"
            validationSchema={schema.shape.billingPhoneNumber}
          />
          <div className="col-span-2 mt-5 border-dashed border-[2px] border-[#E2E8F0] p-4 rounded-[8px]">
            <h1 className="mb-4">
              Usamos seus dados de forma 100% segura para garantir a sua
              satisfação:
            </h1>
            <ul className="w-full space-y-1">
              <li className="center w-full !justify-start opacity-70 text-[14px]">
                <img
                  src="https://pay.compreseguro.digital/assets/img/checkmarkSecurity.svg"
                  className="mr-2"
                />
                Enviar o seu comprovante de compra e pagamento;
              </li>
              <li className="center w-full !justify-start opacity-70 text-[14px]">
                <img
                  src="https://pay.compreseguro.digital/assets/img/checkmarkSecurity.svg"
                  className="mr-2"
                />
                Ativar a sua garantia de devolução caso não fique satisfeito;
              </li>
              <li className="center w-full !justify-start opacity-70 text-[14px]">
                <img
                  src="https://pay.compreseguro.digital/assets/img/checkmarkSecurity.svg"
                  className="mr-2"
                />
                Acompanhar o andamento do seu pedido;
              </li>
            </ul>
          </div>
        </form>
      </FormProvider>
    );
  }
);

export default FormComponent;
