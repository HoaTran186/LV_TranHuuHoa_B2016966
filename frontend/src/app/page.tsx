// File: pages/index.tsx or app/page.tsx (server-side component)
import React from "react";
import { cookies } from "next/headers";
import Chat from "@/Components/Chat";

const HomePage = () => {
  const tokenCookie = cookies().get("Token")?.value || "";

  return (
    <div>
      <Chat Token={tokenCookie} />
    </div>
  );
};

export default HomePage;
