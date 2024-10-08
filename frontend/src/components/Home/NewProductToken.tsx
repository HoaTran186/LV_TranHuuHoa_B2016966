"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaAngleDoubleRight, FaSearchLocation } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";
import NewProduct from "@/components/Home/NewProduct";

interface ProductImage {
  id: number;
  imagesName: string;
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
interface Order {
  id: number;
  userId: string;
  orderStatus: string;
  orderDate: string;
  shippedDate: string | null;
  totalAmount: number;
}
interface UserInfo {
  username: string;
  email: string;
  roles: string[];
}
const NewProductToken = ({ Token }: NewProductProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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
        if (productData.censor != false) {
          setProducts(productData);
          setProductTypes(productTypeData);
          setUserInfo(userInfoData);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductTypeName = (productTypeId: number) => {
    const productType = productTypes.find((type) => type.id === productTypeId);
    return productType ? productType.productType_Name : "Unknown";
  };

  const findUserForProduct = (userId: string) => {
    return userInfo.find((user) => user.userId === userId);
  };

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
    const fetchOrders = async () => {
      if (!Token) return;

      try {
        const ordersResponse = await fetch(
          "https://localhost:7146/api/user/orders",
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );

        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders");
        }

        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchUser();
    fetchOrders();
  }, [Token]);

  const handleAddToCart = async (product: Product) => {
    if (!Token) {
      router.push("/login");
      return;
    }
    let orderId: number | null = null;
    const existingOrder = orders.find(
      (order) => order.orderStatus === "Pending"
    );

    if (existingOrder) {
      orderId = existingOrder.id;
    } else {
      try {
        const data = {
          orderStatus: "Pending",
          orderDate: Date.now,
          totalAmount: 0,
        };
        const createOrderResponse = await fetch(
          "https://localhost:7146/api/user/orders",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify(data),
          }
        );
        if (!createOrderResponse.ok) {
          throw new Error(
            `Failed to create new order: ${createOrderResponse.statusText}`
          );
        }

        const newOrder = await createOrderResponse.json();
        orderId = newOrder.id;
        console.log(orderId);
      } catch (error: any) {
        console.error("Error creating new order:", error);
        alert(error.message || "An error occurred while creating a new order.");
        return;
      }
    }
    const orderDetailData = {
      orderId: orderId,
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
      {roles.includes("User") && (
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
            {products.slice(0, 6).map((product) => {
              const matchingUser = findUserForProduct(product.userId);
              const userName = matchingUser
                ? matchingUser.fullName
                : "Unknown User";

              return (
                <Link
                  key={product.id}
                  href={`/product/search-product/${product.product_Name.replaceAll(
                    " ",
                    "-"
                  )}?Id=${product.id}`}
                >
                  <div className="bg-white border shadow-inner shadow-gray-200 rounded-2xl overflow-hidden">
                    <div className="p-8">
                      <img
                        src={
                          product.productImages &&
                          product.productImages.length > 0
                            ? `https://localhost:7146/Resources/${product.productImages[0]?.imagesName}`
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
                      <div className="flex mt-2 justify-between mx-4">
                        <p className="text-teal-500 font-bold text-lg mt-2">
                          {product.price.toLocaleString("en-US")}đ
                        </p>
                        <Link href={"/cart"}>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="bg-teal-500 text-white py-2 px-4 rounded-full ml-14 hover:bg-teal-600"
                          >
                            Đặt ngay
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
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
      )}
      {roles.includes("Creator") && <NewProduct />}
    </div>
  );
};

export default NewProductToken;
