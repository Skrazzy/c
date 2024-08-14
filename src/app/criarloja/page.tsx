"use client";

import React, { useRef } from "react";

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
import { useProductActions } from "@/hooks/useProductSell";

function TabsDemo() {
  const { createNewColorDoc } = useColors("");
  const { createNewLogoDoc } = useLogo("");
  const { createNewProductDoc } = useProduct("");
  const { createNewFreteDoc } = useFrete("");
  const { createNewProductOfferDoc } = useProductOffer("");
  const { createNewTextDoc } = useText("");
  const { products, createNewProductUpDoc } = useProductActions("");

  const nomedalojaRef = useRef<HTMLInputElement>(null);

  const handleCreateConfig = (e: any) => {
    e.preventDefault();

    if (!nomedalojaRef.current?.value) return;

    const formElements = e.target.form.elements;
    const config: { [key: string]: any } = {};

    Array.from(formElements).forEach((element: any) => {
      if (element.id) {
        config[element.id as string] = element.value;
      }
    });

    const colors = {
      appbackground: config.appbackground,
      formbackground: config.formbackground,
      main: config.main,
      main_segundary: config.main_segundary,
      pag: config.pag,
      text: config.text,
      text_segundary: config.text_segundary,
    };

    console.log(config);

    createNewColorDoc(nomedalojaRef.current?.value, colors);
    createNewTextDoc(nomedalojaRef.current?.value, config.text_header);
    createNewLogoDoc(nomedalojaRef.current?.value, config.image);
  };

  const handleCreateFrete = (e: any) => {
    e.preventDefault();

    if (!nomedalojaRef.current?.value) return;

    const formElements = e.target.form.elements;
    const config: { [key: string]: any } = {};

    Array.from(formElements).forEach((element: any) => {
      if (element.id) {
        config[element.id as string] = element.value;
      }
    });

    const price = Number(config.price);

    createNewFreteDoc(nomedalojaRef.current?.value, { ...config, price });
  };

  const handleCreateProduct = (e: any) => {
    e.preventDefault();

    if (!nomedalojaRef.current?.value) return;

    const formElements = e.target.form.elements;
    const config: { [key: string]: any } = {};

    Array.from(formElements).forEach((element: any) => {
      if (element.id) {
        config[element.id as string] = element.value;
      }
    });

    const price = Number(config.price);

    createNewProductDoc(nomedalojaRef.current?.value, { ...config, price });
  };

  const handleCreateProductOffer = (e: any) => {
    e.preventDefault();

    if (!nomedalojaRef.current?.value) return;

    const formElements = e.target.form.elements;
    const config: { [key: string]: any } = {};

    Array.from(formElements).forEach((element: any) => {
      if (element.id) {
        config[element.id as string] = element.value;
      }
    });

    const price = Number(config.price);
    const percent = Number(config.percent);

    createNewProductOfferDoc(nomedalojaRef.current?.value, {
      ...config,
      price,
      percent,
    });
  };

  const handleCreateProductUp = (e: any) => {
    e.preventDefault();

    if (!nomedalojaRef.current?.value) return;

    const formElements = e.target.form.elements;
    const config: { [key: string]: any } = {};

    Array.from(formElements).forEach((element: any) => {
      if (element.id) {
        config[element.id as string] = element.value;
      }
    });

    const price = Number(config.price);
    const priceDescont = Number(config.priceDescont);

    createNewProductUpDoc(nomedalojaRef.current?.value, {
      ...config,
      price,
      priceDescont,
    });
  };

  return (
    <Tabs defaultValue="product" className="w-[500px] config">
      <input
        className="w-full outline-none rounded-[5px] h-[55px] my-3 pl-2 text_segundary"
        name="id"
        ref={nomedalojaRef}
        placeholder="Nome da Loja"
      />
      <TabsList className="grid w-full grid-cols-2 grid-rows-2 h-auto">
        <TabsTrigger value="product">Criar Produto</TabsTrigger>
        <TabsTrigger value="productup">Criar Oferta</TabsTrigger>
        <TabsTrigger value="config">Configurações</TabsTrigger>
        <TabsTrigger value="frete">Criar Frete</TabsTrigger>
        <TabsTrigger value="up" className="col-span-2">
          Criar Upsell
        </TabsTrigger>
      </TabsList>
      <TabsContent value="product">
        <form>
          <Card>
            <CardHeader>
              <CardTitle>Criar produto do checkout</CardTitle>
              <CardDescription>
                Escolha a imagem, nome e o preço do produto abaixo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="image" className="!font-poppins">
                  Imagem URL
                </Label>
                <Input id="image" className="!font-poppins text_segundary" />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="name" className="!font-poppins">
                  Nome
                </Label>
                <Input id="name" className="!font-poppins text_segundary" />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="price" className="!font-poppins">
                  Preço
                </Label>
                <Input id="price" className="!font-poppins text_segundary" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateProduct}>Criar</Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
      <TabsContent value="productup">
        <form>
          <Card>
            <CardHeader>
              <CardTitle>Criar produto oferta do checkout</CardTitle>
              <CardDescription>
                Escolha a imagem, nome, preço e % de desconto do produto abaixo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="image" className="!font-poppins">
                  Imagem URL
                </Label>
                <Input id="image" className="!font-poppins text_segundary" />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="name" className="!font-poppins">
                  Nome
                </Label>
                <Input id="name" className="!font-poppins text_segundary" />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="percent" className="!font-poppins">
                  Porcentagem
                </Label>
                <Input id="percent" className="!font-poppins text_segundary" />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="price" className="!font-poppins">
                  Preço
                </Label>
                <Input id="price" className="!font-poppins text_segundary" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateProductOffer}>Criar</Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
      <TabsContent value="config">
        <form>
          <Card className="overflow-y-scroll h-[600px]">
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
                <Input id="image" className="!font-poppins text_segundary" />
              </div>

              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="main" className="!font-poppins">
                  Cor principal
                </Label>
                <Input
                  id="main"
                  type="color"
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
                  className="!font-poppins text_segundary"
                />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="pag" className="!font-poppins">
                  Cor do Logo 2
                </Label>
                <Input
                  id="pag"
                  type="color"
                  className="!font-poppins text_segundary"
                />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="text_header" className="!font-poppins">
                  Text Header - Adicione * para texto em Negrito
                </Label>
                <Input
                  id="text_header"
                  type="text"
                  className="!font-poppins text_segundary min-h-[100px]"
                />
              </div>
              <CardFooter>
                <Button onClick={handleCreateConfig}>Criar</Button>
              </CardFooter>
            </CardContent>
          </Card>
        </form>
      </TabsContent>
      <TabsContent value="frete">
        <form>
          <Card>
            <CardHeader>
              <CardTitle>Configurações do frete</CardTitle>
              <CardDescription>Edite o frete pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="tipo" className="!font-poppins">
                  Tipo
                </Label>
                <Input id="tipo" className="!font-poppins text_segundary" />
              </div>

              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="tempo" className="!font-poppins">
                  Tempo
                </Label>
                <Input id="tempo" className="!font-poppins text_segundary" />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="price" className="!font-poppins">
                  Preço
                </Label>
                <Input id="price" className="!font-poppins text_segundary" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateFrete}>Criar Frete</Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
      <TabsContent value="up">
        <form>
          <Card>
            <CardHeader>
              <CardTitle>Criar produtos Upsell</CardTitle>
              <CardDescription>
                Escolha a imagem, nome, descrição e preço e preço descontado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="image" className="!font-poppins">
                  Imagem URL
                </Label>
                <Input id="image" className="!font-poppins text_segundary" />
              </div>

              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="name" className="!font-poppins">
                  Nome
                </Label>
                <Input id="name" className="!font-poppins text_segundary" />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="desc" className="!font-poppins">
                  Descrição
                </Label>
                <Input id="desc" className="!font-poppins text_segundary" />
              </div>
              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="price" className="!font-poppins">
                  Preço
                </Label>
                <Input id="price" className="!font-poppins text_segundary" />
              </div>

              <div className="space-y-1 !font-poppins text_segundary">
                <Label htmlFor="priceDescont" className="!font-poppins">
                  Preço Descontado
                </Label>
                <Input
                  id="priceDescont"
                  className="!font-poppins text_segundary"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateProductUp}>Adicionar</Button>
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
        </form>
      </TabsContent>
    </Tabs>
  );
}

export default function Page() {
  useColors("");

  return (
    <main className="w-full max-w-[1440px] bg-main !items-start pt-3 max-h-screen center overflow-y-hidden h-screen mx-auto font-poppins">
      <TabsDemo />
    </main>
  );
}
