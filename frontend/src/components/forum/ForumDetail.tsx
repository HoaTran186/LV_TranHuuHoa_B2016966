"use client";

import StarRating from "@/components/forum/StarRating";
import Pagination from "@/components/Product/Pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { IoChatboxEllipsesOutline, IoHomeOutline } from "react-icons/io5";
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
interface CommentForum {
  id: number;
  star: number;
  comment: string;
  dateComment: Date;
  forumId: number;
  userId: string;
}
interface User {
  id: number;
  fullName: string;
  age: number;
  job: string;
  address: string;
  phone: string;
  userId: string;
}

interface ForumImages {
  id: number;
  images: string;
  forumId: number;
}
interface CommentForumProps {
  Token: string | undefined;
}
export default function ForumDetail({ Token }: CommentForumProps) {
  const [forumDetail, setForumDetail] = useState<Forum | null>(null);
  const [comment, setComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageComment, setPageComment] = useState<CommentForum[]>([]);
  const [user, setUser] = useState<User[]>([]);
  const [stars, setStars] = useState(0);
  const [forumId, setForumId] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const parts = url.pathname.split("&");
      const id = parts[1];
      setForumId(id);
      const fetchForumDetail = async () => {
        try {
          const res = await fetch(
            `https://localhost:7146/api/account/forum/${id}`
          );
          if (!res.ok) {
            throw new Error("Failed to fetch forum detail");
          }
          const data = await res.json();
          setForumDetail(data);
        } catch (error) {}
      };
      fetchForumDetail();
      const fetchCommentForum = async () => {
        try {
          const res = await fetch(
            `https://localhost:7146/api/account/forum-comment/${id}?PageNumber=${pageNumber}&PageSize=5`
          );
          if (!res.ok) {
            throw new Error("Failed to fetch forum comment");
          }
          const data = await res.json();
          setPageComment(data);
        } catch (error) {}
      };
      fetchCommentForum();
    }
    const fetchUser = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/users-information");
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {}
    };
    fetchUser();
  }, [pageNumber]);
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);
  const handleRatingChange = (newRating: number) => {
    setStars(newRating);
  };
  useEffect(() => {}, []);
  const handleSendComment = async () => {
    const data = {
      star: stars,
      comment: comment,
    };
    try {
      const res = await fetch(
        `https://localhost:7146/api/account/forum-comment/${forumId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        throw new Error(`Failed : ${res.statusText}`);
      }
      const newComment = await res.json();

      setPageComment((prevComments) => [newComment, ...prevComments]);
      setComment("");
    } catch (error) {
      alert("Để bình luận bài viết vui lòng đăng nhập!!");
      router.push("/login");
    }
  };
  const totalItems = forumDetail?.commentForums.length || 0;
  const itemsPerPage = 5;
  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };
  const forumAuthor = user.find((u) => u.userId === forumDetail?.userId);
  return (
    <div className="my-10 mt-28">
      <nav className="w-full h-[3rem] border-2">
        <div className="flex flex-row space-x-3 ml-36">
          <Link href={"/"} className="text-2xl mt-3">
            <IoHomeOutline />
          </Link>
          <FaChevronRight className="mt-5" />
          <Link href={"/forum"} className="mt-3 text-lg">
            Diễn đàn
          </Link>
          <FaChevronRight className="mt-5" />
          <p className="mt-3 text-lg cursor-pointer hover:text-teal-400">
            {forumDetail?.title}
          </p>
        </div>
      </nav>
      <div className="mx-36 space-y-6">
        <h2 className="mt-20 font-bold text-3xl">{forumDetail?.title}</h2>
        <p className="text-sm bg-slate-200 rounded-full w-24 items-center px-2">
          {forumDetail?.uploadDate
            ? new Date(forumDetail.uploadDate).toLocaleDateString()
            : "Unknown Date"}
        </p>
        <p>
          Người đăng :{" "}
          <span>{forumAuthor ? forumAuthor.fullName : "Unknown"}</span>
        </p>
        <img
          className="object-cover rounded-2xl"
          src={
            forumDetail?.forumImages && forumDetail.forumImages.length > 0
              ? `https://localhost:7146/Resources/${forumDetail.forumImages[0]?.images}`
              : `/images/server/default.jpg`
          }
          alt=""
        />
        <div className="italic">
          {forumDetail?.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forumDetail?.forumImages && forumDetail.forumImages.length > 0 ? (
            forumDetail.forumImages.map((image, index) => (
              <img
                key={index}
                className="object-cover rounded-2xl w-full h-48"
                src={`https://localhost:7146/Resources/${image.images}`}
                alt={`Image ${index + 1}`}
              />
            ))
          ) : (
            <img
              className="object-cover rounded-2xl w-full h-48"
              src="/images/server/default.jpg"
              alt="Default"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4 mt-4 border mx-36 border-x-0">
        <div className="flex justify-between w-full max-w-lg ">
          <Button className="items-center space-x-2 bg-white border-none text-black my-1 hover:bg-slate-100 text-lg">
            <IoChatboxEllipsesOutline />
            <span>Bình luận</span>
          </Button>
          <Button className="items-center space-x-2 bg-white border-none text-black my-1 hover:bg-slate-100 text-lg">
            <IoIosShareAlt />
            <span>Chia sẻ</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4 border-t-0 border mx-36 border-x-0">
        <div className="flex text-lg space-x-2 p-2">
          <span>Xếp hạng bài viết:</span>{" "}
          <StarRating onRatingChange={handleRatingChange} />
        </div>
      </div>
      <div className="p-4 mx-36 mt-3 border bg-white rounded-lg shadow-lg">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
            <Avatar>
              <AvatarImage src="/images/server/user.png" alt="@InnoTrade" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              className="w-full min-h-[3rem] border-none border-gray-300 rounded-lg p-2 focus:outline-none  resize-none overflow-hidden"
              placeholder="Bạn nghĩ gì về chủ đề này?"
              value={comment}
              onChange={handleCommentChange}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSendComment}
            disabled={!comment.trim()}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring ${
              comment.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Gửi
          </Button>
        </div>
      </div>
      {pageComment.map((comment) => {
        const commentAuthor = user.find((u) => u.userId === comment.userId);
        return (
          <div className="p-4 mx-36 mt-3 border bg-white rounded-lg shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <Avatar>
                  <AvatarImage src="/images/server/user.png" alt="@InnoTrade" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-2">
                <p className="font-bold text-teal-500">
                  {commentAuthor ? commentAuthor.fullName : "Unknown"}
                  <i className="text-xs ml-10">
                    {new Date(comment.dateComment).toLocaleDateString("vi-VN")}
                  </i>
                </p>
                <p>{comment.comment}</p>
              </div>
            </div>
          </div>
        );
      })}
      <div className="mx-36 ">
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
