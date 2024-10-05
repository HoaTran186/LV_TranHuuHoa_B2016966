"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { date } from "zod";

interface OrderProps {
  Token: string | undefined;
}
interface Order {
  id: number;
  userId: string;
  orderStatus: string;
  orderDate: string;
  shippedDate: string | null;
  totalAmount: number;
}
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
interface OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
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
export default function Cart({ Token }: OrderProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [orderId, setOrderId] = useState<number>();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://localhost:7146/api/product");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
        const initialQuantities: { [key: number]: number } = {};
        data.forEach((product: Product) => {
          initialQuantities[product.id] = 1; // Set initial quantity to 1 for each product
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    const fetchOrders = async () => {
      if (!Token) {
        setError("No access token provided");
        return;
      }

      try {
        const response = await fetch("https://localhost:7146/api/user/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders");
      }
    };
    const fetchProductType = async () => {
      try {
        const response = await fetch("https://localhost:7146/api/product-type");
        if (!response.ok) throw new Error("Failed to fetch product type");
        const data = await response.json();
        setProductTypes(data);
      } catch (error) {
        console.error("Error fetching product type:", error);
      }
    };
    fetchOrders();
    fetchProducts();
    fetchProductType();
  }, [Token]);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!Token) {
        setError("No access token provided");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7146/api/admin/orders-details`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrderDetails(data);
        const initialQuantities: { [key: number]: number } = {};
        data.forEach((detail: OrderDetail) => {
          initialQuantities[detail.productId] = detail.quantity;
        });
        setQuantities(initialQuantities);
        calculateTotalPrice(initialQuantities, products);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to fetch order details");
      }
    };

    fetchOrderDetails();
  }, [Token, products]);

  const calculateTotalPrice = (
    quantities: { [key: number]: number },
    products: Product[]
  ) => {
    const total = orderDetails.reduce((sum, detail) => {
      const product = products.find((p) => p.id === detail.productId);
      return product
        ? sum + product.price * (quantities[detail.productId] || 1)
        : sum;
    }, 0);
    setTotalPrice(total);
  };
  const updateOrderDetail = async (
    orderDetailId: number,
    productId: number,
    quantity: number
  ) => {
    try {
      const response = await fetch(
        `https://localhost:7146/api/admin/orders-details/${orderDetailId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify({
            productId: productId, // Đảm bảo có productId
            quantity: quantity, // Số lượng đã cập nhật
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order detail");
      }

      console.log("Order detail updated successfully");
    } catch (error) {
      console.error("Error updating order detail:", error);
    }
  };

  const handleDecrease = async (productId: number, orderDetailId: number) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = {
        ...prevQuantities,
        [productId]: Math.max(1, prevQuantities[productId] - 1),
      };

      updateOrderDetail(orderDetailId, productId, updatedQuantities[productId]);

      calculateTotalPrice(updatedQuantities, products);
      return updatedQuantities;
    });
  };

  const handleIncrease = async (
    productId: number,
    orderDetailId: number,
    maxQuantity: number
  ) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = {
        ...prevQuantities,
        [productId]: Math.min(maxQuantity, prevQuantities[productId] + 1),
      };

      updateOrderDetail(orderDetailId, productId, updatedQuantities[productId]);

      calculateTotalPrice(updatedQuantities, products);
      return updatedQuantities;
    });
  };

  return (
    <div className="w-full">
      <div className="mx-56 border rounded-3xl space-y-5 mb-10 p-10">
        {orderDetails.map((detail) => {
          const product = products.find((p) => p.id === detail.productId);
          if (!product) return null;

          return (
            <div key={detail.id}>
              <div className="flex m-5 rounded-3xl border justify-between">
                <div>
                  <div className="m-5 flex space-x-4">
                    <div>
                      <img
                        src={
                          product.productImages.length > 0
                            ? `https://localhost:7146/Resources/${product.productImages[0]?.images}`
                            : "/path-to-default-image.jpg"
                        }
                        alt={product.product_Name}
                        className="rounded-3xl h-[100px] w-[100px]"
                      />
                    </div>

                    <div className="mt-5 flex flex-col space-y-3">
                      <div>{product.product_Name}</div>
                      <div>
                        {productTypes.find(
                          (type) => type.id === product.productTypeId
                        )?.productType_Name || "Unknown type"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex m-5 space-x-24">
                  <div>
                    <div className="mt-5 font-bold text-lg">
                      {product.price.toLocaleString("en-US")}đ
                    </div>
                    <div className="font-bold">/ sản phẩm</div>
                  </div>

                  <div className="mt-5">
                    <Button
                      onClick={() => handleDecrease(product.id, detail.id)}
                    >
                      -
                    </Button>
                    <span className="mx-2">
                      {quantities[product.id] || detail.quantity}
                    </span>
                    <Button
                      onClick={() =>
                        handleIncrease(detail.id, product.id, product.quantity)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex justify-between">
          <div>
            Tổng tiền:<span>{totalPrice.toLocaleString("en-US")}đ</span>
          </div>
          <div>
            <Button className="rounded-full bg-teal-500 hover:bg-teal-700">
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
