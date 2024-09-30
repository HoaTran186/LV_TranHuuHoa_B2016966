"use client";

import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  product_Name: string;
  userId: string;
}

interface UserInfo {
  id: number;
  fullName: string;
  age: number;
  job: string;
  address: string;
  phone: string;
  userId: string;
}

interface ProductInfoCardProps {
  productID: number;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ productID }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productID) return;

    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          `http://localhost:5126/api/product/${productID}`
        );
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product");
        }
        const productData = await productResponse.json();
        setProduct(productData);

        const userResponse = await fetch(
          `http://localhost:5126/api/users-information`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user information");
        }
        const userInfoData = await userResponse.json();
        setUsers(userInfoData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productID]);

  useEffect(() => {
    if (product && users.length > 0) {
      const matchedUser = users.find((user) => user.userId === product.userId);
      setUserInfo(matchedUser || null);
    }
  }, [product, users]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo) {
    return <div>Thông tin tác giả không tồn tại.</div>;
  }

  return (
    <div className="max-w-sm p-4 border bg-white rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">Thông tin tác giả</h3>
      <ul className="space-y-5">
        <li className="flex items-center">
          <span className="mr-2">🧑‍💻</span>
          <span>Tên tác giả</span>
          <span className="ml-auto">{userInfo.fullName || "Unknown"}</span>
        </li>
        <li className="flex items-center text-right">
          <span className="mr-2">📍</span>
          <span>Địa chỉ</span>
          <span className="ml-auto">
            {userInfo.address || "Unknown Address"}
          </span>
        </li>
        <li className="flex items-center">
          <span className="mr-2">📧</span>
          <span>Công việc</span>
          <span className="ml-auto">{userInfo.job || "Unknown Email"}</span>
        </li>
        <li className="flex items-center">
          <span className="mr-2">📱</span>
          <span>Số điện thoại</span>
          <span className="ml-auto">{userInfo.phone || "Unknown Phone"}</span>
        </li>
      </ul>
    </div>
  );
};

export default ProductInfoCard;
