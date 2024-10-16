"use client";
import React, { useEffect, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

interface Message {
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  id: string;
}
interface User {
  id: number;
  fullName: string;
  userId: string;
}
interface ChatPrivateProps {
  Token: string | undefined;
}

export default function ChatPrivate({ Token }: ChatPrivateProps) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [senderId, setSenderId] = useState("");
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

        newConnection.on(
          "ReceivePrivateMessage",
          (
            senderId: string,
            senderName: string,
            receiverId: string,
            message: string,
            messageId: string,
            receiverName: string
          ) => {
            console.log(
              "Received private message:",
              senderId,
              senderName,
              receiverId,
              message,
              messageId
            );
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                senderId,
                senderName,
                receiverId,
                content: message,
                id: messageId,
              },
            ]);
          }
        );
      })
      .catch((error) =>
        console.error("Error connecting to SignalR hub:", error)
      );

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [Token]);
  useEffect(() => {
    try {
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
          setSenderId(data.userId);
        } catch (error) {}
      };
      fetchUser();
    } catch (error) {}
  });
  const sendPrivateMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (connection && newMessage && receiverId) {
      try {
        await connection.invoke(
          "SendPrivateMessage",
          senderId,
          receiverId,
          newMessage,
          ""
        );
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  console.log(newMessage);
  console.log(messages);
  return (
    <div className="flex flex-col h-screen p-5 bg-gray-100">
      <div>
        <h2 className="text-2xl font-bold mb-4">Private Chat</h2>
        <ul className="flex flex-col gap-2 overflow-y-auto">
          {messages.map((msg, index) => (
            <li key={index} className="bg-white p-3 rounded-md shadow-md">
              <span className="font-bold mr-2">{msg.senderName}:</span>{" "}
              {msg.content}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={sendPrivateMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Enter message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
