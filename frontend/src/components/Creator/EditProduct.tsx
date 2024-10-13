"use client";
import ProductInfoCard from "@/components/Product/ProductInfoCard";
import ThumbnailCarousel from "@/components/Product/ThumbnailCarousel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBoxOpen, FaCartPlus } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";

interface ProductType {
  id: number;
  productType_Name: string;
}
interface ProductImage {
  id: number;
  images: string;
  productId: number;
}
interface EditProductProps {
  Token: string | undefined;
}
export default function EditProduct({ Token }: EditProductProps) {
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [productId, setProductId] = useState<number | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [productTypeId, setProductTypeId] = useState<number | null>(null);
  const [productTypeName, setProductTypeName] = useState<string | null>(null);
  const [loadingProductType, setLoadingProductType] = useState<boolean>(true);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [productType, setProductType] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>("");
  const [origin, setOrigin] = useState("");
  const [unique, setUnique] = useState("");
  const [apply, setApply] = useState("");
  const [result, setResult] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const id = params.get("Id");
      if (id) {
        setProductId(Number(id));
      }
      const fetchProductData = async () => {
        try {
          const response = await fetch(
            `https://localhost:7146/api/creator/products/${productId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch product data");
          }
          const data = await response.json();
          setProductData(data);
          setProductImages(data.productImages || []);
          setProductName(data.product_Name);
          setQuantity(data.quantity);
          setPrice(data.price);
          setOrigin(data.origin);
          setUnique(data.unique);
          setApply(data.apply);
          setResult(data.result);
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
      const fetchProductType = async () => {
        try {
          const res = await fetch("https://localhost:7146/api/product-type");
          if (!res.ok) {
            throw new Error("Failed to fetch product type!");
          }
          const data = await res.json();
          setProductType(data);
        } catch (error) {
          console.error("Error fetching product type:", error);
        }
      };
      fetchProductType();
      fetchProductData();
    }
  }, [productId]);
  const handleProductTypeChange = (
    productType: string,
    productTypeId: number
  ) => {
    setSelectedProductType(productType);
    setProductTypeId(productTypeId);
  };

  const handleUpdateProduct = async () => {
    const dataUpdate = {
      product_Name: productName,
      origin: origin,
      unique: unique,
      apply: apply,
      result: result,
      quantity: quantity,
      rating: 0,
      price: price,
      productTypeId: productTypeId,
      censor: true,
    };
    try {
      const res = await fetch(
        `https://localhost:7146/api/creator/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(dataUpdate),
        }
      );
      if (!res.ok) {
        throw new Error(`Failed : ${res.statusText}`);
      }
      alert("Success");
    } catch (error) {
      alert(error);
    }
  };
  const handleDeleteImage = async (imageId: number) => {
    try {
      const response = await fetch(
        `https://localhost:7146/api/creator/product-images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setProductImages((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );

      alert("Image deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };
  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0 || !productId) {
      console.error("No file selected or productId is null");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await fetch(
        `https://localhost:7146/api/creator/product-images/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      setProductImages((prevImages) => [...prevImages, ...data]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <div className="mt-36">
      {productData && (
        <div>
          <div className="flex my-20 mx-36 justify-between">
            <div>
              <h1 className="font-bold text-4xl">
                <Input
                  type="text"
                  value={productName}
                  className="w-[1000px] text-2xl"
                  onChange={(e) => setProductName(e.target.value)}
                />
              </h1>
              <h2 className="flex mt-10 font-bold text-lg items-center">
                Số lượng:
                <a className="text-teal-500">
                  {" "}
                  <Input
                    type="number"
                    value={quantity || 0}
                    className="w-20"
                    min={0}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </a>
              </h2>
              <div className=" flex">
                <div className="flex flex-row rounded-full bg-yellow-200 text-sm mt-10 items-center">
                  <FiStar className="text-yellow-500 text-[0.7rem] ml-1" />
                  <div className="mx-1">
                    {productData.rating}({productData.comments.length} đánh giá)
                  </div>
                </div>
                <div className="ml-5 rounded-full bg-gray-200 mt-10 items-center">
                  <p className="mx-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex border border-gray-300 py-2 px-4 rounded-full cursor-pointer text-gray-500 focus:ring-2 focus:ring-teal-400 text-[1rem]">
                        <FaBoxOpen className="mt-1 mr-1" />
                        {selectedProductType || productTypeName}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className=" bg-white border border-gray-200 rounded-md shadow-md p-2 mt-2 max-h-60 overflow-y-auto">
                        <DropdownMenuSeparator />
                        {productType.map((producttype) => (
                          <DropdownMenuItem
                            className=""
                            key={producttype.id}
                            onClick={() =>
                              handleProductTypeChange(
                                producttype.productType_Name,
                                producttype.id
                              )
                            }
                          >
                            {producttype.productType_Name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </p>
                </div>
              </div>
              <div className="text-teal-500 mt-5 text-2xl">---------</div>
            </div>
            <div className="space-y-10">
              <p className="flex font-bold text-4xl text-teal-900">
                <Input
                  type="number"
                  value={price || 0}
                  className="w-40 text-xl"
                  min={0}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
                đ
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mx-10">
        <div
          className="image-upload-section"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <p>Drag and drop images here, or click to select files</p>
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleImageUpload(e.target.files!)}
            style={{ display: "none" }}
          />
        </div>
        {productId !== null ? (
          <>
            <ThumbnailCarousel productId={productId} />
            <div className="mt-4">
              <h3 className="font-bold mb-2">Manage Product Images</h3>
              <div className="flex flex-wrap gap-4">
                {productImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={`http://localhost:5126/Resources/${image.images}`}
                      alt="Product"
                      className="w-24 h-24 object-cover"
                    />
                    <Button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
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
          ></Button>
        </div>
      </div>
      {productData && (
        <div className="mx-32 mt-20 space-y-20 mb-20">
          <div className="flex space-y-5 justify-between" id="origin">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold ">Xuất xứ</h1>
              <div className="text-teal-500 text-2xl">---------</div>
              <h3 className="text-2xl font-bold">Xuất xứ sản phẩm</h3>
              <p className="text-lg">
                <Textarea
                  value={origin}
                  className="w-[800px] text-lg"
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </p>
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
              <p className="text-lg">
                <Textarea
                  value={unique}
                  className="w-[800px] text-lg"
                  onChange={(e) => setUnique(e.target.value)}
                />
              </p>
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
            <p className="text-lg">
              <Textarea
                value={apply}
                className="w-[800px] text-lg"
                onChange={(e) => e.target.value}
              />
            </p>
          </div>
          <div className="space-y-5 max-w-3xl" id="result">
            <h1 className="text-4xl font-bold">Kết quả</h1>
            <div className="text-teal-500 text-2xl">---------</div>
            <h3 className="text-2xl font-bold">
              Kết quả quan trọng đã triển khai ứng dụng
            </h3>
            <p>
              <Textarea
                value={result}
                className="w-[800px] text-lg"
                onChange={(e) => e.target.value}
              />
            </p>
          </div>
          <div>
            <Button
              onClick={handleUpdateProduct}
              className="rounded-full bg-teal-500 hover:bg-teal-700"
            >
              Cập nhật
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
