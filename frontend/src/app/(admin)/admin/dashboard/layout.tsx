import Menu from "@/components/Admin/Menu";
import Navbar from "@/components/Admin/NavBar";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = cookies().get("Token")?.value;
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image
            src="/images/Logo/logo.png"
            alt=""
            width={36}
            height={36}
            className="rounded-md"
          />
          <span className="hidden lg:block font-bold">InnoTrade</span>
        </Link>
        <Menu />
      </div>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar Token={cookie} />
        {children}
      </div>
    </div>
  );
}
