"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect, ChangeEvent } from "react";
import { FaBoxOpen, FaMoneyCheckAlt } from "react-icons/fa";

import { FiSearch } from "react-icons/fi";

interface Product {
  id: number;
  product_Name: string;
}

interface ProductType {
  id: number;
  productType_Name: string;
}

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>("");

  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const response = await fetch("http://localhost:5126/api/product-type");
        if (!response.ok) {
          throw new Error("Failed to fetch product type");
        }
        const data = await response.json();
        const filteredData = data.map((producttypes: any) => ({
          id: producttypes.id,
          productType_Name: producttypes.productType_Name,
        }));
        setProductTypes(filteredData);
      } catch (error) {
        console.error("Error fetching product type:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5126/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        const filteredData = data.map((product: any) => ({
          id: product.id,
          product_Name: product.product_Name,
        }));

        setProducts(filteredData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    fetchProductType();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filteredSuggestions = products.filter((product) =>
        product.product_Name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: Product) => {
    setQuery(suggestion.product_Name);
    setSuggestions([]);
  };

  const handleProductTypeChange = (productType: string) => {
    setSelectedProductType(productType);
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl mt-96 space-y-5 bg-white pt-14 pb-9 px-5 rounded-xl shadow-lg z-10">
      <h1 className="text-4xl font-bold text-center mb-4">
        Bạn lựa chọn sản phẩm nào?
      </h1>
      <p className="text-gray-500 text-center mb-6">
        Với nhiều sản phẩm công nghệ sáng tạo giá tốt đang chờ bạn
      </p>

      <div className="flex space-x-4 justify-center items-center">
        <div className="relative">
          <div>
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Nhập tên sản phẩm"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white shadow-md rounded-lg mt-2 z-10">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion.product_Name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dropdown Menu for Product Types */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex border  border-gray-300 py-2 px-4 rounded-full cursor-pointer text-gray-500 focus:ring-2 focus:ring-teal-400 text-[1rem]">
            <FaBoxOpen className="mt-1 mr-1" />
            {selectedProductType || "Loại sản phẩm"}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-md p-2">
            <DropdownMenuLabel>Chọn Loại sản phẩm</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {productTypes.map((producttype) => (
              <DropdownMenuItem
                key={producttype.id}
                onClick={() =>
                  handleProductTypeChange(producttype.productType_Name)
                }
              >
                {producttype.productType_Name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* DropdownMenu for Price Range */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex border border-gray-300 py-2 px-4 rounded-full cursor-pointer text-gray-500 focus:ring-2 focus:ring-teal-400 text-[1rem]">
            <FaMoneyCheckAlt className="mt-1 mr-1" /> Tất cả mức giá
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-md p-2">
            <DropdownMenuLabel> Chọn mức giá</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Dưới 1 triệu</DropdownMenuItem>
            <DropdownMenuItem>1 - 3 triệu</DropdownMenuItem>
            <DropdownMenuItem>Trên 3 triệu</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Button */}
        <button className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600">
          Tìm kiếm
        </button>
      </div>
    </div>
  );
};

export default Search;
