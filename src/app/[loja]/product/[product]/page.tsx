"use client";

import Header from "@/components/header";
import OffertAdd from "@/components/ofertaadd";
import { useProductActions } from "@/hooks/useProductSell";
import axios from "axios";

import { NextPage } from "next";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const OfertaPage = ({ params }: { params: { product: string } }) => {
  const params2 = useParams();
  const loja = params2.loja;

  const { getProductById } = useProductActions(loja);
  const searchParams = useSearchParams();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const productId = searchParams.get("product");
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(params.product);
        console.log(params.product);
        if (productData) {
          setProduct(productData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [getProductById, productId]);

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
        phone: userData.billingPhoneNumber,
        docType: "cpf",
        docNumber: userData.billingCPF,
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
        ta
      );

      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleClick = () => {
    submitApi(product);
  };

  const handleClick2 = () => {
    submitApi(product);
    router.replace("/");
  };

  return (
    <div className="flex flex-col font-poppins items-center justify-center mt-10">
      <h1 className="text-[30px] font-[600]">Tem Certeza?</h1>
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-[18px] font-[400] text-[#292929]">
          Agora voce tem direito <strong> 10% de desconto </strong>a mais sobre
          o preço do produto.
        </p>
        <p className="text-[18px] font-[400] text-[#292929] mt-3">
          Aproveite essa oferta para adquirir o seu produto e ter um{" "}
          <strong> desconto de 40%!</strong>
        </p>
        <p className="text-[18px] font-[400] text-[#292929] mt-3">
          Simplesmente clique em <strong>Pegar Oferta</strong> e aproveite o
          desconto!
        </p>
      </div>
      {product && (
        <OffertAdd
          data={product}
          onClick={handleClick}
          onClickRemove={handleClick2}
        />
      )}
    </div>
  );
};

export default OfertaPage;
