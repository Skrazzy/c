"use client";

import React, { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useColors from "@/hooks/useColors";
import useLogo from "@/hooks/useLogo";
import useProduct from "@/hooks/useProduct";
import useProductOffer from "@/hooks/useProductOffer";
import useFrete from "@/hooks/useFrete";
import useText from "@/hooks/useText";
import { Textarea } from "@/components/ui/textarea";
import { useProductActions } from "@/hooks/useProductSell";
import { TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";

function TabsDemo() {
  const params = useParams();
  const loja = params.loja;

  const { colors, updateColor } = useColors(loja);
  const { logoUrl, updateLogo } = useLogo(loja);
  const { product, updateProduct } = useProduct(loja);
  const { frete, updateFrete } = useFrete(loja);
  const { productOffer, updateProductOffer } = useProductOffer(loja);
  const { text, updateText } = useText(loja);

  const [colorName, setColorName] = useState("");
  const [colorValue, setColorValue] = useState("");

  const nameProductRef = useRef<HTMLInputElement>(null);
  const priceProductRef = useRef<HTMLInputElement>(null);
  const imageProductRef = useRef<HTMLInputElement>(null);

  const nameProductOfferRef = useRef<HTMLInputElement>(null);
  const priceProductOfferRef = useRef<HTMLInputElement>(null);
  const imageProductOfferRef = useRef<HTMLInputElement>(null);
  const percentProductOfferRef = useRef<HTMLInputElement>(null);

  const tipoFreteRef = useRef<HTMLInputElement>(null);
  const priceFreteRef = useRef<HTMLInputElement>(null);
  const tempoFreteRef = useRef<HTMLInputElement>(null);

  const handleColorChange =
    (colorName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      updateColor(colorName, event.target.value);
    };

  const handleProductChange = (event: React.MouseEvent) => {
    updateProduct({
      image: imageProductRef.current?.value,
      name: nameProductRef.current?.value,
      price: Number(priceProductRef.current?.value),
    });
  };

  const handleFreteChange = (event: React.MouseEvent) => {
    updateFrete({
      tipo: tipoFreteRef.current?.value,
      tempo: tempoFreteRef.current?.value,
      price: Number(priceFreteRef.current?.value),
    });

    // console.log({
    //   tipo: tipoFreteRef.current?.value,
    //   tempo: priceFreteRef.current?.value,
    //   price: Number(tempoFreteRef.current?.value),
    // });
  };

  const handleProductOfferChange = (event: React.MouseEvent) => {
    updateProductOffer({
      image: imageProductOfferRef.current?.value,
      name: nameProductOfferRef.current?.value,
      price: Number(priceProductOfferRef.current?.value),
      percent: Number(percentProductOfferRef.current?.value),
    });
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateText({ text: event.target.value });
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateLogo({ url: event.target.value });
  };
  const handleSave = () => {
    updateColor(colorName, colorValue);
    setColorName("");
    setColorValue("");
  };

  const { addProduct, products, removeProduct } = useProductActions(loja);

  const handleAddProductUpChange = (event: React.MouseEvent) => {
    addProduct({
      image: imageProductUpRef.current?.value,
      name: nameProductUpRef.current?.value,
      price: Number(priceProductUpRef.current?.value),
      desc: descProductUpRef.current?.value,
      priceDescont: Number(priceDescontProductUpRef.current?.value),
    });
  };

  const nameProductUpRef = useRef<HTMLInputElement>(null);
  const priceProductUpRef = useRef<HTMLInputElement>(null);
  const descProductUpRef = useRef<HTMLInputElement>(null);
  const imageProductUpRef = useRef<HTMLInputElement>(null);
  const priceDescontProductUpRef = useRef<HTMLInputElement>(null);

  if (!product) return null;

  const handleRemoveProductUpChange = (productId: string) => {
    removeProduct(productId);
    console.log("Product removed with ID: ", productId);
  };

  return (
    <Tabs defaultValue="product" className="w-[500px] config">
      <TabsList className="grid w-full grid-cols-2 grid-rows-2 h-auto">
        <TabsTrigger value="product">Editar Produto</TabsTrigger>
        <TabsTrigger value="productup">Editar Oferta</TabsTrigger>
        <TabsTrigger value="config">Configurações</TabsTrigger>
        <TabsTrigger value="frete">Frete</TabsTrigger>
        <TabsTrigger value="up" className="col-span-2">
          Adicionar Upsell
        </TabsTrigger>
      </TabsList>
      <TabsContent value="product">
        <Card>
          <CardHeader>
            <CardTitle>Editar produto do checkout</CardTitle>
            <CardDescription>
              Escolha a imagem, nome e o preço do produto abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="image" className="!font-poppins">
                Imagem URL
              </Label>
              <Input
                ref={imageProductRef}
                defaultValue={product.image}
                id="image"
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="name" className="!font-poppins">
                Nome
              </Label>
              <Input
                ref={nameProductRef}
                defaultValue={product.name}
                id="name"
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="price" className="!font-poppins">
                Preço
              </Label>
              <Input
                ref={priceProductRef}
                defaultValue={product.price}
                id="price"
                className="!font-poppins text_segundary"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProductChange}>Editar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="productup">
        <Card>
          <CardHeader>
            <CardTitle>Editar produto oferta do checkout</CardTitle>
            <CardDescription>
              Escolha a imagem, nome, preço e % de desconto do produto abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="image" className="!font-poppins">
                Imagem URL
              </Label>
              <Input
                id="image"
                defaultValue={productOffer?.image}
                ref={imageProductOfferRef}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="name" className="!font-poppins">
                Nome
              </Label>
              <Input
                id="name"
                defaultValue={productOffer?.name}
                ref={nameProductOfferRef}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="percent" className="!font-poppins">
                Porcentagem
              </Label>
              <Input
                id="percent"
                defaultValue={productOffer?.percent}
                ref={percentProductOfferRef}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="price" className="!font-poppins">
                Preço
              </Label>
              <Input
                id="price"
                defaultValue={productOffer?.price}
                ref={priceProductOfferRef}
                className="!font-poppins text_segundary"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProductOfferChange}>Editar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="config">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do checkout</CardTitle>
            <CardDescription>
              Escolha cores, tamanhos e imagens do checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="image" className="!font-poppins">
                Logo Url
              </Label>
              <Input
                id="image"
                defaultValue={logoUrl?.url}
                onChange={handleLogoChange}
                className="!font-poppins text_segundary"
              />
            </div>

            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="main" className="!font-poppins">
                Cor principal
              </Label>
              <Input
                id="main"
                type="color"
                defaultValue={colors.main || ""}
                onChange={handleColorChange("main")}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="appbackground" className="!font-poppins">
                Cor de fundo
              </Label>
              <Input
                id="appbackground"
                type="color"
                defaultValue={colors.appbackground || ""}
                onChange={handleColorChange("appbackground")}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="formbackground" className="!font-poppins">
                Cor de formulario
              </Label>
              <Input
                id="formbackground"
                type="color"
                defaultValue={colors.formbackground || ""}
                onChange={handleColorChange("formbackground")}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="main_segundary" className="!font-poppins">
                Cor Principal Segundario
              </Label>
              <Input
                id="main_segundary"
                type="color"
                defaultValue={colors.main_segundary || ""}
                onChange={handleColorChange("main_segundary")}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="text" className="!font-poppins">
                Cor do Texto
              </Label>
              <Input
                id="text"
                type="color"
                defaultValue={colors.text || ""}
                onChange={handleColorChange("text")}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="text_segundary" className="!font-poppins">
                Cor do Texto Segundario
              </Label>
              <Input
                id="text_segundary"
                type="color"
                defaultValue={colors.text_segundary || ""}
                onChange={handleColorChange("text_segundary")}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="cor-pag" className="!font-poppins">
                Cor do Logo 2
              </Label>
              <Input
                id="cor-pag"
                type="color"
                defaultValue={colors.pag || ""}
                onChange={handleColorChange("pag")}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="text_segundary" className="!font-poppins">
                Text Header - Adicione * para texto em Negrito
              </Label>
              <Textarea
                id="text_segundary"
                defaultValue={text?.text}
                onChange={(ev) => {
                  handleTextChange(ev);
                }}
                className="!font-poppins text_segundary min-h-[100px]"
              />
            </div>
          </CardContent>
          {/* <CardFooter>
            <Button onClick={handleSave}>Editar</Button>
          </CardFooter> */}
        </Card>
      </TabsContent>
      <TabsContent value="frete">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do frete</CardTitle>
            <CardDescription>Edite o frete pago</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="FreteTipo" className="!font-poppins">
                Tipo
              </Label>
              <Input
                id="FreteTipo"
                ref={tipoFreteRef}
                defaultValue={frete?.tipo}
                className="!font-poppins text_segundary"
              />
            </div>

            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="freteTempo" className="!font-poppins">
                Tempo
              </Label>
              <Input
                id="freteTempo"
                ref={tempoFreteRef}
                defaultValue={frete?.tempo}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="fretePrice" className="!font-poppins">
                Preço
              </Label>
              <Input
                id="fretePrice"
                ref={priceFreteRef}
                defaultValue={frete?.price}
                className="!font-poppins text_segundary"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFreteChange}>Editar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="up">
        <Card>
          <CardHeader>
            <CardTitle>Adicione produto Upsell</CardTitle>
            <CardDescription>
              Escolha a imagem, nome, descrição e preço e preço descontado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="image" className="!font-poppins">
                Imagem URL
              </Label>
              <Input
                id="image"
                ref={imageProductUpRef}
                className="!font-poppins text_segundary"
              />
            </div>

            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="name" className="!font-poppins">
                Nome
              </Label>
              <Input
                id="name"
                ref={nameProductUpRef}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="image" className="!font-poppins">
                Descrição
              </Label>
              <Input
                id="image"
                ref={descProductUpRef}
                className="!font-poppins text_segundary"
              />
            </div>
            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="percent" className="!font-poppins">
                Preço
              </Label>
              <Input
                id="percent"
                ref={priceProductUpRef}
                className="!font-poppins text_segundary"
              />
            </div>

            <div className="space-y-1 !font-poppins text_segundary">
              <Label htmlFor="price" className="!font-poppins">
                Preço Descontado
              </Label>
              <Input
                id="price"
                ref={priceDescontProductUpRef}
                className="!font-poppins text_segundary"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddProductUpChange}>Adicionar</Button>
          </CardFooter>
          <div className="w-[90%] mx-auto overflow-x-scroll overflow-y-hidden pb-3 max-h-[290px] center !justify-start space-x-2 ">
            {products.map((product) => (
              <Card
                key={product.id}
                className="!min-w-[300px] relative h-[240px]  !font-poppins text_segundary"
              >
                <CardHeader>
                  <CardTitle className="text-[11px]">
                    {product.name.substring(0, 20)}
                  </CardTitle>
                  <CardDescription>
                    {product.desc.substring(0, 20)}
                  </CardDescription>
                  <TrashIcon
                    className="absolute top-4 right-4 cursor-pointer"
                    onClick={() => handleRemoveProductUpChange(product.id)}
                  />
                </CardHeader>
                <CardContent className="center !justify-start space-x-3">
                  <img
                    src={product.image}
                    className="h-[110px]"
                    alt={product.name}
                  />
                  <div>
                    <p className="line-through text-[10px] text-[#fd4646]">
                      {product.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <p className=" text-[15px] text-[#64ff5e]">
                      {product.priceDescont.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default function Page() {
  const params = useParams();
  const loja = params.loja;
  useColors(loja);

  return (
    <main className="w-full max-w-[1440px] bg-main !items-start pt-3 max-h-screen center overflow-y-hidden h-screen mx-auto font-poppins">
      <TabsDemo />
    </main>
  );
}
