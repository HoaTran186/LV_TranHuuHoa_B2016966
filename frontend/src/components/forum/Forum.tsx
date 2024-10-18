"use client";
import Pagination from "@/components/Product/Pagination";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  forumImages: ForumImages[];
}
interface UserInfo {
  id: number;
  fullName: string;
  userId: string;
}
export default function Forum() {
  const [pageNumber, setPageNumber] = useState(1);
  const [forumCount, setForumCount] = useState<number>(0);
  const [forum, setForum] = useState<Forum[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [forumRespone, userInfoResponse] = await Promise.all([
          fetch("https://localhost:7146/api/account/forum"),
          fetch("https://localhost:7146/api/users-information"),
        ]);

        if (!forumRespone.ok || !userInfoResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const forumData = await forumRespone.json();
        const userInfoData = await userInfoResponse.json();

        const fillterData = forumData.filter(
          (forum: Forum) => forum.browse === true
        );

        setForumCount(fillterData.length);
        setUserInfo(userInfoData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchPageForum = async () => {
      try {
        setLoading(true); // Set loading to true before starting API call
        const res = await fetch(
          `https://localhost:7146/api/account/forum?PageNumber=${pageNumber}&PageSize=6`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch page forum");
        }
        const forumPage = await res.json();
        setForum(forumPage);
      } catch (error) {
        console.log("Error fetching forum:", error);
      } finally {
        setLoading(false); // Set loading to false after API call completes
      }
    };

    fetchPageForum();
  }, [pageNumber]);

  const findUserForForum = (userId: string) => {
    return userInfo.find((user) => user.userId === userId);
  };
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const totalItems = forumCount;
  const itemsPerPage = 6;

  return (
    <div className="mx-36 mt-36 space-y-10 mb-10">
      <div className="w-[42rem] text-left space-y-3">
        <p className="font-bold text-3xl">
          Diễn đàn <span className="text-teal-500">In</span>no
          <span className="text-teal-500">Trade</span> : Nơi chia sẽ kinh nghiệm
          và Cập nhật tin tức mới nhất
        </p>
        <p className="text-lg">
          Innotrade: Khám phá và Cập nhật những tin tức hấp dẫn từ điểm đến
          tuyệt vời này.
        </p>
        <p className="font-bold text-teal-500 text-2xl">-----------</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forum
          .filter((forum) => forum.browse === true)
          .map((forum) => {
            const matchingUser = findUserForForum(forum.userId);
            const userName = matchingUser
              ? matchingUser.fullName
              : "Unknown User";
            return (
              <Link
                href={`/forum-detail/${forum.title.replaceAll(" ", "-")}&${
                  forum.id
                }`}
              >
                <div className="max-w-sm border-2 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                    <p className="text-sm font-bold text-slate-500">
                      {userName}
                    </p>
                    <h2 className="font-bold text-lg mb-2 line-clamp-2">
                      {forum.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {forum.content}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {" "}
                      {new Date(forum.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
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
