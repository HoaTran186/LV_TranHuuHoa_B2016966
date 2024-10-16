"use client";
import { useEffect, useState } from "react";

interface UserCardProps {
  Token: string | undefined;
}
const UserCardAccount = ({ Token }: UserCardProps) => {
  const [countAccount, setCountAccount] = useState(0);
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/admin/account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        const data = await res.json();
        setCountAccount(data.length);
      } catch (error) {}
    };
    fetchAccount();
  }, []);

  return (
    <div className="rounded-2xl odd:bg-teal-200 even:bg-green-200 p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4">{countAccount}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">
        Tài khoản
      </h2>
    </div>
  );
};

export default UserCardAccount;
