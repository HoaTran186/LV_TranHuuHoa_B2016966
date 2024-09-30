"use client";
import { useState, useEffect } from "react";
import { FaRegCommentDots } from "react-icons/fa";

const reviews = {
  "Chị Thu Hà":
    "Cảm ơn team đã cho mình trải nghiệm quá ưng ý. Đi đúng hôm thời tiết đẹp, ngắm cảnh vịnh Hạ Long tuyệt vời. Phục vụ chu đáo, phòng ốc đẹp!",
  "Anh Khánh":
    "Tôi rất hài lòng với chuyến đi. Tư vấn viên rất nhiệt tình và có nhiều kinh nghiệm. Tôi sẽ quay lại lần nữa!",
  "Chị Linh - Anh Dũng":
    "Chuyến đi quá tuyệt vời! Buffet hải sản ngon, phong cảnh đẹp. Mọi thứ đều hoàn hảo!",
  "Bạn Minh Hoàng":
    "Đi đúng hôm thời tiết đẹp, ngắm cảnh vịnh Hạ Long đẹp tuyệt vời. Nhân viên phục vụ chu đáo, phòng ốc đẹp. Tuyệt vời lắm!",
  "Cô Thanh Hằng và bạn":
    "Chuyến đi rất thú vị. Hải sản tươi ngon, dịch vụ chu đáo. Mình sẽ giới thiệu cho bạn bè!",
} as const;

type Reviewer = keyof typeof reviews;

export default function Comments() {
  const [selectedReviewer, setSelectedReviewer] =
    useState<Reviewer>("Bạn Minh Hoàng");

  const reviewers = Object.keys(reviews) as Reviewer[];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentIndex = reviewers.indexOf(selectedReviewer);

      const nextIndex = (currentIndex + 1) % reviewers.length;
      setSelectedReviewer(reviewers[nextIndex]);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedReviewer, reviewers]);

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <section className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Đánh giá từ những người đã trải nghiệm
        </h2>
        <span className="font-bold text-3xl text-teal-500">---------</span>
        <p className="text-gray-600 mb-8">
          Khách hàng chia sẻ về những kỷ niệm tuyệt vời trên chuyến du lịch với
          chúng tôi.
        </p>

        <div className="mb-8">
          <p className="text-lg italic text-gray-700 mb-4 flex">
            <FaRegCommentDots className=" mr-1 text-3xl text-teal-500" />
            {reviews[selectedReviewer]}
          </p>
          <p className="text-left font-bold text-gray-800">
            {selectedReviewer}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {reviewers.map((reviewer) => (
            <span
              key={reviewer}
              onClick={() => setSelectedReviewer(reviewer)}
              className={`bg-gray-100 border rounded-full px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-200 transition ${
                selectedReviewer === reviewer ? "bg-gray-300" : ""
              }`}
            >
              {reviewer}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
