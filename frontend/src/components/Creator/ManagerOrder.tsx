"use client";
import { columns } from "@/app/(creator)/creator/manager/columns";
import { DataTable } from "@/app/(creator)/creator/manager/data-table";
import { useEffect, useState } from "react";

interface Order {
  id: number;
  userId: string;
  orderStatus: string;
  orderDate: Date;
  shippedDate: Date;
  totalAmount: number;
  //   orderDetails: OrderDetails[];
}
interface OrderDetails {
  id: number;
  ordersId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}
interface OrderProps {
  Token: string | undefined;
}
export default function ManagerOrder({ Token }: OrderProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/creator/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {}
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
