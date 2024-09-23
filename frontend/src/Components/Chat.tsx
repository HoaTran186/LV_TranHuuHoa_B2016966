"use client";
import React, { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

interface Message {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  isDelivered: boolean;
}

interface User {
  id: string;
  username: string;
}

export default function Chat({ Token }: { Token: string }) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const getDisplayName = (userId: string) => {
    return userId.length > 8 ? userId.substring(0, 8) + "..." : userId;
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5126/api/admin/account");
      const data = await response.json();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users: ", error);
    }
  }, []);

  const fetchChatHistory = useCallback(
    async (receiver: string) => {
      try {
        const response = await fetch(
          `http://localhost:5126/api/messages/${receiver}`,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }
        const data: Message[] = await response.json();
        console.log("Fetched chat history:", data);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    },
    [Token]
  );

  useEffect(() => {
    let isMounted = true;
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5126/chathub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .configureLogging(signalR.LogLevel.Debug)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log("Connected to SignalR Hub");
        if (isMounted) {
          setConnection(newConnection);
          setIsConnected(true);
        }

        newConnection.on("ReceiveMessage", (sender, content) => {
          console.log(`Received message from ${sender}: ${content}`);
          if (isMounted) {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: Date.now(),
                sender,
                receiver: user,
                content,
                timestamp: new Date().toISOString(),
                isDelivered: true,
              },
            ]);
          }
        });

        newConnection.on("UserConnected", (username) => {
          console.log(`${username} connected`);
          fetchUsers();
        });

        newConnection.on("UserDisconnected", (username) => {
          console.log(`${username} disconnected`);
          fetchUsers();
        });

        newConnection.on("MessageSent", (receiver, content) => {
          console.log(`Message sent to ${receiver}: ${content}`);
        });

        newConnection.onreconnecting(() => {
          console.log("Attempting to reconnect...");
          if (isMounted) setIsConnected(false);
        });

        newConnection.onreconnected(() => {
          console.log("Reconnected successfully");
          if (isMounted) setIsConnected(true);
        });
      } catch (error) {
        console.error("Connection failed: ", error);
        if (isMounted) setIsConnected(false);
      }
    };

    startConnection();

    return () => {
      isMounted = false;
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        newConnection.stop();
      }
    };
  }, [Token, user, fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (targetUser) {
      fetchChatHistory(targetUser);
    }
  }, [targetUser, fetchChatHistory]);

  const handleSendMessage = async () => {
    if (connection && targetUser && message) {
      try {
        await connection.invoke("SendPrivateMessage", targetUser, message);
        setMessage("");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now(),
            sender: user,
            receiver: targetUser,
            content: message,
            timestamp: new Date().toISOString(),
            isDelivered: false,
          },
        ]);
      } catch (error) {
        console.error("Error sending message: ", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Chat Application</h1>

      <div className="mb-4">
        <label
          htmlFor="user-name"
          className="block text-sm font-medium text-gray-700"
        >
          Enter your name
        </label>
        <input
          id="user-name"
          type="text"
          placeholder="Your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="user-select"
          className="block text-sm font-medium text-gray-700"
        >
          Choose a user to chat with:
        </label>
        <select
          id="user-select"
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.username}>
              {getDisplayName(u.username)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === user ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block bg-gray-200 rounded px-2 py-1">
              <strong>{getDisplayName(msg.sender)}: </strong>
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !targetUser || !message}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
