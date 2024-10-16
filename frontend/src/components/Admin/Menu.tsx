import { CircleUser } from "lucide-react";
import Link from "next/link";
import {
  FaBoxes,
  FaBoxOpen,
  FaHome,
  FaHouseUser,
  FaRegFileAlt,
  FaUsers,
} from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { IoChatbubblesOutline } from "react-icons/io5";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <FaHome />,
        label: "Home",
        href: "/admin/dashboard",
      },
      {
        icon: <FaUsers />,
        label: "Khách hàng",
        href: "/admin/dashboard/account",
      },
      {
        icon: <FaBoxes />,
        label: "Lĩnh vực",
        href: "/admin/dashboard/product-type",
      },
      {
        icon: <FaBoxOpen />,
        label: "Sản phẩm",
        href: "/admin/dashboard/product",
      },
      {
        icon: <IoChatbubblesOutline />,
        label: "Tin nhắn",
        href: "/admin/chat",
      },

      {
        icon: <FaRegFileAlt />,
        label: "Diễn đàn",
        href: "/admin/dashboard/forum",
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <CircleUser />,
        label: "Profile",
        href: "/profile",
      },
      {
        icon: <FaHouseUser />,
        label: "Settings",
        href: "/settings",
      },
      {
        icon: <IoIosLogOut />,
        label: "Logout",
        href: "/logout",
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            return (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                {item.icon}
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
