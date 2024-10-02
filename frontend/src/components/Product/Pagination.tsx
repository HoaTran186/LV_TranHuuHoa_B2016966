"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages =
    Math.floor(totalItems / itemsPerPage) +
    (totalItems % itemsPerPage > 0 ? 1 : 0);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayedPages = 5;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    if (startPage > 2) {
      pageNumbers.unshift("...");
      pageNumbers.unshift(1);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-lg">
        Đang xem:{" "}
        <span className="font-semibold rounded-full border px-4 py-3 border-slate-300">
          {currentPage}
        </span>{" "}
        của {totalPages}
      </div>
      <div className="flex rounded-full border">
        <Button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-5 py-2 rounded-l-full border-slate-300 ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed text-black"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <FaArrowLeft />
        </Button>
        {renderPageNumbers().map((page, index) => (
          <Button
            key={index}
            className={`px-3 py-2 border-slate-300 text-black rounded-none ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => typeof page === "number" && changePage(page)}
            disabled={page === "..."}
          >
            {page}
          </Button>
        ))}
        <Button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-5 py-2 rounded-r-full ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed text-black"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <FaArrowRight />
        </Button>
      </div>
    </div>
  );
};
export default Pagination;
