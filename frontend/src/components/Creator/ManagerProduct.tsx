"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

interface ManagerProductProps {
  Token: string | undefined;
}
interface ProductType {
  id: number;
  productType_Name: string;
}
interface UserInfo {
  username: string;
  email: string;
  roles: string[];
}
interface ProductImage {
  id: number;
  images: string;
  productId: number;
}
interface ProductUser {
  id: number;
  product_Name: string;
  origin: string;
  unique: string;
  apply: string;
  result: string;
  quantity: number;
  rating: number;
  price: number;
  productTypeId: number;
  productImages: ProductImage[];
  comments: string[];
}
export default function ManagerProduct({ Token }: ManagerProductProps) {
  const [roles, setRoles] = useState<string[]>([]);
  const [productType, setProductType] = useState<ProductType[]>([]);
  const [productUser, setProductUser] = useState<ProductUser[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user!");
        }
        const data: UserInfo = await res.json();
        setRoles(data.roles);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    const fetchProductType = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/product-type");
        if (!res.ok) {
          throw new Error("Failed to fetch product type!");
        }
        const data = await res.json();
        setProductType(data);
      } catch (error) {
        console.error("Error fetching product type:", error);
      }
    };
    const fetchProductUser = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/creator/products", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch product user!");
        }
        const data = await res.json();
        setProductUser(data);
      } catch (error) {
        console.error("Error fetching user product:", error);
      }
    };
    fetchUser();
    fetchProductType();
    fetchProductUser();
  }, []);
  const getProductTypeName = (productTypeId: number) => {
    const productTypes = productType.find((type) => type.id === productTypeId);
    return productTypes ? productTypes.productType_Name : "Unknown";
  };
  return (
    <div className="mx-48">
      <div className="flex justify-between h-24 items-center mx-4 px-4 my-10 mt-36 rounded-2xl">
        <div className="text-3xl font-bold">
          Quản lí sản phẩm của bạn
          <p className="text-teal-500">--------</p>
        </div>
        <div className="mt-7">
          <Link href={"/creator/upload"}>
            <Button className="rounded-full bg-teal-500 hover:bg-teal-700">
              Đăng bán sản phẩm
            </Button>
          </Link>
        </div>
      </div>
      {roles.includes("Creator") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productUser.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`/creator/edit/${product.product_Name.replaceAll(
                " ",
                "-"
              )}?Id=${product.id}`}
            >
              <div className="relative bg-white border shadow-inner shadow-gray-200 rounded-2xl overflow-hidden mb-5">
                <div className="p-8">
                  {/* <div className="absolute top-2 right-2 text-red-500 rounded-full border-2 cursor-pointer">
                    <IoIosCloseCircleOutline size={30} />
                  </div> */}
                  <img
                    src={
                      product.productImages && product.productImages.length > 0
                        ? `https://localhost:7146/Resources/${product.productImages[0]?.images}`
                        : `/images/server/default.jpg`
                    }
                    alt={product.product_Name}
                    className="w-[350px] h-[200px] rounded-2xl"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-yellow-500">
                      <FiStar />
                      <span className="ml-1 font-bold">{product.rating}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({product.comments.length} đánh giá)
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {product.product_Name}
                  </h3>
                  <p className="text-gray-500 flex">
                    <FaSearchLocation className="mt-1 mr-1" />
                  </p>
                  <p className="text-gray-500 text-sm">
                    Loại sản phẩm: {getProductTypeName(product.productTypeId)}
                  </p>
                  <div className="flex mt-2 justify-between mx-4">
                    <p className="text-teal-500 font-bold text-lg mt-2">
                      {product.price.toLocaleString("en-US")}đ
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {roles.includes("User") && (
        <div className="text-center border-2 mx-52 rounded-3xl h-40 items-center b mt-36 my-6 pt-14 text-2xl">
          Bạn không có quyền sử dụng chức năng này!!
        </div>
      )}
    </div>
  );
}
