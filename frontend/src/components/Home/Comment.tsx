"use client";
import { useState, useEffect } from "react";
import { FaRegCommentDots } from "react-icons/fa";

interface Comment {
  id: number;
  title: string;
  comment: string;
  star: number;
  productId: number;
  userId: string;
  product: null;
  appUser: null;
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

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({});
  const [selectedCommentIndex, setSelectedCommentIndex] = useState(0);

  useEffect(() => {
    // Fetch comments
    fetch("http://localhost:5126/api/account/comment")
      .then((response) => response.json())
      .then((data) => setComments(data.slice(0, 5))); // Limit to 5 comments

    // Fetch user information
    fetch("http://localhost:5126/api/users-information")
      .then((response) => response.json())
      .then((data) => {
        const userMap: Record<string, string> = {};
        data.forEach((user: User) => {
          userMap[user.userId] = user.fullName; // Map userId to fullName
        });
        setUsers(userMap);
      });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSelectedCommentIndex((prevIndex) => (prevIndex + 1) % comments.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [comments]);

  if (comments.length === 0) {
    return <div>Loading comments...</div>;
  }

  const selectedComment = comments[selectedCommentIndex];
  const reviewerName = users[selectedComment.userId] || "Unknown user";

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
          {/* Display the title before the comment */}
          <p className="text-xl font-semibold text-gray-900 mb-2">
            {selectedComment.title}
          </p>
          <p className="text-lg italic text-gray-700 mb-4 flex">
            <FaRegCommentDots className="mr-1 text-3xl text-teal-500" />
            {selectedComment.comment}
          </p>
          <p className="text-left font-bold text-gray-800">{reviewerName}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {comments.map((comment, index) => (
            <span
              key={comment.id}
              onClick={() => setSelectedCommentIndex(index)}
              className={`bg-gray-100 border rounded-full px-4 py-2 text-gray-800 cursor-pointer hover:bg-gray-200 transition ${
                selectedCommentIndex === index ? "bg-gray-300" : ""
              }`}
            >
              {users[comment.userId] || "Unknown user"}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
