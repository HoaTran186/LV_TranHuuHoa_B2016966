import React from "react";
import { FaAngleDoubleRight, FaSearchLocation } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

interface Cruise {
  id: number;
  name: string;
  location: string;
  yearBuilt: number;
  shipType: string;
  rooms: number;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

const Suggested = () => {
  return (
    <div className="container w-full py-8 px-36">
      <div className="flex flex-row justify-between mb-10">
        <div className="text-3xl font-bold text-left mb-6 w-2/5">
          <h4>Gợi ý sản phẩm</h4>
          <div className="pt-10">
            <span className="text-teal-300">---------</span>
          </div>
        </div>
        <div className="text-left text-gray-500 mb-12 w-2/5 text-lg">
          <p>
            Gợi ý sản phẩm là một công cụ hữu ích giúp người tiêu dùng tìm kiếm
            và lựa chọn sản phẩm một cách nhanh chóng và dễ dàng.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      <div className="flex justify-center mt-8">
        <button className="border flex bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100">
          Xem tất cả <FaAngleDoubleRight className="mt-1 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Suggested;
