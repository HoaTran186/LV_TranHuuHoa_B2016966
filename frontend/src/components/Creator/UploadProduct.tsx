"use client";
import { useState, useRef, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UploadProductProps {
  Token: string | undefined;
}
interface Product {
  product_Name: string;
  origin: string;
  unique: string;
  apply: string;
  result: string;
  quantity: number;
  rating: number;
  price: number;
  productTypeId: number;
}
interface ProductType {
  id: number;
  productType_Name: string;
}
interface UserInfo {
  username: string;
  email: string;
  roles: string[];
}
export default function UploadProduct({ Token }: UploadProductProps) {
  const [productTypeName, setProductTypeName] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [productType, setProductType] = useState<ProductType[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [selectedProductType, setSelectedProductType] = useState<number | null>(
    null
  );
  const [origin, setOrigin] = useState("");
  const [unique, setUnique] = useState("");
  const [apply, setApply] = useState("");
  const [results, setResults] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user!");
        }
        const data: UserInfo = await res.json();
        setRoles(data.roles);
      } catch (error) {
        console.error("Error fetching user:", error);
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
    fetchUser();
    fetchProductType();
  }, []);
  const handleUploadProduct = async () => {
    const dataProduct = {
      product_Name: productName,
      origin: origin,
      unique: unique,
      apply: apply,
      result: results,
      quantity: quantity,
      price: price,
      productTypeId: selectedProductType,
    };
    try {
      const res = await fetch("https://localhost:7146/api/creator/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(dataProduct),
      });

      if (!res.ok) {
        throw new Error(`Failed to register: ${res.statusText}`);
      }
      const productData = await res.json();
      const productId = productData.id;
      const formData = new FormData();
      selectedImages.forEach((image) => {
        formData.append("Images", image);
      });
      const imageUploadRes = await fetch(
        `https://localhost:7146/api/creator/product-images/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
          body: formData,
        }
      );

      if (!imageUploadRes.ok) {
        throw new Error(
          `Failed to upload images: ${imageUploadRes.statusText}`
        );
      }

      alert("Add product success and images uploaded successfully");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      alert(error.message);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedImages = [...selectedImages, ...newFiles];
      setSelectedImages(updatedImages);
    }
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const newFiles = Array.from(event.dataTransfer.files);
      const updatedImages = [...selectedImages, ...newFiles];
      setSelectedImages(updatedImages);
      event.dataTransfer.clearData();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleProductTypeChange = (
    producttypename: string,
    producttypeid: number
  ) => {
    setProductTypeName(producttypename);
    setSelectedProductType(producttypeid);
  };
  return (
    <div>
      {roles.includes("Creator") && (
        <div className="space-y-24 rounded-3xl mx-48 border mt-44 mb-10 pb-5">
          <div className="font-bold text-3xl text-center mt-5">
            Đăng bán sản phẩm trên InnoTrade
          </div>
          <div className="space-y-5 mx-36">
            <div className="flex items-center space-x-2">
              <Label className="text-lg">Tên sản phẩm :</Label>
              <Input
                type="text"
                className="w-[20rem]"
                onChange={(e) => setProductName(e.target.value)}
              />
              <Label className="text-lg">Giá bán :</Label>
              <Input
                type="number"
                className="w-[15rem]"
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="flex space-x-2 items-center">
              <Label className="text-lg">Chọn lĩnh vực :</Label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-[20rem]">
                  {productTypeName || "Lĩnh vực"}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[17rem]">
                  <DropdownMenuLabel>Chọn lĩnh vực</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {productType.map((producttype) => (
                    <DropdownMenuItem
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
              <Label className="text-lg">Số lượng :</Label>
              <Input
                type="number"
                className="w-32"
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-lg">Xuất xứ của sản phẩm :</Label>
              <Textarea
                placeholder="Nhập thông tin xuất xứ của sản phẩm"
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-lg">Tính mới, tính độc đáo :</Label>
              <Textarea
                placeholder="Nhập tính mới và tính độc đáo của sản phẩm"
                onChange={(e) => setUnique(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-lg">Khả năng ứng dụng, triển khai :</Label>
              <Textarea
                placeholder="Nhập khả năng ứng dụng và triển khai của sản phẩm"
                onChange={(e) => setApply(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-lg">Kết quả :</Label>
              <Textarea
                placeholder="Nhập kết quả thực tế đạt được của sản phẩm"
                onChange={(e) => setResults(e.target.value)}
              />
            </div>
            <div
              className={`w-full rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center cursor-pointer ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-neutral-500"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <header className="text-lg">Kéo và thả để tải file lên</header>
              <span className="my-3">Hoặc nhấp vào đây để chọn file</span>
              <Input
                type="file"
                hidden
                multiple
                onChange={handleImageUpload}
                ref={inputRef}
              />
              <div className="grid grid-cols-3 gap-4 mt-4">
                {selectedImages.length > 0 &&
                  selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="object-cover h-40 w-40 rounded-lg"
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="text-right">
              <Button
                className="rounded-full bg-teal-500 hover:bg-teal-700"
                onClick={handleUploadProduct}
              >
                Đăng bán
              </Button>
            </div>
          </div>
        </div>
      )}
      {roles.includes("User") && (
        <div className="text-center border-2 mx-52 rounded-3xl h-40 items-center b mt-36 my-6 pt-14 text-2xl">
          Bạn không có quyền sử dụng chức năng này!!
        </div>
      )}
    </div>
  );
}
