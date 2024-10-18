"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaAngleDoubleRight, FaSearchLocation } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";

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
  productTypeId: number;
  productImages: ProductImage[];
  comments: string[];
  censor: boolean;
}

interface ProductType {
  id: number;
  productType_Name: string;
}

interface NewProductProps {
  Token: string | undefined;
}

interface UserInfo {
  id: number;
  fullName: string;
  userId: string;
}
interface UserInfo {
  username: string;
  email: string;
  roles: string[];
}
const NewProduct = ({ Token }: NewProductProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          "https://localhost:7146/api/product"
        );
        const productTypeResponse = await fetch(
          "https://localhost:7146/api/product-type"
        );
        const userInfoResponse = await fetch(
          "https://localhost:7146/api/users-information"
        );
        if (
          !productResponse.ok ||
          !productTypeResponse.ok ||
          !userInfoResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const productData = await productResponse.json();
        const productTypeData = await productTypeResponse.json();
        const userInfoData = await userInfoResponse.json();
        setProducts(productData);
        setProductTypes(productTypeData);
        setUserInfo(userInfoData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
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
    fetchUser();
  }, [Token]);
  const getProductTypeName = (productTypeId: number) => {
    const productType = productTypes.find((type) => type.id === productTypeId);
    return productType ? productType.productType_Name : "Unknown";
  };

  const findUserForProduct = (userId: string) => {
    return userInfo.find((user) => user.userId === userId);
  };
  const handleAddToCart = async (product: Product) => {
    if (!Token) {
      router.push("/login");
      return;
    }
    if (roles.includes("Creator")) {
      alert("Nhà cung cấp không có quyền đặt hàng");
      return;
    }
    const orderDetailData = {
      orderId: 0,
      productId: product.id,
      quantity: 1,
      unitPrice: 0,
    };
    try {
      const createOrderResponse = await fetch(
        "https://localhost:7146/api/admin/orders-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(orderDetailData),
        }
      );
      if (!createOrderResponse.ok) {
        throw new Error(`Failed : ${createOrderResponse.statusText}`);
      }
      alert("Add product success");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="container w-full py-8 px-36">
        <div className="flex flex-row justify-between mb-10">
          <div className="text-3xl font-bold text-left mb-6 w-2/5">
            <h4>Sản phẩm mới</h4>
            <div className="pt-10">
              <span className="text-teal-300">---------</span>
            </div>
          </div>
          <div className="text-left text-gray-500 mb-12 w-2/5 text-lg">
            <p>
              Giúp người tiêu dùng cập nhật sản phẩm mới nhất một cách nhanh
              chóng.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products
            .filter((product) => product.censor === true)
            .slice(0, 6)
            .map((product) => {
              const matchingUser = findUserForProduct(product.userId);
              const userName = matchingUser
                ? matchingUser.fullName
                : "Unknown User";

              return (
                <div className="bg-white border shadow-inner shadow-gray-200 rounded-2xl overflow-hidden">
                  <div className="p-8">
                    <img
                      src={
                        product.productImages &&
                        product.productImages.length > 0
                          ? `https://localhost:7146/Resources/${product.productImages[0]?.images}`
                          : `/images/server/default.jpg`
                      }
                      alt={product.product_Name}
                      className="w-[350px] h-[200px] rounded-2xl"
                    />
                  </div>

                  <div className="p-4">
                    <Link
                      key={product.id}
                      href={`/product/search-product/${product.product_Name.replaceAll(
                        " ",
                        "-"
                      )}?Id=${product.id}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center text-yellow-500">
                          <FiStar />
                          <span className="ml-1 font-bold">
                            {product.rating}
                          </span>
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
                        {userName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Loại sản phẩm:{" "}
                        {getProductTypeName(product.productTypeId)}
                      </p>
                    </Link>
                    <div className="flex mt-2 justify-between mx-4">
                      <p className="text-teal-500 font-bold text-lg mt-2">
                        {product.price.toLocaleString("en-US")}đ
                      </p>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-teal-500 text-white py-2 px-4 rounded-full ml-14 hover:bg-teal-600"
                      >
                        Đặt ngay
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex justify-center mt-8">
          <Link href={"/product"}>
            <button className="border flex bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100">
              Xem tất cả <FaAngleDoubleRight className="mt-1 ml-2" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
