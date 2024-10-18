import CountCart from "@/components/Home/CountCart";
import DropDownAvatar from "@/components/Home/DropDownAvatar";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  const cookie = cookies().get("Token")?.value;
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-4 px-8 bg-white border-b border-gray-200 shadow-lg">
      <div className="flex items-center ml-20">
        <Link href={"/"} className="flex items-center">
          <Image
            src={"/images/Logo/logo.png"}
            width={60}
            height={70}
            alt="Logo"
            className="w-12 h-auto rounded-xl"
          />
          <p className="ml-3 text-2xl">
            <span className="text-teal-500 font-bold">In</span>
            no<span className="text-teal-500 font-bold">Trade</span>
          </p>
        </Link>

        <ul className="flex space-x-8 ml-40">
          <li>
            <Link href={"/"} className="text-gray-700 hover:text-teal-500">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              href={"/product"}
              className="text-gray-700 hover:text-teal-500"
            >
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link
              href={"/introduce"}
              className="text-gray-700 hover:text-teal-500"
            >
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link href={"/forum"} className="text-gray-700 hover:text-teal-500">
              Diễn đàn
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center space-x-6 font-bold">
        <CountCart Token={cookie} />
        <a href="tel:0922222016" className="text-gray-700 hover:text-gray-900">
          Hotline: **********
        </a>
        <Link
          href={"/forum/create-forum"}
          className="bg-teal-400 hover:bg-teal-500 text-white py-2 px-6 rounded-full font-bold"
        >
          Viết bài chia sẻ
        </Link>
        <DropDownAvatar Token={cookie} />
      </div>
    </nav>
  );
};

export default NavBar;
