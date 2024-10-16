"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface ChartProps {
  Token: string | undefined;
}

const CountChart = ({ Token }: ChartProps) => {
  const [countUser, setCountUser] = useState(0);
  const [countCreator, setCountCreator] = useState(0);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/admin/account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        const data = await res.json();

        const userCount = data.filter((account: any) =>
          account.roles.includes("User")
        ).length;
        const creatorCount = data.filter((account: any) =>
          account.roles.includes("Creator")
        ).length;

        setCountUser(userCount);
        setCountCreator(creatorCount);
      } catch (error) {
        console.error("Failed to fetch accounts", error);
      }
    };

    fetchAccount();
  }, [Token]);
  const data = [
    {
      name: "Total",
      count: countUser + countCreator,
      fill: "white",
    },
    {
      name: "Users",
      count: countUser,
      fill: "#C3EBFA",
    },
    {
      name: "Creators",
      count: countCreator,
      fill: "#FAE27C",
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Tài khoản</h1>
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <FaUsers className="absolute top-1/2 left-1/2 text-5xl -translate-x-1/2 -translate-y-1/2" />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{countUser}</h1>
          <h2 className="text-xs text-gray-300">Users</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{countCreator}</h1>
          <h2 className="text-xs text-gray-300">Creators</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
