"use client";
import { useEffect, useState } from "react";
import ThumbnailCarousel from "@/components/Product/ThumbnailCarousel";
import Link from "next/link";
import { FaCartPlus, FaChevronRight } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { FiStar } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IoIosSearch } from "react-icons/io";
import ProductInfoCard from "@/components/Product/ProductInfoCard";

const GetProductId = () => {
  const [productId, setProductId] = useState<number | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [productTypeId, setProductTypeId] = useState<number | null>(null);
  const [productTypeName, setProductTypeName] = useState<string | null>(null);
  const [loadingProductType, setLoadingProductType] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const id = params.get("Id");

      if (id) {
        setProductId(Number(id));
      }

      const pathSegments = url.pathname.split("/");
      const productNameSegment = pathSegments[pathSegments.length - 1];
      const decodedProductName = decodeURIComponent(productNameSegment).replace(
        /-/g,
        " "
      );

      const fetchProductData = async () => {
        try {
          const response = await fetch(
            `http://localhost:5126/api/product/${productId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch product data");
          }
          const data = await response.json();
          setProductData(data);

          const productTypeId = data.productTypeId;
          if (productTypeId) {
            setProductTypeId(productTypeId);

            const typeResponse = await fetch(
              `http://localhost:5126/api/product-type/${productTypeId}`
            );
            if (!typeResponse.ok) {
              throw new Error("Failed to fetch product type data");
            }
            const typeData = await typeResponse.json();
            setProductTypeName(typeData.productType_Name);
          } else {
            console.error("Product Type ID not found.");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingProductType(false);
        }
      };

      if (productId !== null) {
        fetchProductData();
      }
    }
  }, [productId]);
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (productData && quantity < productData.quantity) {
      setQuantity(quantity + 1);
    }
  };
  const totalRatings = 11;
  const averageRating = 4.91;
  const ratingCounts: { [key: string]: number } = {
    "5": 10,
    "4": 1,
    "3": 0,
    "2": 0,
    "1": 0,
  };

  const getPercentage = (count: number) => {
    return (count / totalRatings) * 100;
  };
  return (
    <div>
      <nav className="w-full h-[3rem] border">
        <div className="flex flex-row space-x-3 ml-36">
          <Link href={"/"} className="text-2xl mt-3">
            <IoHomeOutline />
          </Link>
          <FaChevronRight className="mt-5" />
          <Link href={"/product"} className="mt-3 text-lg">
            Sản phẩm
          </Link>
          <FaChevronRight className="mt-5" />
          <p className="mt-3 text-lg cursor-pointer hover:text-teal-400">
            {productData ? productData.product_Name : "Loading..."}
          </p>
        </div>
      </nav>
      {productData && (
        <div>
          <div className="flex my-20 mx-36 justify-between">
            <div>
              <h1 className="font-bold text-4xl">{productData.product_Name}</h1>
              <h2 className="mt-10 font-bold text-lg">
                Số lượng:
                <a className="text-teal-500"> {productData.quantity}</a>
              </h2>
              <div className=" flex">
                <div className="flex flex-row rounded-full bg-yellow-200 text-sm mt-10 items-center">
                  <FiStar className="text-yellow-500 text-[0.7rem] ml-1" />
                  <div className="mx-1">
                    {productData.rating}({productData.comments.length} đánh giá)
                  </div>
                </div>
                <div className="ml-5 rounded-full bg-gray-200 mt-10 items-center">
                  <p className="mx-1">{productTypeName}</p>
                </div>
              </div>
              <div className="text-teal-500 mt-5 text-2xl">---------</div>
            </div>
            <div className="space-y-10">
              <p className="font-bold text-4xl text-teal-900">
                {productData.price?.toLocaleString("en-US")} đ
              </p>
              <div className="flex items-center space-x-5">
                <label htmlFor="quantity" className="font-bold text-lg">
                  Số lượng:
                </label>
                <div className="flex items-center space-x-2 ">
                  <Button
                    onClick={handleDecrease}
                    className="px-3 py-1 text-lg font-bold bg-teal-500 text-white w-8 h-8 rounded-full hover:bg-teal-700"
                  >
                    -
                  </Button>
                  <div className="px-4 py-2 border rounded-md">{quantity}</div>
                  <Button
                    onClick={handleIncrease}
                    className="px-3 py-1 text-lg font-bold bg-teal-500 text-white w-8 h-8 rounded-full hover:bg-teal-700"
                  >
                    +
                  </Button>
                </div>
              </div>
              <p className="text-right">
                <Button className="rounded-full bg-teal-500 hover:bg-teal-700 text-lg">
                  <FaCartPlus className="mr-1" /> Đặt hàng
                </Button>
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mx-10">
        {productId !== null ? (
          <ThumbnailCarousel productId={productId} />
        ) : (
          <p>Loading product images...</p>
        )}
      </div>

      <div className="flex border z-50 h-[40px] space-x-10   items-center mt-20 mx-36 rounded-lg text-sm bg-gray-50">
        <div className="ml-5">
          <Button
            className="bg-gray-100 w-20 h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
            onClick={() => {
              const originElement = document.getElementById("origin");
              if (originElement) {
                originElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
          >
            <Label id="origin">Xuất xứ</Label>
          </Button>
        </div>
        <div className="mr-10">
          <Button
            className="bg-gray-100 w-[10rem] h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
            onClick={() => {
              const uniqueElement = document.getElementById("unique");
              if (uniqueElement) {
                uniqueElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
          >
            <Label>Tính mới, Tính độc đáo</Label>
          </Button>
        </div>
        <div>
          <Button
            className="bg-gray-100 w-36 h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
            onClick={() => {
              const applyElement = document.getElementById("apply");
              if (applyElement) {
                applyElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
          >
            <Label>Khả năng ứng dụng</Label>
          </Button>
        </div>
        <div>
          <Button
            className="bg-gray-100 w-20 h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
            onClick={() => {
              const resultElement = document.getElementById("result");
              if (resultElement) {
                resultElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
          >
            <Label>Kết quả</Label>
          </Button>
        </div>
        <div>
          <Button
            className="bg-gray-100 w-24 h-8 text-black hover:bg-white hover:shadow-2xl hover:shadow-gray-500"
            onClick={() => {
              const commentsElement = document.getElementById("comment");
              if (commentsElement) {
                commentsElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }}
          >
            {productData && (
              <Label className="flex">
                Đánh giá{" "}
                <div className="ml-1 rounded-full bg-slate-300 w-4">
                  {productData.comments.length}
                </div>
              </Label>
            )}
          </Button>
        </div>
      </div>
      {productData && (
        <div className="mx-32 mt-20 space-y-20 mb-20">
          <div className="flex space-y-5 justify-between" id="origin">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold ">Xuất xứ</h1>
              <div className="text-teal-500 text-2xl">---------</div>
              <h3 className="text-2xl font-bold">Xuất xứ sản phẩm</h3>
              <p className="text-lg">{productData.origin}</p>
            </div>
            {productId !== null && <ProductInfoCard productID={productId} />}
          </div>
          <div className="max-w-3xl" id="unique">
            <div className="space-y-5">
              <h1 className="text-4xl font-bold">Tính mới, Tính độc đáo</h1>
              <div className="text-teal-500 text-2xl">---------</div>
              <h3 className="text-2xl font-bold">
                Tính mới, độc đáo của sản phẩm
              </h3>
              <p className="text-lg">{productData.unique}</p>
            </div>
          </div>
          <div className="space-y-5 max-w-3xl" id="apply">
            <h1 className="text-4xl font-bold">
              Khả năng ứng dụng, triển khai
            </h1>
            <div className="text-teal-500 text-2xl">---------</div>
            <h3 className="text-2xl font-bold">
              Khả năng ứng dụng, triển khai của sản phẩm
            </h3>
            <p className="text-lg">{productData.apply}</p>
          </div>
          <div className="space-y-5 max-w-3xl" id="result">
            <h1 className="text-4xl font-bold">Kết quả</h1>
            <div className="text-teal-500 text-2xl">---------</div>
            <h3 className="text-2xl font-bold">
              Kết quả quan trọng đã triển khai ứng dụng
            </h3>
            <p>{productData.result}</p>
          </div>
          <div className="space-y-5 max-w-3xl" id="comment">
            <div className="flex flex-row justify-between">
              <h1 className="flex text-4xl font-bold">
                Đánh giá (<div>{productData.comments.length}</div>)
              </h1>
              <div className="flex space-x-5">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Tìm đánh giá"
                    className="w-64 pl-10 pr-4 py-2 border-2 border-teal-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <IoIosSearch className="absolute left-3 text-lg text-gray-400" />
                </div>
                <Button className="rounded-full bg-teal-500 text-slate-200 hover:bg-teal-700 items-center">
                  <FiStar className="mr-1" />
                  Đánh giá
                </Button>
              </div>
            </div>
            <div className="text-teal-500 text-2xl">---------</div>
          </div>
          <div className="space-y-10">
            <div className="w-full max-w-3xl border rounded-3xl p-6 bg-white shadow">
              <div className="flex items-center">
                <span className="text-4xl font-bold text-orange-500">
                  {averageRating.toFixed(1)}
                </span>
                <span className="ml-4 text-gray-500">/ 5</span>
              </div>
              <div className="flex mt-6">
                <div className="w-1/2 flex flex-col justify-between">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center mb-2">
                      <span className="text-sm text-gray-700">{star} sao</span>
                      <div className="flex-1 h-2 ml-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{
                            width: `${getPercentage(
                              ratingCounts[star.toString()]
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {ratingCounts[star.toString()]} đánh giá
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full max-w-3xl border rounded-3xl p-6 bg-white shadow">
              <div className="flex items-center">
                <span className="flex space-x-1 text-2xl font-bold text-orange-500">
                  <FiStar />
                  <FiStar />
                  <FiStar />
                </span>
              </div>
              <div className="flex mt-6 max-w-3xl">
                <div className=" space-y-2">
                  <p className="font-bold">Tran Van A</p>
                  <p>
                    Trải nghiệm tuyệt vời và môi trường xung quanh thật đẹp. Tàu
                    đẹp, nhân viên chuyên nghiệp, rất chu đáo.
                  </p>
                  <p>1/10/2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetProductId;