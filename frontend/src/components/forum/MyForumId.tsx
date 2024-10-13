"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

interface ForumImages {
  id: number;
  images: string;
  forumId: number;
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
interface MyForumIdProps {
  Token: string | undefined;
}
export default function MyForumId({ Token }: MyForumIdProps) {
  const [forumId, setForumId] = useState<string | null>(null);
  const [forumDetail, setForumDetail] = useState<Forum | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const id = params.get("Id");
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
          setTitle(data.title);
          setContent(data.content);
        } catch (error) {
          alert(error);
        }
      };
      const fetchUser = async () => {
        try {
          const res = await fetch(
            "https://localhost:7146/api/users-information"
          );
          if (!res.ok) {
            throw new Error("Failed to fetch user");
          }
          const data = await res.json();
          setUser(data);
        } catch (error) {}
      };
      fetchUser();
      fetchForumDetail();
    }
  }, []);
  const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && forumId) {
      const formData = new FormData();
      Array.from(event.target.files).forEach((file) => {
        formData.append("Images", file); // 'Images' phải khớp với tên trong API
      });

      try {
        const res = await fetch(
          `https://localhost:7146/api/account/forum-images/${forumId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${Token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to upload images: ${res.statusText}`);
        }

        const updatedImages = await res.json();
        setForumDetail((prev) => {
          if (prev === null) {
            return null;
          }

          return {
            ...prev,
            forumImages: [...prev.forumImages, ...updatedImages],
          };
        });
        alert("Images uploaded successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error uploading images:", error);
        alert("Failed to upload images");
      }
    }
  };
  const handleDeleteImage = async (imageId: number) => {
    if (forumId && Token) {
      try {
        const res = await fetch(
          `https://localhost:7146/api/account/forum-images/${imageId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to delete image: ${res.statusText}`);
        }

        setForumDetail((prev) => {
          if (prev === null) {
            return null;
          }
          const updatedImages = prev.forumImages.filter(
            (image) => image.id !== imageId
          );

          return {
            ...prev,
            forumImages: updatedImages,
          };
        });
        alert("Image deleted successfully");
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image");
      }
    }
  };

  const handleUpdate = async () => {
    const data = {
      title: title,
      content: content,
    };
    try {
      const res = await fetch(
        `https://localhost:7146/api/account/forum/${forumId}`,
        {
          method: "PUT",
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
      const newforumDetail = await res.json();
      setForumDetail(newforumDetail);
      alert("Success update");
    } catch (error) {
      alert("Failed to update forum");
    }
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [title, content]);
  const forumAuthor = user.find((u) => u.userId === forumDetail?.userId);
  return (
    <div className="my-10 mt-28">
      <div className="mx-36 space-y-6">
        <h2 className="mt-20 font-bold text-3xl">
          <textarea
            className="w-full"
            ref={textareaRef}
            onChange={handleTitleChange}
            value={title}
          />
        </h2>
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
          <textarea
            ref={textareaRef}
            onChange={handleContentChange}
            value={content}
            className="w-full"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="fileUpload"
            className="cursor-pointer bg-teal-500 text-white p-2 rounded"
          >
            Thêm ảnh
          </label>
          <input
            type="file"
            id="fileUpload"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleAddImage}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forumDetail?.forumImages && forumDetail.forumImages.length > 0 ? (
            forumDetail.forumImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  key={index}
                  className="object-cover rounded-2xl w-full h-48"
                  src={`https://localhost:7146/Resources/${image.images}`}
                  alt={`Image ${index + 1}`}
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <img
              className="object-cover rounded-2xl w-full h-48"
              src="/images/server/default.jpg"
              alt="Default"
            />
          )}
        </div>
        <div className="text-right">
          <Button
            className="rounded-full bg-teal-500 hover:bg-teal-700"
            onClick={handleUpdate}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
}
