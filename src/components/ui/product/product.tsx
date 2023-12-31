"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Badge } from "../badge";
import useGetProductsById from "@/hooks/useGetProductById";
import { useParams } from "next/navigation";
import { Separator } from "../separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCartStore } from "@/store/store";
import { Button } from "../button";
import {
  Plus,
  Minus,
  ThumbsUp,
  ThumbsDown,
  StarIcon,
  Star,
  Sparkle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { product } from "@/types";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProducRate from "@/components/producRates";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import item from "@/components/cart-items/item";

function Product() {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  let format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
  });

  const params: {
    id: string;
  } = useParams();

  const data: product | null = useGetProductsById(params.id);

  const cartItems = useCartStore((state) => state.cart);
  const addItem = useCartStore((state) => state.addItemToCart);
  const deleteItemFromArray = useCartStore((state) => state.deleteItemFromCart);
  const setNewCart = useCartStore((state) => state.setNewCart);
  const formSchema = z.object({
    color: z.string(),
    size: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!data) return;

    const newProduct = {
      colors: data.colors,
      size: values.size,
      selectedColor: values.color,
      quantity: quantity,
      price: data.price,
      id: data.id,
      sizes: data.sizes,
      name: data.title,
      _id: data._id,
      image: data.image[0],
    };

    const checkIfItemExistsInCart = cartItems.find(
      (item) => item.name === data.title
    );

    if (checkIfItemExistsInCart) {
      const newCart = cartItems;

      const index = newCart.findIndex((item) => item.name == newProduct.name);
      // Make sure the index is found, than replace it
      if (index > -1) {
        newCart.splice(index, 1, newProduct);
        setNewCart(newCart);
      }
    } else {
      addItem(newProduct);
    }
  }

  const handleSubtractQuantity = () => {
    if (!data) return;

    if (quantity === 1) return;
    setQuantity((oldValue) => oldValue - 1);
  };
  const handleIncreaseQuantity = () => {
    if (!data) return;

    if (data.quantity_available - quantity === 0) {
      return;
    }
    setQuantity((oldValue) => oldValue + 1);
  };

  const handleIndex = (direction: string) => {
    if (direction === "left") {
      if (currentImageIndex - 1 < 0) {
        setCurrentImageIndex(data!.image.length - 1);
      } else {
        setCurrentImageIndex((oldValue) => oldValue - 1);
      }
    }
    if (direction === "right") {
      if (currentImageIndex + 1 === data!.image.length) {
        setCurrentImageIndex(0);
      } else {
        setCurrentImageIndex((oldValue) => oldValue + 1);
      }
    }
  };

  if (!data) {
    return <div>Loading..</div>;
  }
  return (
    <>
      <div className="w-full flex items-center justify-center lg:h-screen ">
        <div className="w-full h-full flex  flex-col-reverse md:flex-row shadow-lg ">
          <div className=" w-full md:w-2/3 h-full flex items-center justify-center  ">
            <div className="w-10/12  hidden md:flex   items-start justify-center ">
              <div className="h-full ">
                <ScrollArea className="h-full w-full p-2 mt-2 md:w-[160px] ">
                  {data.image.map((i, index) => {
                    return (
                      <Image
                        onClick={() => {
                          setCurrentImageIndex(index);
                        }}
                        src={i}
                        alt={i}
                        width={10000}
                        height={1000}
                        className="w-full h-full object-contain my-1 cursor-pointer"
                      />
                    );
                  })}
                </ScrollArea>
              </div>
              <div className="w-full p-2 mt-3  items-center justify-center hidden md:flex">
                <Image
                  src={data.image[currentImageIndex]}
                  alt={data.title}
                  width={10000}
                  height={10000}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-full md:w-1/2  shadow-lg   p-10 lg:p-20   ">
            <Badge className="bg-green-400 my-2 ">Novo</Badge>

            <h2 className="text-2xl mb-2 font-semibold space-x-3">
              {data.title}
            </h2>
            <div className="w-10/12  md:hidden  items-start justify-center  ">
              <div className="h-full ">
                <ScrollArea className="h-full w-full p-2 mt-2 md:w-[160px] ">
                  {data.image.map((i, index) => {
                    return (
                      <Image
                        onClick={() => {
                          setCurrentImageIndex(index);
                        }}
                        src={i}
                        alt={i}
                        width={10000}
                        height={10000}
                        className="w-full h-full object-contain my-1 cursor-pointer"
                      />
                    );
                  })}
                </ScrollArea>
              </div>
              <div className="w-full h-full  items-center justify-center hidden md:flex">
                <Image
                  src={data.image[currentImageIndex]}
                  alt={data.title}
                  width={10000}
                  height={10000}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <p className="text-xs font-thin">#{data._id}</p>
            <p className="text-xs">{data.description}</p>

            <div className="flex items-start flex-col ">
              {" "}
              <p className="text-2xl my-1 font-bold mr-3">
                {format.format(data.price)}
              </p>
            </div>
            <Separator className="my-4 " />
            <Form {...form} key={data._id}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Cores disponíveis</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <RadioGroup
                            className="w-full"
                            defaultValue={undefined}
                            onValueChange={field.onChange}
                          >
                            <div className="flex items-center space-x-2">
                              {data.colors.map((color) => {
                                return (
                                  <div
                                    style={{
                                      backgroundColor: color,
                                    }}
                                    className="h-5 w-5 flex items-center justify-center px-5 py-5 border"
                                  >
                                    {" "}
                                    <RadioGroupItem
                                      className="border-none w-10 h-10  rounded-none  text-2xl  "
                                      value={color}
                                      id={color}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Escolha um tamanho</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <RadioGroup
                            className="w-full"
                            onValueChange={field.onChange}
                          >
                            <div className="flex items-center space-x-2">
                              {data.sizes.map((size) => {
                                return (
                                  <div className="h-5 w-5 flex items-center justify-center px-5 py-5 relative ">
                                    <RadioGroupItem
                                      className=" "
                                      value={size}
                                      id={size}
                                    />
                                    <p className="absolute -z-10">{size}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </RadioGroup>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div>
                  <FormLabel className="mb-5"> Quantidade</FormLabel>
                  <div className="border h-full  w-fit flex justify-start items-center">
                    <div
                      onClick={() => {
                        handleSubtractQuantity();
                      }}
                      className="px-1 py-1  h-full  bg-neutral-900 cursor-pointer"
                    >
                      <Minus className="text-muted text-sm " />
                    </div>
                    <div className="px-2 py-1 ">
                      <p className="mx-2 text-sm">{quantity}</p>
                    </div>
                    <div
                      className="px-1 py-1 bg-neutral-900 cursor-pointer"
                      onClick={() => {
                        handleIncreaseQuantity();
                      }}
                    >
                      <Plus className="text-muted" />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold">Produtos disponíveis</h2>
                  <p
                    className={
                      data?.quantity_available === 0
                        ? "text-red-400"
                        : "text-sm"
                    }
                  >
                    {data.quantity_available}
                  </p>
                </div>
                <div>
                  <h2 className="font-semibold">Compras realizadas</h2>
                  <p className="text-sm">{data.buys}</p>
                </div>
                <Button
                  className="w-full"
                  type="submit"
                  onClick={() => {}}
                  disabled={data.quantity_available < 1 ? true : false}
                >
                  Adicionar ao carrinho
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;

/*   <div className="w-full flex items-center justify-center">
        <div className=" h-full  w-4/6 p-2 flex items-center justify-start flex-col ">
          <h2 className="text-l w-full g font-bold text-muted-foreground  mb-2  p-2">
            Avaliação de clientes
          </h2>
          <div className="w-full p-5 py-6 flex items-center justify-normal border my-2">
            <h2 className="">Media de notas :</h2>

            <div className=" ml-2  flex items-center justify-center">
              <p>{data.rating.rate}</p>
            </div>
            <div>
              <div className="mx-2 flex items-center justify-center">
                {Array.from(new Array(data.rating.rate)).map((i) => {
                  return (
                    <>
                      <Sparkle
                        size={20}
                        color="#f9d423"
                        strokeWidth={0.5}
                        fill="#f9d423"
                      />
                    </>
                  );
                })}
              </div>
            </div>
            <div>
              <p> de {data.rating.count} avaliações</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {Array.from(new Array(3)).map((i) => {
              return (
                <div className="w-full border p-5 ">
                  <div className="flex">
                    <p className="text-neutral-800 text-sm font-semibold ">
                      Antônio de Pádua
                    </p>

                    <div className="mx-2">
                      <Badge className="bg-green-500">
                        <ThumbsUp size={14} />
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between  h-full ">
                    <p className="text-sm my-2 ">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Consequuntur, odio quidem modi dolores earum nihil aperiam
                      consequatur. Vitae incidunt iusto ab quidem laborum
                      voluptas odio animi explicabo cupiditate, voluptate dolor.
                    </p>
                  </div>
                </div>
              );
            })}
            {Array.from(new Array(10)).map((i) => {
              return (
                <div className="w-full border p-5 ">
                  <div className="flex">
                    <p className="text-neutral-800 text-sm font-semibold ">
                      Antônio de Pádua
                    </p>

                    <div className="mx-2">
                      <Badge className="bg-green-500">
                        <ThumbsUp size={14} />
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between  h-full ">
                    <p className="text-sm my-2 ">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Consequuntur, odio quidem modi dolores earum nihil aperiam
                      consequatur. Vi iusto ab quidem laborum voluptas odio
                      animi explicabo cupiditate, voluptate dolor.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div> */
