import React from "react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app";
import useProductOffer from "@/hooks/useProductOffer";
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import { useParams } from "next/navigation";

const UpsellItem: React.FC = () => {
  const { offer, setOffer } = useAppContext();

  const params = useParams();
  const loja = params.loja;

  const { productOffer } = useProductOffer(loja);

  if (!productOffer) return null;

  const price = productOffer.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const discountMultiplier = 1 - productOffer.percent / 100;
  const discountedPrice = productOffer.price * discountMultiplier;

  const priceWithDiscount = discountedPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleAddOffert = (ev: React.MouseEvent) => {
    ev.preventDefault();
    setOffer(!offer);
  };

  return (
    <div className="center mb-5 pb-7  app_sm:h-auto relative text-text gap-2 bg-[#292929] p-3 h-[160px] border-[2px] transition-all cursor-pointer upsell border-dashed pt-7 border-main_segundary !bg-[#71acfa3b] col-span-2 !justify-start bg-formbackground mt-3 rounded-[8px] w-full">
      <img
        src={productOffer.image}
        alt="Product"
        className="w-[110px] h-[110px] object-cover rounded-lg app_sm:w-[80px] app_sm:h-[80px]"
      />

      <div className="center-col !items-start !justify-start ml-2 h-full app_sm:w-full">
        <span className=" font-medium !text-[14px] max-w-[100%] whitespace-nowrap app_sm:whitespace-normal">
          {productOffer.name}
        </span>
        <span className="mt-3 font-black text-[13px] line-through text-[#fc5959] font-poppins_light">
          {price}
        </span>
        <span className=" text-[18px] font-black -mt-1 text-[#2e831d] font-poppins_light">
          {priceWithDiscount}
        </span>
        <Button
          onClick={(ev) => {
            handleAddOffert(ev);
          }}
          className="absolute bottom-3 font-[900] text-[14px] uppercase font-poppins_black bg-[#71acfaea] h-[50px] app_sm:w-[210px] !px-0 hover:bg-primary app_sm:absolute app_sm:scale-75 !right-0 app_sm:bottom-[-25px] app_sm:mt-0"
        >
          <div className="!min-h-[20px] !min-w-[20px] mr-1 center bg-white rounded-sm border border-solid border-[#06418d]">
            {offer && <CheckIcon className="fill-[#84fc55]" />}
          </div>
          {offer ? "Remover Oferta" : "Pegar Oferta"}
        </Button>
      </div>
    </div>
  );
};

export default UpsellItem;
