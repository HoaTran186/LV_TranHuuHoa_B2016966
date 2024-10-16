"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface OrderChartProps {
  Token: string | undefined;
}

const OrderChart = ({ Token }: OrderChartProps) => {
  const [data, setData] = useState<
    { name: string; confirmed: number; complete: number }[]
  >([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/admin/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        const orders = await res.json();

        const last7Days = Array.from({ length: 7 }, (_, i) =>
          dayjs().subtract(i, "day").format("YYYY-MM-DD")
        ).reverse();

        const chartData = last7Days.map((date) => {
          const confirmedOrders = orders.filter(
            (order: any) =>
              (order.orderStatus === "Confirmed" ||
                order.orderStatus === "Shipped") &&
              dayjs(order.orderDate).format("YYYY-MM-DD") === date
          );
          const completeOrders = orders.filter(
            (order: any) =>
              order.orderStatus === "Delivered" &&
              dayjs(order.orderDate).format("YYYY-MM-DD") === date
          );

          return {
            name: dayjs(date).format("ddd"),
            confirmed: confirmedOrders.length,
            complete: completeOrders.length,
          };
        });

        setData(chartData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrder();
  }, [Token]);

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Đơn đặt hàng</h1>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="confirmed"
            fill="#FAE27C"
            legendType="circle"
            radius={[10, 10, 0, 0]}
            name="Confirmed"
          />
          <Bar
            dataKey="complete"
            fill="#C3EBFA"
            legendType="circle"
            radius={[10, 10, 0, 0]}
            name="Complete"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderChart;
