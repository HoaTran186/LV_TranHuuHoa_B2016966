"use client";
import { useEffect, useState } from "react";

interface UserCardProps {
  Token: string | undefined;
}
const UserCardForum = ({ Token }: UserCardProps) => {
  const [countForum, setCountForum] = useState(0);
  useEffect(() => {
    const fetchForum = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/account/forum", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        const data = await res.json();
        const confirmedForum = data.filter(
          (forum: any) => forum.browse === true
        );
        setCountForum(confirmedForum.length);
      } catch (error) {}
    };
    fetchForum();
  }, []);

  return (
    <div className="rounded-2xl odd:bg-teal-200 even:bg-green-200 p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4">{countForum}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">Bài viết</h2>
    </div>
  );
};

export default UserCardForum;
