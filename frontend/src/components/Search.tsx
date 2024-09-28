import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiSearch } from "react-icons/fi";

const Search = () => {
  return (
    <div className="bg-gray-100 w-full flex flex-col justify-center items-center">
      <div className="relative w-screen max-w-7xl mx-4">
        <video
          className="rounded-lg shadow-lg"
          src="/images/video/background-video.mp4"
          autoPlay
          loop
          muted
        />
        {/* Search Section Overlapping the Image */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl mt-96 space-y-5 bg-white p-6 rounded-xl shadow-lg z-10">
          <h1 className="text-2xl font-bold text-center mb-4">
            Bạn lựa chọn du thuyền Hạ Long nào?
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Hơn 100 tour du thuyền hạng sang giá tốt đang chờ bạn
          </p>

          <div className="flex space-x-4 justify-center items-center">
            <div className="relative">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập tên du thuyền"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex-1 border border-gray-300 py-2 px-4 rounded-full cursor-pointer text-gray-500 focus:ring-2 focus:ring-teal-400 text-sm">
                Tất cả địa điểm
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-md p-2">
                <DropdownMenuLabel>Chọn địa điểm</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Hạ Long</DropdownMenuItem>
                <DropdownMenuItem>Nha Trang</DropdownMenuItem>
                <DropdownMenuItem>Phú Quốc</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* DropdownMenu Mức Giá */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex-1 border border-gray-300 py-2 px-4 rounded-full cursor-pointer text-gray-500 focus:ring-2 focus:ring-teal-400 text-sm">
                Tất cả mức giá
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-md p-2">
                <DropdownMenuLabel>Chọn mức giá</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Dưới 1 triệu</DropdownMenuItem>
                <DropdownMenuItem>1 - 3 triệu</DropdownMenuItem>
                <DropdownMenuItem>Trên 3 triệu</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Nút Tìm Kiếm */}
            <button className="bg-teal-500 text-white py-2 px-6 rounded-full hover:bg-teal-600">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Search;
