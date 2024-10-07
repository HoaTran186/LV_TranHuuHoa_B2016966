"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface UserInformation {
  id: number;
  fullName: string;
  age: number;
  job: string;
  address: string;
  phone: string;
}

interface UserInfoProps {
  Token: string | undefined;
}

export default function Profile({ Token }: UserInfoProps) {
  const [date, setDate] = React.useState<Date>();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [dataUser, setDataUser] = useState<UserInformation | null>(null);
  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const res = await fetch(
          "https://localhost:7146/api/user/user-information",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user information");
        }
        const data = await res.json();
        setDataUser(data);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    fetchDataUser();
  }, []);
  const handleAddInfo = async () => {
    const dataUserAdd = {
      fullName: fullName,
      age: age,
      job: job,
      address: address,
      phone: phone,
    };
    try {
      const res = await fetch(
        "https://localhost:7146/api/user/user-information",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(dataUserAdd),
        }
      );
      alert("Add information user success");
      if (!res.ok) {
        throw new Error(`Failed to user information: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error adding to infomation:", error);
    }
  };
  const handleUpdateInfo = async (userInfoId: number) => {
    const dataUserUpdate = {
      fullName: fullName || dataUser?.fullName,
      age: age || dataUser?.age,
      job: job || dataUser?.job,
      address: address || dataUser?.address,
      phone: phone || dataUser?.phone,
    };
    try {
      const res = await fetch(
        `https://localhost:7146/api/user/user-information/${userInfoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(dataUserUpdate),
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to user information: ${res.statusText}`);
      }
      alert("Add information user success");
    } catch (error) {
      console.error("Error adding to infomation:", error);
    }
  };
  return (
    <div>
      {dataUser ? (
        <div className="mx-52 rounded-3xl border-2 my-10 mt-36 space-y-5 pb-10">
          <div className="my-10 ml-24 font-bold text-3xl">
            Cập nhật thông tin cá nhân
          </div>
          <div className="mx-10 space-y-6">
            <div className="flex space-x-11">
              <div className="flex items-center space-x-3">
                <Label>Họ và tên :</Label>
                <Input
                  type="text"
                  value={fullName || dataUser.fullName}
                  placeholder="Vui lòng nhập họ và tên đầy đủ"
                  className="w-80"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-3">
                <Label>Tuổi :</Label>
                <Input
                  type="number"
                  value={age || dataUser.age}
                  className="w-28"
                  min={0}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center space-x-3">
                <Label>Nghề nghiệp :</Label>
                <Input
                  type="text"
                  value={job || dataUser.job}
                  placeholder="Vui lòng nhập nghề nghiệp"
                  className="w-60"
                  onChange={(e) => setJob(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-24">
              <div className="flex items-center space-x-3">
                <Label>Số điện thoại :</Label>
                <Input
                  type="text"
                  value={phone || dataUser.phone}
                  placeholder="Vui lòng nhập số điện thoại"
                  className="w-64"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-3">
                <Label>Ngày tháng năm sinh :</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="">
              <Label>Địa chỉ :</Label>
              <Textarea
                value={address || dataUser.address}
                placeholder="Vui lòng nhập địa chỉ của bạn vào đây"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="text-right mr-10">
            <Button
              className="rounded-full bg-teal-500 hover:bg-teal-700"
              onClick={() => handleUpdateInfo(dataUser.id)}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mx-52 rounded-3xl border-2 my-10 mt-36 space-y-5 pb-10">
            <div className="my-10 ml-24 font-bold text-3xl">
              Cập nhật thông tin cá nhân
            </div>
            <div className="mx-10 space-y-6">
              <div className="flex space-x-11">
                <div className="flex items-center space-x-3">
                  <Label>Họ và tên :</Label>
                  <Input
                    type="text"
                    placeholder="Vui lòng nhập họ và tên đầy đủ"
                    className="w-80"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Label>Tuổi :</Label>
                  <Input
                    type="number"
                    className="w-28"
                    min={0}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Label>Nghề nghiệp :</Label>
                  <Input
                    type="text"
                    placeholder="Vui lòng nhập nghề nghiệp"
                    className="w-60"
                    onChange={(e) => setJob(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-24">
                <div className="flex items-center space-x-3">
                  <Label>Số điện thoại :</Label>
                  <Input
                    type="text"
                    placeholder="Vui lòng nhập số điện thoại"
                    className="w-64"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Label>Ngày tháng năm sinh :</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="">
                <Label>Địa chỉ :</Label>
                <Textarea
                  placeholder="Vui lòng nhập địa chỉ của bạn vào đây"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="text-right mr-10">
              <Button
                className="rounded-full bg-teal-500 hover:bg-teal-700"
                onClick={handleAddInfo}
              >
                Thêm thông tin cá nhân
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
