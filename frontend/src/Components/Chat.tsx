"use client";
import { useState, useEffect } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { IoSendSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";

interface Message {
  user: string;
  message: string;
}
interface Mess {
  id: number;
  userId: string;
  content: string;
  timestamp: Date;
}
interface User {
  id: number;
  fullName: string;
  userId: string;
}
interface ChatProps {
  Token: string | undefined;
}
export default function Chat({ Token }: ChatProps) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [mess, setMess] = useState<Mess[]>([]);
  const [userId, setUserId] = useState("");
  const [allUser, setAllUser] = useState<User[]>([]);
  const [visibleMessages, setVisibleMessages] = useState(10);
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7146/chatHub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");
        setConnection(newConnection);

        newConnection.on("ReceiveMessage", (user: string, message: string) => {
          console.log("Received message:", user, message);
          setMessages((prevMessages) => [...prevMessages, { user, message }]);
        });
      })
      .catch((error) =>
        console.error("Error connecting to SignalR hub:", error)
      );

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);
  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        const response = await fetch("https://localhost:7146/api/messages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        });

        if (response.ok) {
          const messages: Mess[] = await response.json();
          setMess(messages);
        } else {
          console.error("Error fetching message history:", response.status);
        }
      } catch (error) {
        console.error("Error fetching message history:", error);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://localhost:7146/api/user/user-information",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        setUser(data.fullName);
        setUserId(data.userId);
      } catch (error) {}
    };
    const fetchAllUser = async () => {
      try {
        const res = await fetch("https://localhost:7146/api/users-information");
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: User[] = await res.json();
        setAllUser(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUser();
    fetchAllUser();
    fetchMessageHistory();
  }, []);
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (connection && message && user) {
      try {
        console.log("Sending message:", user, message);
        await connection.invoke("SendMessage", user, message);
        const response = await fetch("https://localhost:7146/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify({ content: message }),
        });

        if (response.ok) {
          const savedMessage = await response.json();
          console.log("Message saved:", savedMessage);
          setMessage("");
        } else {
          console.error("Error saving message:", response.status);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  const showMoreMessages = () => {
    setVisibleMessages((prevVisible) => prevVisible + 10);
  };
  return (
    <div className="border-2 mx-[25rem] mb-10 rounded-3xl p-10">
      <h1>Real-time Chat</h1>
      <div className="flex flex-col items-start">
        {visibleMessages < mess.length && (
          <button
            onClick={showMoreMessages}
            className="text-blue-500 hover:underline"
          >
            Xem thêm tin nhắn cũ
          </button>
        )}
        {/* Hiển thị lịch sử tin nhắn */}
        {mess.slice(-visibleMessages).map((mess) => {
          const user = allUser.find((u) => u.userId === mess.userId);
          const isCurrentUser = mess.userId === userId;
          return (
            <div
              key={mess.id}
              className={`flex items-center mb-[8px] ${
                isCurrentUser ? "self-end" : "self-start"
              }`}
            >
              {!isCurrentUser && (
                <div className="mr-2">
                  <Avatar>
                    <AvatarImage
                      src="/images/server/user.png"
                      alt="@InnoTrade"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                <small>{isCurrentUser ? "You" : user?.fullName}</small>
                <div
                  className={`py-[8px] px-[16px] rounded-[8px] ${
                    isCurrentUser ? "bg-white" : "bg-[#39a7cb]"
                  }`}
                >
                  <strong>{mess.content}</strong>
                </div>
              </div>
              {isCurrentUser && (
                <div className="ml-2">
                  <Avatar>
                    <AvatarImage
                      src="/images/server/user.png"
                      alt="@InnoTrade"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-start">
        {/* Hiển thị tin nhắn mới từ SignalR */}
        {messages.map((m, index) => {
          const isCurrentUser = m.user === user;

          return (
            <div
              key={index}
              className={`flex items-center mb-[8px] ${
                isCurrentUser ? "self-end" : "self-start"
              }`}
            >
              {!isCurrentUser && (
                <div className="mr-2">
                  <Avatar>
                    <AvatarImage
                      src="/images/server/user.png"
                      alt="@InnoTrade"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                <small>{isCurrentUser ? "You" : m.user}</small>
                <div
                  className={`py-[8px] px-[16px] rounded-[8px] ${
                    isCurrentUser ? "bg-white" : "bg-[#39a7cb]"
                  }`}
                >
                  <strong>{m.message}</strong>
                </div>
              </div>
              {isCurrentUser && (
                <div className="ml-2">
                  <Avatar>
                    <AvatarImage
                      src="/images/server/user.png"
                      alt="@InnoTrade"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-right">
        {" "}
        <form onSubmit={sendMessage}>
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-full"
            />
            <Button
              type="submit"
              className="rounded-full bg-white hover:bg-slate-200"
            >
              <IoSendSharp className="text-2xl text-blue-400" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
