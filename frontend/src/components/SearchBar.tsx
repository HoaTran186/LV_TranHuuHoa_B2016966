"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";

interface Product {
  id: number;
  product_Name: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
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

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center bg-gray-100 p-2 rounded-full">
        <FiSearch className="h-5 w-5 text-gray-500 ml-2" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Tìm kiếm sản phẩm"
          className="bg-transparent ml-2 outline-none w-full"
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
  );
};

export default SearchBar;
