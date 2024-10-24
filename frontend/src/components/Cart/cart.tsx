"use client";
import StarRating from "@/components/forum/StarRating";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

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
  ordersId: number;
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
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [orderId, setOrderId] = useState(0);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [comment, setComment] = useState<{ [key: number]: string }>({});
  const [stars, setStars] = useState(0);
  const [title, setTitle] = useState<{ [key: number]: string }>({});
  const [isComment, setIsComment] = useState(true);
  const handleCommentChange = (productId: number, value: string) => {
    setComment((prev) => ({ ...prev, [productId]: value }));
  };

  const handleRatingChange = (newRating: number) => {
    setStars(newRating);
  };

  const handleTitleChange = (productId: number, value: string) => {
    setTitle((prev) => ({ ...prev, [productId]: value }));
  };
  const submitReview = async (productId: number) => {
    const payload = {
      title: title[productId] || "",
      comment: comment[productId] || "",
      star: stars || 0,
    };

    try {
      const response = await fetch(
        `https://localhost:7146/api/account/comment/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
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
  const handlePending = async (orderId: number) => {
    try {
      const res = await fetch(
        `https://localhost:7146/api/user/orders/pending/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
      alert("Success");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: "Pending" } : order
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleComplete = async (orderId: number) => {
    try {
      const res = await fetch(
        `https://localhost:7146/api/user/orders/receive/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
      alert("Success");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: "Complete" } : order
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (orderDetailId: number) => {
    try {
      const res = await fetch(
        `https://localhost:7146/api/admin/orders-details/delete/${orderDetailId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed");
      }
      alert("Sucess");
      setOrderDetails((prevOrderDetails) =>
        prevOrderDetails.filter((detail) => detail.id !== orderDetailId)
      );
    } catch (error) {
      console.error("Error");
    }
  };
  return (
    <div className="w-full">
      {orders.map((order) => (
        <div
          className="mx-56 border rounded-3xl space-y-5 mb-10 p-10"
          key={order.id}
        >
          {orderDetails
            .filter((detail) => detail.ordersId === order.id)
            .map((detail) => {
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
                                ? `https://localhost:7146/Resources/${product.productImages[0].images}`
                                : "/images/server/default.jpg"
                            }
                            alt={product.product_Name}
                            className="rounded-3xl h-[100px] max-w-[100px]"
                          />
                        </div>

                        <div className="mt-5 flex flex-col space-y-3">
                          <div className="font-bold">
                            {product.product_Name}
                          </div>
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

                      <div className={`flex items-center`}>
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
                            handleIncrease(
                              product.id,
                              detail.id,
                              product.quantity
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                      <div className="items-center flex">
                        <Button
                          className="bg-red-500 hover:bg-red-700"
                          onClick={() => handleDelete(detail.id)}
                        >
                          <FaRegTrashAlt className="" />
                        </Button>
                      </div>
                    </div>
                    {order.orderStatus === "Complete" && (
                      <div className={`mt-5 space-y-3 mb-3`}>
                        <input
                          type="text"
                          placeholder="Enter title"
                          value={title[product.id] || ""}
                          onChange={(e) =>
                            handleTitleChange(product.id, e.target.value)
                          }
                          className="border rounded-md p-2"
                        />
                        <textarea
                          placeholder="Enter your comment"
                          value={comment[product.id] || ""}
                          onChange={(e) =>
                            handleCommentChange(product.id, e.target.value)
                          }
                          className="border rounded-md p-2 w-full"
                        />
                        <div className="mt-2">
                          <label>Rating: </label>
                          <StarRating onRatingChange={handleRatingChange} />
                        </div>
                        <Button
                          onClick={() => submitReview(product.id)}
                          className="rounded-full bg-teal-500 hover:bg-teal-700"
                        >
                          Submit Review
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          <div className="flex justify-between">
            <div>
              Tổng tiền:
              <span>{totalPrice.toLocaleString("en-US")}đ</span>
            </div>
            <div>
              <div>
                <div className="font-bold">
                  Trạng thái đơn hàng:{" "}
                  {order.orderStatus === "Pending"
                    ? "Chờ xác nhận"
                    : order.orderStatus === "Confirmed"
                    ? "Đơn hàng đã được xác nhận"
                    : order.orderStatus === "Shipped"
                    ? "Đã giao cho đơn vị vận chuyển"
                    : order.orderStatus === "Complete"
                    ? "Đã giao"
                    : ""}
                </div>
                {order.orderStatus === "Buying" && (
                  <Button
                    className="rounded-full bg-teal-500 hover:bg-teal-700"
                    onClick={() => handlePending(order.id)}
                  >
                    Thanh toán
                  </Button>
                )}
                {order.orderStatus === "Shipped" && (
                  <div className="text-right">
                    <Button
                      className="rounded-full bg-teal-500 hover:bg-teal-700"
                      onClick={() => handleComplete(order.id)}
                    >
                      Đã nhận hàng
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
