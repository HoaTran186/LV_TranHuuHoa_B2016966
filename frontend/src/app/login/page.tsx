import React from "react";
import { Metadata } from "next";
// import LoginForm from '@/app/form-login';
// import { Toaster } from '@/components/ui/toaster';
import { cookies } from "next/headers";
import LoginForm from "@/app/login/form-login";
// import LogoutButton from '@/components/logout/LogoutButton'; // Import component đăng xuất

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  const cookie = cookies().get("Token");

  if (cookie == null) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <LoginForm />
        </div>
        {/* <Toaster /> */}
      </div>
    );
  } else {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <h1>Logout</h1>
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {/* <p className='text-xl'>Bạn vui lòng <LogoutButton /></p> */}
        </div>
      </div>
    );
  }
}
