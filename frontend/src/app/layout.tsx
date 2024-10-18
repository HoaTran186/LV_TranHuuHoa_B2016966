import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InnoTrade – Nơi trao đổi những sản phẩm sáng tạo và công nghệ.",
  icons: "/images/Logo/logo.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
