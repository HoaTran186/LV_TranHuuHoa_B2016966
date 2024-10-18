"use client";

import Pagination from "@/components/Product/Pagination";
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

import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  FaArrowRight,
  FaBoxOpen,
  FaCartPlus,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import { FiSearch, FiStar } from "react-icons/fi";
interface ProductImage {
  id: number;
  images: string;
  productId: number;
}
interface Product {
  id: number;
  product_Name: string;
  userId: string;
  censor: boolean;
  price: number;
  rating: number;
  quantity: number;
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
  age: number;
  job: string;
  address: string;
  phone: string;
  userId: string;
}
interface UserRoles {
  username: string;
  email: string;
  roles: string[];
}
interface SearchProps {
  Token: string | undefined;
}
const SearchBar = ({ Token }: SearchProps) => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductType, setSelectedProductType] = useState<string>("");
  const [productTypeId, setProductTypeId] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [starFilters, setStarFilters] = useState<number[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<number[]>(
    []
  );
  const router = useRouter();
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(0);
  const [selectedPriceRangeString, setSelectedPriceRangeString] = useState("");
  const [pageProduct, setPageProduct] = useState<Product[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  useEffect(() => {
    const fetchProductType = async () => {
      try {
        const response = await fetch("https://localhost:7146/api/product-type");
        if (!response.ok) throw new Error("Failed to fetch product type");
        const data = await response.json();
        setProductTypes(data);
      } catch (error) {
        console.error("Error fetching product type:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch("https://localhost:7146/api/product");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const filteredData = data.filter(
          (product: Product) => product.censor === true
        );
        setProducts(filteredData);
        setProductCount(filteredData.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          "https://localhost:7146/api/users-information"
        );
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
    fetchProducts();
    fetchProductType();
  }, []);
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
        const data: UserRoles = await res.json();
        setRoles(data.roles);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [Token]);
  useEffect(() => {
    const fetchPageProduct = async () => {
      const res = await fetch(
        `https://localhost:7146/api/product?PageNumber=${pageNumber}&PageSize=5`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }
      const productpage = await res.json();
      setPageProduct(productpage);
    };
    fetchPageProduct();
  }, [pageNumber]);
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
  const handleStarFilterChange = (star: number) => {
    setStarFilters((prevFilters) =>
      prevFilters.includes(star)
        ? prevFilters.filter((item) => item !== star)
        : [...prevFilters, star]
    );
  };

  const handleProductTypeSelection = (productTypeId: number) => {
    setSelectedProductTypes((prevTypes) =>
      prevTypes.includes(productTypeId)
        ? prevTypes.filter((id) => id !== productTypeId)
        : [...prevTypes, productTypeId]
    );
  };
  useEffect(() => {
    const applyFilters = () => {
      let filtered = products;

      if (starFilters.length > 0) {
        filtered = filtered.filter((product) =>
          starFilters.includes(Math.round(product.rating))
        );
      }

      if (selectedProductTypes.length > 0) {
        filtered = filtered.filter((product) =>
          selectedProductTypes.includes(product.productTypeId)
        );
      }
      setFilteredProducts(filtered);
      setNoResults(filtered.length === 0);
      setProductCount(filtered.length);
      setPageProduct(filtered.slice(0, itemsPerPage));
    };

    applyFilters();
  }, [starFilters, selectedProductTypes, products]);
  const handleResetFilters = () => {
    setQuery("");
    setSelectedProductType("");
    setStarFilters([]);
    setSelectedProductTypes([]);
    setSuggestions([]);
    setFilteredProducts(pageProduct);
    setProductCount(pageProduct.length);
    setNoResults(false);
  };

  // const searchUrl = `https://localhost:3000/product?${
  //   query == "" ? "" : `productName=${query}`
  // }${
  //   (query == "" && productTypeId == 0) || query == "" || productTypeId == 0
  //     ? ""
  //     : "&"
  // }${productTypeId == 0 ? "" : `productTypeId=${productTypeId}`}${
  //   (query == "" && productTypeId == 0) || selectedPriceRange == 0 ? "" : "&"
  // }${selectedPriceRange == 0 ? "" : `maxPrice=${selectedPriceRange}`}`;
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
      const filteredData = data.filter(
        (product: Product) => product.censor === true
      );
      setProductCount(filteredData.length);
      setFilteredProducts(filteredData);
      setPageProduct(filteredData.slice(0, itemsPerPage));
      setNoResults(filteredData.length === 0);
      setPageNumber(1);
    } catch (error) {
      console.error("Error searching products:", error);
      setNoResults(true);
    }
  };
  const totalItems = productCount;
  const itemsPerPage = 5;
  const handlePageChange = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPageProduct(filteredProducts.slice(startIndex, endIndex));
    setPageNumber(page);
  };
  const handleAddToCart = async (product: Product) => {
    if (!Token) {
      router.push("/login");
      return;
    }
    if (roles.includes("Creator")) {
      alert("Nhà cung cấp không có quyền đặt hàng");
      return;
    }
    const orderDetailData = {
      orderId: 0,
      productId: product.id,
      quantity: 1,
      unitPrice: 0,
    };
    try {
      const createOrderResponse = await fetch(
        "https://localhost:7146/api/admin/orders-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(orderDetailData),
        }
      );
      if (!createOrderResponse.ok) {
        throw new Error(`Failed : ${createOrderResponse.statusText}`);
      }
      alert("Add product success");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <div className="space-y-24">
      <div className="flex flex-col border items-center max-w-7xl w-full mt-36 text-center space-y-5 bg-white pt-14 pb-9 rounded-3xl shadow-2xl">
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
                className="pl-10 pr-4 py-2 w-[500px] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white shadow-md rounded-lg mt-2 z-10 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion.id}
                    href={`/product/search-product/${suggestion.product_Name.replaceAll(
                      " ",
                      "-"
                    )}?Id=${suggestion.id}`}
                  >
                    <li
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-2 hover:bg-gray-100 cursor-pointer "
                    >
                      {suggestion.product_Name}
                    </li>
                  </Link>
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

          <Button
            className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600"
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="font-bold text-4xl">Có {productCount} sản phẩm</div>
        <div className="mt-3 font-bold text-2xl text-teal-500">---------</div>
      </div>
      <div className="flex space-x-6">
        <div className="w-1/4 border shadow-ful rounded-3xl text-[1rem] mb-10 h-[1200px]">
          <div className="flex justify-between p-4">
            <div className="font-bold text-[1.3rem]">Lọc kết quả</div>
            <div
              className="hover:text-teal-500 cursor-pointer"
              onClick={handleResetFilters}
            >
              Đặt lại
            </div>
          </div>
          <div className="border"></div>
          <div className="p-4 space-y-5">
            <div className="font-medium text-[1.1rem] ">Xếp hạng sao</div>
            <div className="space-y-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <p className="flex items-center" key={star}>
                  <Input
                    type="checkbox"
                    className="w-4 mr-1"
                    onChange={() => handleStarFilterChange(star)}
                    checked={starFilters.includes(star)}
                  />
                  <span className="text-sm p-1">{star} sao</span>
                </p>
              ))}
            </div>
            <div className="font-medium text-[1.1rem]">Loại sản phẩm</div>
            {productTypes.map((productType) => (
              <div key={productType.id} className="flex items-center">
                <div>
                  {" "}
                  <Input
                    type="checkbox"
                    className="w-4 mr-1"
                    onChange={() => handleProductTypeSelection(productType.id)}
                    checked={selectedProductTypes.includes(productType.id)}
                  />
                </div>

                {productType.productType_Name}
              </div>
            ))}
          </div>
        </div>

        <div className="w-3/4 mb-10 space-y-5">
          {noResults ? (
            <div className="flex flex-col justify-center items-center pb-3 space-y-1 border rounded-3xl">
              <img src={"/images/server/sad.png"} alt="" />
              <div className="font-bold text-3xl">
                Rất tiếc, InnoTrade không tìm thấy kết quả cho bạn
              </div>
              <p>Nhấn OK để bắt đầu tìm kiếm mới.</p>

              <Button
                className="rounded-full h-[50px] border-2 bg-white text-black hover:bg-gray-100"
                onClick={handleResetFilters}
              >
                <span className="text-xl">Ok</span>{" "}
                <FaArrowRight className="ml-2 text-xl" />
              </Button>
            </div>
          ) : pageProduct.length > 0 ? (
            pageProduct
              .filter((product) => product.censor === true)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex rounded-3xl border w-full"
                >
                  <div className="flex my-7 ml-7 w-full space-x-7 max-w-4xl">
                    <Link
                      href={`/product/search-product/${product.product_Name.replaceAll(
                        " ",
                        "-"
                      )}?Id=${product.id}`}
                    >
                      <img
                        width={350}
                        height={300}
                        src={
                          product.productImages &&
                          product.productImages.length > 0
                            ? `https://localhost:7146/Resources/${product.productImages[0]?.images}`
                            : "/images/server/default.jpg"
                        }
                        alt={product.product_Name}
                        className="rounded-3xl  h-[250px] w-[1/2]"
                      />
                    </Link>

                    <div className="w-3/5 space-y-3">
                      <div className="flex items-center rounded-full w-36 bg-yellow-300 px-1 text-sm">
                        <FiStar className="mr-1" />{" "}
                        {product.rating
                          ? `${product.rating} ( ${product.comments.length} Đánh giá)`
                          : "No rating"}
                      </div>
                      <div className="font-bold text-3xl">
                        {product.product_Name}
                      </div>
                      <div>
                        {userInfo.find((user) => user.userId === product.userId)
                          ?.fullName || "N/A"}
                      </div>
                      <div>
                        {productTypes.find(
                          (type) => type.id === product.productTypeId
                        )?.productType_Name || "Unknown type"}
                      </div>
                      <div className="flex space-x-4">
                        <div className="rounded-full flex items-center">
                          Số lượng:
                          <span className="text-teal-400 font-bold text-lg pl-2">
                            {product.quantity}
                          </span>
                        </div>
                        <div className="rounded-full flex items-center">
                          Đã bán:
                          <span className="text-teal-700 font-bold text-lg pl-2">
                            0
                          </span>
                        </div>
                      </div>
                      <div className="border w-full"></div>
                      <div className="flex mx-3 justify-between items-center">
                        <div className="text-teal-500 font-bold text-xl">
                          {product.price.toLocaleString("en-US")}đ
                        </div>
                        <div>
                          <Button
                            className="rounded-full bg-teal-500 hover:bg-teal-700"
                            onClick={() => handleAddToCart(product)}
                          >
                            Đặt hàng
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            pageProduct
              .filter((product) => product.censor === true)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex rounded-3xl border w-full"
                >
                  <Link
                    href={`/product/search-product/${product.product_Name.replaceAll(
                      " ",
                      "-"
                    )}?Id=${product.id}`}
                  >
                    <div className="flex my-7 ml-7 w-full space-x-7">
                      <img
                        width={350}
                        height={300}
                        src={
                          product.productImages &&
                          product.productImages.length > 0
                            ? `https://localhost:7146/Resources/${product.productImages[0]?.images}`
                            : "/images/server/default.jpg"
                        }
                        alt={product.product_Name}
                        className="rounded-3xl  h-[250px] w-[1/2]"
                      />

                      <div className="w-3/5 space-y-3">
                        <div className="flex items-center rounded-full w-36 bg-yellow-300 px-1 text-sm">
                          <FiStar className="mr-1" />{" "}
                          {product.rating
                            ? `${product.rating} ( ${product.comments.length} Đánh giá)`
                            : "No rating"}
                        </div>
                        <div className="font-bold text-3xl">
                          {product.product_Name}
                        </div>
                        <div>
                          {userInfo.find(
                            (user) => user.userId === product.userId
                          )?.fullName || "N/A"}
                        </div>
                        <div>
                          {productTypes.find(
                            (type) => type.id === product.productTypeId
                          )?.productType_Name || "Unknown type"}
                        </div>
                        <div className="flex space-x-4">
                          <div className="rounded-full flex items-center">
                            Số lượng:
                            <span className="text-teal-400 font-bold text-lg pl-2">
                              {product.quantity}
                            </span>
                          </div>
                          <div className="rounded-full flex items-center">
                            Đã bán:
                            <span className="text-teal-700 font-bold text-lg pl-2">
                              0
                            </span>
                          </div>
                        </div>
                        <div className="border w-full"></div>
                        <div className="flex mx-3 justify-between items-center">
                          <div className="text-teal-500 font-bold text-xl">
                            {product.price.toLocaleString("en-US")}đ
                          </div>
                          <div>
                            <Link href={"/cart"}>
                              <Button
                                className="rounded-full bg-teal-500 hover:bg-teal-700"
                                onClick={() => handleAddToCart(product)}
                              >
                                Đặt hàng
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
          )}
          <div>
            <Pagination
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchBar;
