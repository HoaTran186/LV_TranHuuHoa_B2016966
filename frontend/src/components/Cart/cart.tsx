"use client";
import { useEffect, useState } from "react";

interface OrderProps {
  accessToken: string | undefined;
}
interface Order {}
interface ProductImage {
  id: number;
  images: string;
  productId: number;
}
interface Product {
  id: number;
  product_Name: string;
  userId: string;
  price: number;
  rating: number;
  quantity: number;
  productTypeId: number;
  productImages: ProductImage[];
  comments: string[];
}

interface ProductType {
  id: number;
  productType_Name: string;
}
interface UserInfo {
  id: number;
  fullName: string;
  age: number;
  job: string;
  address: string;
  phone: string;
  userId: string;
}
export default function Cart({ accessToken }: OrderProps) {
  const [error, setError] = useState<unknown>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5126/api/product");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const fetchProductType = async () => {
      try {
        const response = await fetch("http://localhost:5126/api/product-type");
        if (!response.ok) throw new Error("Failed to fetch product type");
        const data = await response.json();
        setProductTypes(data);
      } catch (error) {
        console.error("Error fetching product type:", error);
      }
    };
    fetchProducts();
    fetchProductType();
  });
  return (
    <div className="w-ful">
      <div className="mx-40 border rounded-3xl space-y-5">
        {products.map((product) => (
          <div key={product.id} className="flex mx-10 mt-24 rounded-3xl border">
            <div className="m-5">
              <img
                src={
                  product.productImages && product.productImages.length > 0
                    ? `http://localhost:5126/Resources/${product.productImages[0]?.images}`
                    : "/path-to-default-image.jpg"
                }
                alt={product.product_Name}
                className="rounded-3xl  h-[100px] w-[100px]"
              />
            </div>
            <div className="my-10">{product.product_Name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
