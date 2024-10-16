"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginAdmin() {
  const [UserName, setUserName] = useState("");
  const [Password, setPassWord] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = {
      username: UserName,
      password: Password,
    };
    try {
      const res = await fetch(
        "https://localhost:7146/api/admin/account/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        toast({
          variant: "destructive",
          description: "Tài khoản hoặc mật khẩu không chính xác!",
        });
      }
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      router.push("/admin/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-[23rem]">
        <div className="bg-white shadow-md rounded-3xl border px-8 pt-6 pb-8 mb-4">
          <div className="text-center mb-6 flex flex-row items-center">
            <img
              className="ml-10 mr-5 w-16 h-16 rounded-full"
              src="/images/Logo/logo.png"
              alt="Logo"
            />
            <h1 className="mt-2 text-2xl font-semibold text-teal-500">
              InnoTrade
            </h1>
          </div>
          <form>
            <div className="relative mt-4">
              <label
                htmlFor="username"
                className="absolute -top-3.5 left-4 bg-white px-2 text-gray-600 text-sm"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="type your username here ..."
                className="w-full border-2 h-14 rounded-full px-4 py-2 outline-none focus:border-teal-400 focus:ring-teal-100 focus:ring text-gray-500 placeholder-gray-400"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="relative mt-7">
              <label
                htmlFor="username"
                className="absolute -top-3.5 left-4 bg-white px-2 text-gray-600 text-sm"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="type your password here ..."
                className="w-full border-2 rounded-full h-14 outline-none px-4 py-2 focus:ring-teal-100 focus:ring focus:border-teal-400 text-gray-500 placeholder-gray-400"
                onChange={(e) => setPassWord(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center mt-10">
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
