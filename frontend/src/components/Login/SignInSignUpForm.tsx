"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  FaFacebookF,
  FaGoogle,
  FaLinkedin,
  FaLock,
  FaTwitter,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";
import { IoIosArrowBack, IoIosMail } from "react-icons/io";
import CreatorOTP from "@/components/Login/CreatorOTP";
import UserOTP from "@/components/Login/UserOTP";
import { useToast } from "@/components/ui/use-toast";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { useRouter } from "next/navigation";

const SignInSignUpForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSignUpRolesCreator, setisSignUpRolesCreator] = useState(false);
  const [isSignUpRolesUser, setisSignUpRolesUser] = useState(false);
  const [Email, setEmail] = useState("");
  const [UserName, setUserName] = useState("");
  const [Password, setPassWord] = useState("");
  const [isOtp, setIsOtp] = useState(false);
  const [isSign, setIsSign] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [forgotPass, setForGotPass] = useState(false);
  const handleLogin = async () => {
    const data = {
      username: UserName,
      password: Password,
    };
    const res = await fetch("https://localhost:7146/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      toast({
        variant: "destructive",
        description: "Tài khoản hoặc mật khẩu không chính xác!",
      });
    }
    router.push("/");
  };
  const handleRegister = async () => {
    const data = {
      username: UserName,
      email: Email,
      password: Password,
    };
    try {
      if (isSignUpRolesCreator == true) {
        const res = await fetch(
          "https://localhost:7146/api/creator/account/register-creator",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to register: ${res.statusText}`);
        }
        setIsOtp(true);
        alert("OTP has been sent to your email");
      } else if (isSignUpRolesUser == true) {
        const res = await fetch(
          "https://localhost:7146/api/users/account/register-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to register: ${res.statusText}`);
        }
        setIsOtp(true);
        alert("OTP has been sent to your email");
      }
    } catch (error) {
      console.error("Error register:", error);
      setError(error);
      alert("Error register");
    }
  };
  const handleRoleCreatorClick = () => {
    setisSignUpRolesCreator(true);
  };
  const handleRoleUserClick = () => {
    setisSignUpRolesUser(true);
  };
  const handleSignUp = () => {
    setIsSign(false);
  };
  const handleSignIn = () => {
    setIsSign(true);
  };
  const handleBackRole = () => {
    setisSignUpRolesUser(false);
    setisSignUpRolesCreator(false);
    setIsOtp(false);
  };
  if (error) {
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return <div>Error: {errorMessage}</div>;
  }
  const handleForgotPass = async () => {
    const data = {
      email: Email,
    };
    try {
      const res = await fetch(
        "https://localhost:7146/api/account/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        throw new Error(`Failed: ${res.statusText}`);
      }
      setIsOtp(true);
      alert("OTP has been sent to your email");
    } catch (error) {
      console.error("Error:", error);
      setError(error);
      alert("Error");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div
            className={`${
              isSign
                ? "hidden"
                : "w-2/5 bg-green-500 text-white rounded-tl-2xl rounded-bl-2xl py-36 px-12"
            }`}
          >
            <h2 className="text-3xl font-bold mb-2">Chào mừng trở lại!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-2">
              Để giữ liên lạc với chúng tôi, vui lòng đăng nhập bằng thông tin
              cá nhân của bạn.
            </p>
            <a
              onClick={handleSignIn}
              href="#"
              className="mt-10 border-2 border-white rounded-full px-12 py-2 inline-block hover:bg-white hover:text-green-500"
            >
              Đăng nhập
            </a>
          </div>
          <div className={`${isSign ? "hidden" : "w-3/5 p-5"}`}>
            <div className="flex flex-row justify-between">
              <div className="text-left ">
                <Button
                  className="outline-none bg-white hover:bg-white"
                  onClick={handleBackRole}
                >
                  <IoIosArrowBack className="text-black" />
                </Button>
              </div>
              <div className="text-right font-bold">
                <span className="text-green-500">In</span>no
                <span className="text-teal-500">Trade</span>
              </div>
            </div>

            <div
              className={`flex items-center pt-28 ${
                isSignUpRolesCreator || isSignUpRolesUser ? "hidden" : ""
              }`}
            >
              <div onClick={handleRoleCreatorClick}>
                <p className="text-xl font-bold text-green-500">Creator</p>
                <Image
                  src="/images/Login/creator.jpg"
                  width={170}
                  height={170}
                  alt="Picture of the author"
                  className="rounded-3xl mx-10 cursor-pointer"
                />
              </div>
              <div onClick={handleRoleUserClick}>
                <p className="text-xl font-bold text-green-500">User</p>
                <Image
                  src="/images/Login/user.jpg"
                  width={170}
                  height={170}
                  alt="Picture of the author"
                  className="rounded-3xl mx-10 cursor-pointer"
                />
              </div>
            </div>

            <div className={`${isOtp && isSignUpRolesCreator ? "" : "hidden"}`}>
              <CreatorOTP email={Email} />
            </div>
            <div className={`${isOtp && isSignUpRolesUser ? "" : "hidden"}`}>
              <UserOTP email={Email} />
            </div>
            <div
              className={`py-10 ${
                isSignUpRolesCreator || isSignUpRolesUser ? "" : "hidden"
              } ${isOtp ? "hidden" : ""}`}
            >
              <h2 className="text-3xl font-bold text-green-500 mb-2">
                Tạo tài khoản
              </h2>
              <div className="border-2 w-10 border-green-500 inline-block mb-2"></div>
              <div className="flex justify-center my-2">
                <a
                  href=""
                  className="border-2 border-gray-300 rounded-full p-3 mx-1"
                >
                  <FaFacebookF className="text-sm" />
                </a>
                <a
                  href=""
                  className="border-2 border-gray-300 rounded-full p-3 mx-1"
                >
                  <FaTwitter className="text-sm" />
                </a>
                <a
                  href=""
                  className="border-2 border-gray-300 rounded-full p-3 mx-1"
                >
                  <FaGoogle className="text-sm" />
                </a>
                <a
                  href=""
                  className="border-2 border-gray-300 rounded-full p-3 mx-1"
                >
                  <FaLinkedin className="text-sm" />
                </a>
              </div>
              <p className="text-gray-400 my-3">
                or use your email for registion
              </p>

              <div className="flex flex-col items-center ">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
                  <FaUser className="text-gray-400 m-2" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Tên người dùng"
                    className="bg-gray-100 outline-none text-sm flex-1"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
                  <IoIosMail className="text-gray-400 m-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Địa chỉ email"
                    className="bg-gray-100 outline-none text-sm flex-1"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="bg-gray-100 w-64 p-2 flex items-center">
                  <FaLock className="text-gray-400 m-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    className="bg-gray-100 outline-none text-sm flex-1"
                    onChange={(e) => setPassWord(e.target.value)}
                  />
                </div>
                <a
                  href="#"
                  className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block mt-5 hover:bg-green-500 hover:text-white"
                  onClick={handleRegister}
                >
                  Đăng kí
                </a>
              </div>
            </div>
          </div>
          <div className={`${isSign ? "w-3/5 p-5" : "hidden"}`}>
            <div className="text-left font-bold">
              <span className="text-green-500">In</span>no
              <span className="text-teal-500">Trade</span>
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-green-500 mb-2">
                Đăng nhập vào tài khoản
              </h2>
              <div className="border-2 w-10 border-green-500 inline-block mb-2"></div>
              <div className="flex justify-center my-2">
                <a
                  href=""
                  className="border-2 border-gray-300 rounded-full p-3 mx-1"
                >
                  <FaFacebookF className="text-sm" />
                </a>
                <a
                  href=""
                  className="border-2 border-gray-300 rounded-full p-3 mx-1"
                >
                  <FaTwitter className="text-sm" />
                </a>
                <a
                  href=""
                  className="border-2 border-gray-300 rounded-full p-3 mx-1"
                >
                  <FaGoogle className="text-sm" />
                </a>
                <a
                  href=""
                  className="border-2 border-gray-300 rounded-full p-3 mx-1"
                >
                  <FaLinkedin className="text-sm" />
                </a>
              </div>
              <p className="text-gray-400 my-3">or user your eamil account</p>
              <div className="flex flex-col items-center ">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-2">
                  <FaUser className="text-gray-400 m-2" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Tên người dùng"
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-gray-100 outline-none text-sm flex-1"
                  />
                </div>
                <div className="bg-gray-100 w-64 p-2 flex items-center">
                  <FaLock className="text-gray-400 m-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    onChange={(e) => setPassWord(e.target.value)}
                    className="bg-gray-100 outline-none text-sm flex-1"
                  />
                </div>
                <div className="flex justify-between w-64 mb-5">
                  <Label className="flex items-center text-xs">
                    <input type="checkbox" name="remember" className="mr-1" />
                    Nhớ mật khẩu
                  </Label>
                  <a
                    href="#"
                    className="text-xs"
                    onClick={() => setForGotPass(true)}
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <a
                  onClick={handleLogin}
                  href="#"
                  className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block hover:bg-green-500 hover:text-white"
                >
                  Đăng nhập
                </a>
              </div>
            </div>
          </div>
          <div
            className={`${
              isSign
                ? "w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12"
                : "hidden"
            }`}
          >
            <h2 className="text-3xl font-bold mb-2">Chào bạn!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-2">
              Điền thông tin cá nhân và bắt đầu hành trình cùng chúng tôi.
            </p>
            <a
              onClick={handleSignUp}
              href="#"
              className="border-2 border-white rounded-full px-12 py-2 inline-block hover:bg-white hover:text-green-500"
            >
              Đăng kí
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInSignUpForm;
