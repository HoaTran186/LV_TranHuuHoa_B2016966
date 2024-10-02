"use client";

import React from "react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/logout", { method: "GET" });
    if (response.ok) {
      router.refresh();
      console.error("Failed to logout");
    }
  };

  return (
    <a
      onClick={handleLogout}
      className="cursor-pointer text-blue-600 hover:underline"
    >
      Đăng xuất
    </a>
  );
};

export default LogoutButton;
