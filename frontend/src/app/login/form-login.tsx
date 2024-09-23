"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaLock, FaUser } from "react-icons/fa";
import { Button } from "@/Components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";

export default function LoginForm() {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit: SubmitHandler<LoginBodyType> = async (values) => {
    try {
      const response = await fetch("http://localhost:5126/api/account/login", {
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include", // Include credentials if needed
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Đăng nhập không thành công");
      }

      // Perform additional actions like navigating to dashboard
      // router.push("/dashboard");
      console.log("Login successful:", payload);
    } catch (error) {
      console.error("Login error:", error);
      // Handle error (e.g., show a toast or notification)
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center bg-gray-600 opacity-95 rounded-xl w-[400px] h-[400px]"
      >
        <h2 className="my-8 font-bold text-3xl text-white">Welcome to you</h2>
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>
                <FaUser className="absolute text-primary text-xl mt-4" />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Vui lòng nhập tên đăng nhập"
                  type="text"
                  {...field}
                  className="placeholder:text-sm rounded-none bg-gray-600 bg-opacity-75 pl-8 border-0 border-b-[1.5px] text-lg focus:outline-none transition-all duration-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>
                <FaLock className="absolute text-primary text-xl mt-4" />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Vui lòng nhập mật khẩu"
                  type="password"
                  {...field}
                  className="placeholder:text-sm rounded-none bg-gray-600 bg-opacity-75 pl-8 border-0 border-b-[1.5px] text-lg focus:outline-none transition-all duration-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="py-3 px-20 bg-orange-500 hover:bg-orange-700 rounded-full text-white font-bold uppercase text-lg mt-4 transform hover:translate-y-1 transition-all duration-700"
        >
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
