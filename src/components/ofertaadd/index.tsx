import React from "react";
import { Button } from "@/components/ui/button";

const OffertAdd: React.FC<{ data: any; onClick: any; onClickRemove: any }> = ({
  data,
  onClick,
  onClickRemove,
}) => {
  return (
    <div className="center app_sm:center-col pb-4 app_sm:h-auto relative text-text gap-2 bg-[#292929] p-3 h-[260px] border-[2px] transition-all cursor-pointer upsell border-dashed pt-7 border-main_segundary col-span-2 !justify-start bg-formbackground mt-3 rounded-[8px] w-[96%]">
      <img
        src={data.image}
        alt="Product"
        className="w-[110px] h-[110px] object-cover rounded-lg app_sm:w-full app_sm:h-auto"
      />

      <div className="center-col !items-start !justify-start ml-2 h-full app_sm:w-full">
        <span className=" font-medium max-w-[100%]">{data.name}</span>
        <span className=" font-light opacity-85 max-w-[100%]">{data.desc}</span>
        <span className="mt-3 text-[13px] line-through text-[#fc5959] font-poppins_light">
          {data.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
        <span className=" text-[18px] text-[#2e831d] font-poppins_light">
          {data.priceDescont.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>
      <div className="w-full space-y-2 center-col">
        <Button
          onClick={() => onClick(data)}
          className=" bg-[#2e831d] w-[240px] hover:bg-[#2e831d] h-[50px] app_sm:static app_sm:w-full app_sm:mt-4"
        >
          Pegar Oferta
        </Button>
        <Button
          onClick={() => onClickRemove(data)}
          className=" bg-[#fc5959] h-[50px] w-[240px]  app_sm:static app_sm:w-full app_sm:mt-4"
        >
          Não quero oferta
        </Button>
      </div>
    </div>
  );
};

export default OffertAdd;
