"use client";
import Pagination from "@/components/Product/Pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MyForumProps {
  Token: string | undefined;
}
interface ForumImages {
  id: number;
  images: string;
  forumId: number;
}
interface Forum {
  id: number;
  title: string;
  content: string;
  uploadDate: Date;
  rating: number;
  browse: boolean;
  userId: string;
  commentForums: [];
  forumImages: ForumImages[];
}
export default function MyForum({ Token }: MyForumProps) {
  const [forum, setForum] = useState<Forum[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [countForum, setCountForum] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const fetchForum = async () => {
      try {
        const res = await fetch(
          "https://localhost:7146/api/account/forum/my-forum",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch forum");
        }
        const data = await res.json();
        setCountForum(data.length);
      } catch (error) {
        alert(error);
      }
    };
    const fetchUserForum = async () => {
      try {
        const res = await fetch(
          `https://localhost:7146/api/account/forum/my-forum?PageNumber=${pageNumber}&PageSize=6`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user forum");
        }
        const data = await res.json();
        setForum(data);
      } catch (error) {
        alert(error);
      }
    };
    fetchForum();
    fetchUserForum();
  }, [pageNumber]);
  const handleDelete = async (forumId: number) => {
    const confirmDelete = confirm("Bạn có chắc muốn xóa bài viết này không?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `https://localhost:7146/api/account/forum/${forumId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed");
      }
      setForum((prevForums) => prevForums.filter((f) => f.id !== forumId));
    } catch (error) {
      alert(error);
    }
  };
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };
  const totalItems = countForum;
  const itemsPerPage = 6;
  return (
    <div className="space-y-14 mx-48 mb-10">
      <div className="space-y-5">
        <h2 className="font-bold text-3xl">Các bài chia sẻ của bạn</h2>
        <p className="font-bold text-3xl text-teal-500">---------</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forum.map((forum) => (
          <div className="max-w-sm border-2 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mt-3 ml-3"
              onClick={() => handleDelete(forum.id)}
            >
              Xóa
            </button>
            <Link
              href={`/forum/my-forum/edit/${forum.title.replaceAll(
                " ",
                "-"
              )}?Id=${forum.id}`}
            >
              <div className="p-8">
                <img
                  className="w-[350px] h-[200px] object-cover rounded-2xl"
                  src={
                    forum.forumImages && forum.forumImages.length > 0
                      ? `https://localhost:7146/Resources/${forum.forumImages[0]?.images}`
                      : `/images/server/default.jpg`
                  }
                  alt="Địa điểm du lịch"
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-bold text-slate-500"></p>
                <h2 className="font-bold text-lg mb-2 line-clamp-2">
                  {forum.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {forum.content}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-xs">
                    {" "}
                    {new Date(forum.uploadDate).toLocaleDateString()}
                  </p>
                  <p
                    className={`${
                      forum.browse === true
                        ? "bg-green-300 rounded-full p-1"
                        : "bg-red-300 rounded-full p-1"
                    }`}
                  >
                    {forum.browse === true ? "Đã duyệt" : "Chưa được duyệt"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="border"></div>
      <div>
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
