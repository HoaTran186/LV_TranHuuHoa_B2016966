"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaAngleDoubleRight, FaSearchLocation } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

interface ProductImage {
  id: number;
  images: string;
  productId: number;
}

interface Product {
  id: number;
  product_Name: string;
  userId: string;
  price: number;
  rating: number;
  productTypeId: number;
  productImages: ProductImage[];
  comments: string[];
}

interface ProductType {
  id: number;
  productType_Name: string;
}

interface UserInfo {
  id: number;
  fullName: string;
  userId: string;
}

const NewProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(
          "http://localhost:5126/api/product"
        );
        const productTypeResponse = await fetch(
          "http://localhost:5126/api/product-type"
        );
        const userInfoResponse = await fetch(
          "http://localhost:5126/api/users-information"
        );

        if (
          !productResponse.ok ||
          !productTypeResponse.ok ||
          !userInfoResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const productData = await productResponse.json();
        const productTypeData = await productTypeResponse.json();
        const userInfoData = await userInfoResponse.json();

        setProducts(productData);
        setProductTypes(productTypeData);
        setUserInfo(userInfoData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductTypeName = (productTypeId: number) => {
    const productType = productTypes.find((type) => type.id === productTypeId);
    return productType ? productType.productType_Name : "Unknown";
  };

  const findUserForProduct = (userId: string) => {
    return userInfo.find((user) => user.userId === userId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container w-full py-8 px-36">
      <div className="flex flex-row justify-between mb-10">
        <div className="text-3xl font-bold text-left mb-6 w-2/5">
          <h4>Sản phẩm mới</h4>
          <div className="pt-10">
            <span className="text-teal-300">---------</span>
          </div>
        </div>
        <div className="text-left text-gray-500 mb-12 w-2/5 text-lg">
          <p>
            Tận hưởng sự xa hoa và đẳng cấp tối đa trên du thuyền mới nhất và
            phổ biến nhất. Khám phá một hành trình tuyệt vời đưa bạn vào thế
            giới của sự sang trọng, tiện nghi và trải nghiệm không thể quên.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(0, 6).map((product) => {
          const matchingUser = findUserForProduct(product.userId);
          const userName = matchingUser
            ? matchingUser.fullName
            : "Unknown User";

          return (
            <Link
              key={product.id}
              href={`/product/search-product/${product.product_Name.replaceAll(
                " ",
                "-"
              )}?Id=${product.id}`}
            >
              <div className="bg-white border shadow-inner shadow-gray-200 rounded-2xl overflow-hidden">
                <div className="p-8">
                  <img
                    src={`http://localhost:5126/Resources/${product.productImages[0]?.images}`}
                    alt={product.product_Name}
                    className="w-[350px] h-[200px]"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-yellow-500">
                      <FiStar />
                      <span className="ml-1 font-bold">{product.rating}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({product.comments.length} đánh giá)
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {product.product_Name}
                  </h3>
                  <p className="text-gray-500 flex">
                    <FaSearchLocation className="mt-1 mr-1" />
                    {userName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Loại sản phẩm: {getProductTypeName(product.productTypeId)}
                  </p>
                  <div className="flex mt-2">
                    <p className="text-teal-500 font-bold text-lg mt-2">
                      {product.price.toLocaleString()}đ
                    </p>
                    <button className="bg-teal-500 text-white py-2 px-4 rounded-full ml-14 hover:bg-teal-600">
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="flex justify-center mt-8">
        <button className="border flex bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100">
          Xem tất cả <FaAngleDoubleRight className="mt-1 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default NewProduct;
