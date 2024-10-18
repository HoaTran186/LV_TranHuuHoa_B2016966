"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
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
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(0);
  const [productTypeId, setProductTypeId] = useState<number>(0);
  const [selectedPriceRangeString, setSelectedPriceRangeString] = useState("");
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

  const handleProductTypeChange = (
    productType: string,
    productTypeId: number
  ) => {
    setSelectedProductType(productType);
    setProductTypeId(productTypeId);
  };
  const handlePriceRangeChange = (
    priceRange: number,
    priceRangeString: string
  ) => {
    setSelectedPriceRange(priceRange);
    setSelectedPriceRangeString(priceRangeString);
  };
  const searchUrl = `https://localhost:3000/product?${
    query == "" ? "" : `productName=${query}`
  }${
    (query == "" && productTypeId == 0) || query == "" || productTypeId == 0
      ? ""
      : "&"
  }${productTypeId == 0 ? "" : `productTypeId=${productTypeId}`}${
    (query == "" && productTypeId == 0) || selectedPriceRange == 0 ? "" : "&"
  }${selectedPriceRange == 0 ? "" : `maxPrice=${selectedPriceRange}`}`;
  const handleSearch = async () => {
    try {
      const res = await fetch(
        `https://localhost:7146/api/product/search-product?${
          query == "" ? "" : `productName=${query.replaceAll(" ", "-")}`
        }${
          (query == "" && productTypeId == 0) ||
          query == "" ||
          productTypeId == 0
            ? ""
            : "&"
        }${productTypeId == 0 ? "" : `productTypeId=${productTypeId}`}${
          (query == "" && productTypeId == 0) || selectedPriceRange == 0
            ? ""
            : "&"
        }${selectedPriceRange == 0 ? "" : `maxPrice=${selectedPriceRange}`}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch product data");
      }
      const data = await res.json();
    } catch (error) {
      console.error("Error searching products:", error);
    }
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

        <DropdownMenu>
          <DropdownMenuTrigger className="flex border border-gray-300 py-2 px-4 rounded-full cursor-pointer text-gray-500 focus:ring-2 focus:ring-teal-400 text-[1rem]">
            <FaBoxOpen className="mt-1 mr-1" />
            {selectedProductType || "Loại sản phẩm"}
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" bg-white border border-gray-200 rounded-md shadow-md p-2 mt-2 max-h-60 overflow-y-auto">
            <DropdownMenuLabel>Chọn Loại sản phẩm</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProductTypeChange("", 0)}>
              Chọn tất cả sản phẩm
            </DropdownMenuItem>
            {productTypes.map((producttype) => (
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

        {/* DropdownMenu for Price Range */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex border border-gray-300 py-2 px-4 rounded-full cursor-pointer text-gray-500 focus:ring-2 focus:ring-teal-400 text-[1rem]">
            <FaMoneyCheckAlt className="mt-1 mr-1" />{" "}
            {selectedPriceRangeString || "Tất cả mức giá"}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-md p-2">
            <DropdownMenuLabel> Chọn mức giá</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                handlePriceRangeChange(9999999999999999, "Chọn tất cả")
              }
            >
              Chọn tất cả
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePriceRangeChange(3000000, "Dưới 3 triệu")}
            >
              Dưới 3 triệu
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePriceRangeChange(30000000, "Trên 3 triệu")}
            >
              Trên 3 triệu
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Button */}
        <Link
          onClick={handleSearch}
          href={`${
            query == "" &&
            selectedPriceRange == 10000000000000000 &&
            productTypeId == 0
              ? "https://localhost:3000/product"
              : searchUrl
          }`}
        >
          <Button className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600">
            Tìm kiếm
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Search;
