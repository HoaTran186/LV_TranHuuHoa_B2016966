"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

interface CreateForumProps {
  Token: string | undefined;
}
export default function CreateForum({ Token }: CreateForumProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [image, setImage] = useState<File | null>(null); // Từ string | null thành File | null
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMultipleDragging, setIsMultipleDragging] = useState(false);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Sử dụng file thay vì URL
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true); // Kích hoạt trạng thái kéo thả
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false); // Hủy kích hoạt trạng thái kéo thả
    const files = e.dataTransfer.files;

    // Kiểm tra nếu files không null và có ít nhất một file
    if (files && files.length > 0) {
      setImage(files[0]); // Lưu trữ đối tượng File thay vì URL
    }
  };

  const handleMultipleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files; // Gán files để dễ kiểm tra
    if (files && files.length > 0) {
      setAdditionalImages((prevImages) => [
        ...prevImages,
        ...Array.from(files!), // Sử dụng ! để đảm bảo không null khi chuyển đổi
      ]);
    }
  };

  const handleMultipleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsMultipleDragging(true);
  };
  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };
  const handleMultipleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsMultipleDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      setAdditionalImages((prevImages) => [
        ...prevImages,
        ...Array.from(files), // Thêm các File vào mảng
      ]);
    }
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, title]);
  const handleSubmit = async () => {
    const dataForum = {
      title: title,
      content: content,
    };
    try {
      const res = await fetch("https://localhost:7146/api/account/forum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(dataForum),
      });
      if (!res.ok) {
        throw new Error(`Failed to forum: ${res.statusText}`);
      }
      const forumData = await res.json();
      const forumId = forumData.id;
      const formData = new FormData();
      if (image) {
        formData.append("Images", image);
      }
      additionalImages.forEach((file) => {
        formData.append("Images", file);
      });
      const imageUpload = await fetch(
        `https://localhost:7146/api/account/forum-images/${forumId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
          body: formData,
        }
      );
      if (!imageUpload.ok) {
        throw new Error(`Failed to upload images: ${imageUpload.statusText}`);
      }
      alert("Đăng bài viết thành công!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-lg bg-white">
      <textarea
        ref={textareaRef}
        className="w-full p-4 text-xl border border-gray-300 rounded-lg mb-6 border-none focus:outline-none"
        placeholder="Nhập tiêu đề bài viết..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div
        className={`relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg mb-6 flex justify-center items-center ${
          isDragging ? "bg-gray-100" : ""
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label
          htmlFor="image-upload"
          className="cursor-pointer w-full h-full flex justify-center items-center"
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Ảnh đại diện"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <p>Thêm ảnh đại diện</p>
              <p>Hoặc kéo và thả</p>
            </div>
          )}
        </label>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      <textarea
        ref={textareaRef}
        className="w-full p-4 border border-gray-300 rounded-lg mb-6 "
        placeholder="Viết nội dung mà bạn muốn chia sẻ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div
        className={`relative w-full border-2 border-dashed border-gray-300 rounded-lg mb-6 p-4 ${
          isMultipleDragging ? "bg-gray-100" : ""
        }`}
        onDragOver={handleMultipleDragOver}
        onDrop={handleMultipleDrop}
      >
        <label
          htmlFor="multiple-image-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <p className="text-gray-500 mb-4">
            Thêm ảnh khác (có thể chọn nhiều ảnh hoặc kéo thả)
          </p>
          <input
            id="multiple-image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleMultipleImageUpload}
          />
        </label>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {additionalImages.length > 0 &&
            additionalImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Hình ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full"
                  onClick={() => handleRemoveAdditionalImage(index)}
                >
                  X
                </button>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          className="px-6 py-2 border border-blue-500 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Đăng
        </Button>
      </div>
    </div>
  );
}
