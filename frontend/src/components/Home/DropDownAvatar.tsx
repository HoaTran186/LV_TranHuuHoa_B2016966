"use client";
import LogoutButton from "@/components/Login/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DropDownAvatarProps {
  Token: string | undefined;
}
interface User {
  username: string;
  email: string;
  roles: [];
}

export default function DropDownAvatar({ Token }: DropDownAvatarProps) {
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
  return (
    <div>
      {roles.length === 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="/images/server/user.png" alt="@InnoTrade" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/login">Đăng nhập</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="/images/server/user.png" alt="@InnoTrade" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">Thông tin cá nhân</Link>
            </DropdownMenuItem>
            {roles.includes("Creator") ? (
              <DropdownMenuItem>
                <Link href={"/creator"}>Quản lí sản phẩm</Link>
              </DropdownMenuItem>
            ) : (
              ""
            )}

            <DropdownMenuItem>
              <Link href={"/chat"}>Tin nhắn cộng đồng</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/forum/my-forum"}>Bài viết của bạn</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
