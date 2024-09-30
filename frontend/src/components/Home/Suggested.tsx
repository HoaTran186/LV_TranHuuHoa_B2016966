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

const cruises: Cruise[] = [
  {
    id: 1,
    name: "Du thuyền Heritage Bình Chuẩn Cát Bà sada sfsfsf aswqwqwq affsfs ưqw",
    location: "Vịnh Hạ Long",
    yearBuilt: 2019,
    shipType: "Tàu vỏ Kim loại",
    rooms: 20,
    price: 3675000,
    rating: 4.9,
    reviews: 11,
    image: "/images/Logo/logo.png",
  },
  {
    id: 2,
    name: "Du Thuyền Stellar of the Seas",
    location: "Vịnh Hạ Long",
    yearBuilt: 2018,
    shipType: "Tàu vỏ Kim loại",
    rooms: 22,
    price: 5450000,
    rating: 5.0,
    reviews: 7,
    image: "/images/Logo/logo.png",
  },
  {
    id: 3,
    name: "Du thuyền Ambassador Hạ Long",
    location: "Vịnh Hạ Long",
    yearBuilt: 2018,
    shipType: "Tàu vỏ Kim loại",
    rooms: 46,
    price: 4225000,
    rating: 5.0,
    reviews: 3,
    image: "/images/Logo/logo.png",
  },
  {
    id: 4,
    name: "Du thuyền Ambassador Cát Bà",
    location: "Vịnh Hạ Long",
    yearBuilt: 2018,
    shipType: "Tàu vỏ Kim loại",
    rooms: 46,
    price: 4225000,
    rating: 5.0,
    reviews: 3,
    image: "/images/Logo/logo.png",
  },
];

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
            Tận hưởng sự xa hoa và đẳng cấp tối đa trên du thuyền mới nhất và
            phổ biến nhất. Khám phá một hành trình tuyệt vời đưa bạn vào thế
            giới của sự sang trọng, tiện nghi và trải nghiệm không thể quên.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cruises.slice(0, 3).map((cruise) => (
          <div
            key={cruise.id}
            className="bg-white border shadow-inner shadow-gray-200 rounded-2xl overflow-hidden"
          >
            <div className="p-8 ">
              <img
                src={cruise.image}
                alt={cruise.name}
                className="w-full h-56 object-cover rounded-2xl"
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-yellow-500">
                  <FiStar />
                  <span className="ml-1 font-bold">{cruise.rating}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    ({cruise.reviews} đánh giá)
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{cruise.name}</h3>
              <p className="text-gray-500 flex">
                <FaSearchLocation className="mt-1 mr-1" /> {cruise.location}
              </p>
              <p className="text-gray-500 text-sm">
                {cruise.location}-{cruise.yearBuilt} - {cruise.shipType} -{" "}
                {cruise.rooms} phòng
              </p>
              <div className="flex mt-2">
                <p className="text-teal-500 font-bold text-lg mt-2">
                  {cruise.price.toLocaleString()}đ / khách
                </p>
                <button className="bg-teal-500 text-white py-2 px-4 rounded-full ml-14 hover:bg-teal-600">
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button className="border flex bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100">
          Xem tất cả <FaAngleDoubleRight className="mt-1 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Suggested;
