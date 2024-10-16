"use client";
import { useEffect, useState } from "react";

interface UserCardProps {
  Token: string | undefined;
}
const UserCardProduct = ({ Token }: UserCardProps) => {
  const [countProduct, setCountProduct] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/product");
        if (!res.ok) {
          throw new Error("Faild fetch product");
        }
        const data = await res.json();
        const confirmedProducts = data.filter(
          (product: any) => product.censor === true
        );
        setCountProduct(confirmedProducts.length);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div className="rounded-2xl odd:bg-teal-200 even:bg-green-200 p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4">{countProduct}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">Sản phẩm</h2>
    </div>
  );
};

export default UserCardProduct;
