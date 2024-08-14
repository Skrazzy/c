"use client";

import { useAppContext } from "@/context/app";
import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import useProduct from "@/hooks/useProduct";
import useProductOffer from "@/hooks/useProductOffer";

const Cart: React.FC<{ loja: any }> = ({ loja }) => {
  const { offer, isFrete, setTotal } = useAppContext();
  const { product } = useProduct(loja);
  const { productOffer } = useProductOffer(loja);

  // Calcule o total apenas se `product` existir
  const total = useMemo(() => {
    if (!product) return 0;

    let discountedPrice = 0;
    if (offer && productOffer) {
      const discountMultiplier = 1 - productOffer.percent / 100;
      discountedPrice = productOffer.price * discountMultiplier;
    }

    return (
      (offer && productOffer
        ? product.price + discountedPrice
        : product.price) + (isFrete ? isFrete.price : 0)
    );
  }, [product, offer, productOffer, isFrete]);

  useEffect(() => {
    if (total > 0) {
      setTotal(total);
    }
  }, [total, setTotal]);

  if (!product || !productOffer) return null;

  const price = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const discountMultiplier = 1 - productOffer?.percent / 100;
  const discountedPrice = productOffer?.price * discountMultiplier;

  const totalWithOffer = product.price + discountedPrice;

  const priceOffer = totalWithOffer.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const priceWithDiscount = discountedPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const totalFormatted = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const animationProps = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="center-col text-text !items-start bg-white rounded-[8px] gap-4 gap-y-2 p-4 h-fit app_md:w-full mt-3 app_md:px-0 app_sm:w-full app_sm:px-0">
      <h1 className="text-text font-poppins pl-3">Seu carrinho</h1>

      <div className="center relative gap-2 p-3 h-[120px] !justify-start bg-formbackground mt-3 rounded-[8px] w-full">
        <img
          src={product.image}
          alt="Product"
          className="w-[60px] h-[60px] object-cover rounded-lg"
        />

        <div className="center-col !items-start !justify-between ml-2 w-full h-full ">
          <span className="font-medium max-w-[80%] app_sm:hidden mt-4">
            {product.name}
          </span>
          <span className="font-medium max-w-[80%] hidden app_sm:block mt-4">
            {product.name}
          </span>
          {/* <span className="text-[16px] font-poppins_light">{price}</span> */}
          <span className="absolute bottom-[50%] right-5">1 Un.</span>
        </div>
      </div>

      {offer && productOffer && (
        <motion.div
          initial={animationProps.initial}
          animate={animationProps.animate}
          exit={animationProps.exit}
          transition={animationProps.transition}
          className="center relative gap-2 p-3 h-[120px] !justify-start bg-formbackground rounded-[8px] w-full"
        >
          <img
            src={productOffer.image}
            alt="Product Offer"
            className="w-[60px] h-[60px] object-cover rounded-lg"
          />

          <div className="center-col !items-start !justify-between ml-2 h-full">
            <span className="font-medium max-w-[80%]">{productOffer.name}</span>
            {/* <span className="text-[16px] font-poppins_light">
              {priceWithDiscount}
            </span> */}
            <span className="absolute bottom-10 right-5">1 Un.</span>
          </div>
        </motion.div>
      )}

      <div className="center relative gap-2 p-3 h-auto app_sm:py-0 mt-4 !justify-start bg-formbackground rounded-[8px] w-full">
        <div className="center-col !items-start !justify-between h-full w-full">
          <ul className="w-full space-y-2 pr-2 mt-4 pb-2 border border-solid border-transparent border-b-[#cccccc]">
            {/* <li className="opacity-80 list-none font-poppins center w-full !justify-between">
              <span className="font-medium app_sm:max-w-[80%] app_sm:whitespace-normal whitespace-nowrap">
                1x {product.name}
              </span>
              <span className="text-[16px] font-poppins_light">{price}</span>
            </li>
            {offer && productOffer && (
              <li className="opacity-80 list-none font-poppins center w-full !justify-between">
                <span className="font-medium app_sm:max-w-[80%] app_sm:whitespace-normal whitespace-nowrap">
                  1x {productOffer.name}
                </span>
                <span className="text-[16px] font-poppins_light">
                  {priceWithDiscount}
                </span>
              </li>
            )} */}
            <li className="opacity-80 list-none font-poppins center w-full !justify-between">
              <span className="font-medium whitespace-nowrap">Subtotal</span>
              <span className="text-[16px] text-[#0a0a0a] font-poppins_light">
                {offer ? priceOffer : price}
              </span>
            </li>
            {isFrete ? (
              <li className="opacity-80 list-none font-poppins center w-full !justify-between">
                <span className="font-medium whitespace-nowrap">
                  Frete {isFrete.tipo} | {isFrete.tempo}
                </span>
                <span className="text-[16px] text-[#173d14] font-poppins_light">
                  {isFrete.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </li>
            ) : (
              <li className="opacity-80 list-none font-poppins center w-full !justify-between">
                <span className="font-medium whitespace-nowrap">Frete</span>
                <span className="text-[16px] text-[#173d14] font-poppins_light">
                  -
                </span>
              </li>
            )}
          </ul>
          <div className="opacity-80 mt-5 font-poppins center w-full pr-2 !justify-between">
            <span className="font-poppins whitespace-nowrap">Total</span>
            <span className="text-[16px] font-poppins">{totalFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
