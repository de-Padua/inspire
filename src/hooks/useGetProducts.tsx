import React, { useState } from "react";
import { product } from "@/types";
export default function useGetProducts() {

  const [result, setResult] = useState<product[] | null>(null);

  React.useEffect(() => {
    async function fetchProductsList() {
      try {
        const response = await fetch("https://inspire-backend2.vercel.app/products", {
          method: "GET",
          credentials: "include",

        });

        const json = await response.json();
        // console.log(json);
        setResult(json);
      } catch (error) {}
    }
    fetchProductsList();
  }, []);



  return result;
}
