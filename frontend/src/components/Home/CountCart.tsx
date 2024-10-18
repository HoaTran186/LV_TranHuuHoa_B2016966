"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";

interface CartProps {
  Token: string | undefined;
}
interface User {
  username: string;
  email: string;
  roles: [];
}
export default function CountCart({ Token }: CartProps) {
  const [countOrder, setCountOrder] = useState(0);
  const [roles, setRoles] = useState<string[]>([]);
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
          throw new Error("Failed to fetch data");
        }
        const data: User = await res.json();
        setRoles(data.roles);
      } catch (error) {}
    };
    fetchUser();
  }, [Token]);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/user/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        const buyingOrders = data.filter(
          (order: any) => order.orderStatus === "Buying"
        );

        setCountOrder(buyingOrders.length);
      } catch (error) {}
    };
    fetchOrder();
  }, []);
  return (
    <div>
      {roles.includes("User") ? (
        <Link href="/cart" className="flex relative">
          <IoCartOutline className="text-[25px] text-gray-700 hover:text-gray-900" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {countOrder}
          </span>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
}
