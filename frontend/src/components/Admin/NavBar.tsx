"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoChatboxOutline, IoSearchOutline } from "react-icons/io5";

interface NavBarProps {
  Token: string | undefined;
}
const Navbar = ({ Token }: NavBarProps) => {
  const [countProduct, setCountProduct] = useState(0);
  const [countForum, setCountForum] = useState(0);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/product");
        if (!res.ok) {
          throw new Error("Faild fetch product");
        }
        const data = await res.json();
        const confirmedProducts = data.filter(
          (product: any) => product.censor === false
        );
        setCountProduct(confirmedProducts.length);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
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
          (forum: any) => forum.browse === false
        );
        setCountForum(confirmedForum.length);
      } catch (error) {}
    };
    fetchForum();
    fetchProduct();
  }, []);
  const total = countForum + countProduct;
  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <IoSearchOutline />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <IoChatboxOutline />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <FaRegBell />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            {total}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">Admin</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <Image
          src="/images/Logo/logo.png"
          alt=""
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
